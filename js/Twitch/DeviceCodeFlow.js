"use strict";


class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        var _a;
        if (!this.events[event]) {
            this.events[event] = [listener];
        }
        else {
            (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.push(listener);
        }
    }
    emit(event, ...args) {
        var _a;
        (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.forEach(listener => listener(...args));
    }
    off(event, listener) {
        var _a;
        this.events[event] = (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.filter(l => l !== listener);
    }
    once(event, listener) {
        const onceListener = (...args) => {
            listener(...args);
            this.off(event, onceListener);
        };
        this.on(event, onceListener);
    }
}
class AuthToken {
    constructor(options) {
        this.accessToken = options.accessToken;
        this.refreshToken = options.refreshToken;
        this.expiresIn = options.expiresIn;
        this.createdAt = options.createdAt;
        this.scopes = options.scopes;
        this.tokenType = options.tokenType;
        this.clientId = options.clientId;
        this.login = options.login;
        this.userId = options.userId;
    }
    static async validate(accessToken) {
        const url = 'https://id.twitch.tv/oauth2/validate';
        const headers = {
            Authorization: `OAuth ${accessToken}`
        };
        const now = Date.now();
        const res = await fetch(url, { headers });
        const json = await res.json();
        if ('status' in json) {
            throw new Error(`[${json.status}] ${json.message}`);
        }
        return {
            clientId: json.client_id,
            login: json.login,
            scopes: json.scopes,
            userId: json.user_id,
            expiresIn: json.expires_in * 1000,
            createdAt: now
        };
    }
    async validate() {
        const res = await AuthToken.validate(this.accessToken);
        this.clientId = res.clientId;
        this.login = res.login;
        this.scopes = res.scopes;
        this.userId = res.userId;
        this.createdAt = res.createdAt;
    }
}
class DeviceCodeFlow extends EventEmitter {
    constructor(clientId, scopes) {
        super();
        this.clientId = clientId;
        this.scopes = scopes;
    }
    async getCode() {
        const now = Date.now();
        const url = 'https://id.twitch.tv/oauth2/device';
        const body = new URLSearchParams({ client_id: this.clientId, scopes: this.scopes.join(' ') });
        const res = await fetch(url, { method: 'POST', body });
        const json = await res.json();
        if ('message' in json) {
            throw new Error(`[${res.status}] ${json.message}`);
        }
        return {
            deviceCode: json.device_code,
            userCode: json.user_code,
            verificationUri: json.verification_uri,
            expiresIn: json.expires_in * 1000,
            createdAt: now,
            interval: json.interval * 1000
        };
    }
    async getToken() {
        var _a, _b;
        if (!this.deviceCode) {
            throw new Error('No device code, call getCode() first');
        }
        const url = 'https://id.twitch.tv/oauth2/token';
        const body = new URLSearchParams({
            client_id: this.clientId,
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
            device_code: this.deviceCode
        });
        const now = Date.now();
        const res = await fetch(url, { method: 'POST', body });
        const json = await res.json();
        if ('message' in json) {
            if (json.message === 'authorization_pending') {
                return null;
            }
            throw new Error(`[${res.status}] ${json.message}`);
        }
        const validateRes = await AuthToken.validate(json.access_token);
        return new AuthToken({
            accessToken: json.access_token,
            refreshToken: json.refresh_token,
            expiresIn: json.expires_in * 1000,
            createdAt: now,
            scopes: (_b = (_a = json.scopes) !== null && _a !== void 0 ? _a : validateRes.scopes) !== null && _b !== void 0 ? _b : [],
            tokenType: json.token_type,
            clientId: validateRes.clientId,
            login: validateRes.login,
            userId: validateRes.userId
        });
    }
	cancel() {
		clearInterval(this.checkCodeInterval);
	}
    async checkCode() {
        try {
            const token = await this.getToken();
            if (!token) {
                return;
            }
            clearInterval(this.checkCodeInterval);
            this.emit('token', token);
            CookieTokenManager.saveToken(token);
        }
        catch (err) {
            clearInterval(this.checkCodeInterval);
            console.error(err);
        }
    }
    async start() {
        const code = await this.getCode();
        this.deviceCode = code.deviceCode;
        this.userCode = code.userCode;
        this.expiresIn = code.expiresIn;
        this.createdAt = code.createdAt;
        this.emit('code', code);
        this.checkCodeInterval = setInterval(() => this.checkCode(), code.interval);
    }
}



class CookieTokenManager {
    static COOKIE_NAME = "authToken";

    // Save token to cookie
    static saveToken(token) {
        const cookieValue = JSON.stringify(token);
        const expires = new Date(Date.now() + token.expiresIn).toUTCString(); // Expire when the token does
        document.cookie = `${this.COOKIE_NAME}=${encodeURIComponent(cookieValue)}; expires=${expires}; path=/`;
        console.log("saving token kappa klaus...")
    }

    // Retrieve token from cookie
    static getToken() {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find(row => row.startsWith(`${this.COOKIE_NAME}=`));
        if (!tokenCookie) return null;

        try {
            const jsonString = decodeURIComponent(tokenCookie.split("=")[1]);
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Error parsing token from cookie:", e);
            return null;
        }
    }

    // Clear token cookie
    static clearToken() {
        document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

// On page load, check for an existing token
async function handleAuth() {
    let authToken = CookieTokenManager.getToken();

    if (authToken) {
        try {
            // Validate the token
            await AuthToken.validate(authToken.accessToken);
            console.log("Token is valid! Reusing existing...");
            authToken
            dcf.emit('token', authToken);
        } catch (error) {
            console.warn("Token validation failed, clearing stored token:", error);
            CookieTokenManager.clearToken();
            authToken = null;
        }
    }

    if (!authToken) {
        globalThis.AuthToken = AuthToken;
        globalThis.DeviceCodeFlow = DeviceCodeFlow;
        console.log("No valid token found, starting Device Code Flow...");
    }
}

// Example usage


function getChannelName() {
    const url = window.location.href; // Get the current URL
    const match = url.match(/twitch\.tv\/popout\/moderator\/([^/]+)/);
    return match ? match[1] : null; // Return the channel name or null if not found
}