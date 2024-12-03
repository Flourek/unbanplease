// ==UserScript==
// @id			unbanpls
// @name		Unban Please
// @namespace	UnbanPlease
//
// @version		1.0.3
// @updateURL	http://127.0.0.1:5500/injector.user.js
//
// @description	Turns your twitch unban appeals into a Papers Please themed game!!!
// @icon		http://127.0.0.1:5500/res/icon.png
//
// @include		https://www.twitch.tv/popout/moderator/*/unban-requests?papers
// @require 	https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
//
// @grant		none
// @run-at		document-end
// ==/UserScript==

function init()
{
	var script = document.createElement('script');

	script.id = 'unbanpls_inject';
	script.type = 'text/javascript';
	script.src = 'http://127.0.0.1:5500/js/inject.js';
!
	document.head.appendChild(script);
}

init();
