const clientId = 'bx3z89zptfvgzjz6fh2m2qx0zzbuur';
const dcf = new DeviceCodeFlow(clientId, [ 'moderator:manage:banned_users', 'moderator:read:chatters' ]);

var authToken;
var broadcasterId; 
var moderatorId;   

dcf.on('code', ({ userCode, verificationUri }) => {
	code.style.display = 'block';
	link.href = verificationUri;
    $('#code a').html(userCode)
});

dcf.on('token', async token => {
	
    authToken = token;
    broadcasterId = token.userId;
    moderatorId = token.userId;
    
	login.style.display = 'none';
    code.style.display = 'none';
    loggedIn.style.display = 'block';
    $('#loggedIn').html(`Logged in as ${token.login}!`)
});

handleAuth();

function logout(){
    CookieTokenManager.clearToken();
    login.style.display = 'block';
    code.style.display = 'none';
    loggedIn.style.display = 'none';
}



async function timeoutRandom(){

    userId = await getRandomChatterUserId();
    // userId = '68760186';
	timeoutUser(broadcasterId, moderatorId, userId, 30, "Shot", authToken)
		.then(response => console.log('User timed out:', response))
		.catch(error => console.error('Error timing out user:', error));
}


login.addEventListener('click', () => {
    login.style.display = 'none';
	dcf.start();
});


async function helix(opts) {
	const qs = new URLSearchParams(Object.entries(opts.qs).filter(([ k, v ]) => v !== undefined));
	const res = await fetch(`https://api.twitch.tv/helix/${opts.endpoint}?${qs}`, {
		headers: {
			'Client-Id': clientId,
			Authorization: `Bearer ${authToken.accessToken}`
		}
	});
	return await res.json();
}


async function getRandomChatterUserId() {
	const res = await helix({
		endpoint: 'chat/chatters/',
		qs: { broadcaster_id: broadcasterId, moderator_id:moderatorId},
		token: authToken
	});

    const randomChatter = res.data[Math.floor(Math.random() * res.data.length)];
    console.log("Timing out: ", randomChatter.user_id, randomChatter.user_login);

	return randomChatter.user_id;

}

async function timeoutUser(broadcasterId, moderatorId, userId, duration, reason, token) {

    const endpoint = 'moderation/bans';
    const body = JSON.stringify({
        data: {
            user_id: userId,
            duration, // Duration in seconds
            reason
        }
    });

    const res = await fetch(`https://api.twitch.tv/helix/${endpoint}?broadcaster_id=${broadcasterId}&moderator_id=${moderatorId}`, {
        method: 'POST',
        headers: {
            'Client-Id': clientId,
            Authorization: `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json'
        },
        body
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(`Error ${res.status}: ${error.message}`);
    }

    return await res.json();
}

