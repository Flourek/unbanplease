// ==UserScript==
// @id			unbanpls
// @name		Unban Please
// @namespace	UnbanPlease
//
// @version		1.0.1
// @updateURL	https://flourek.github.io/unbanplease/injector.user.js
//
// @description	Turns your twitch unban appeals into a Papers Please themed game!!!
// @icon		https://flourek.github.io/unbanplease/res/icon.png
//
// @include		https://www.twitch.tv/popout/moderator/*/unban-requests?papers
//
// @grant		none
// @run-at		document-end
// ==/UserScript==

function init()
{
	var script = document.createElement('script');

	script.id = 'unbanpls_inject';
	script.type = 'text/javascript';
	script.src = 'https://flourek.github.io/unbanplease/js/inject.js';
!
	document.head.appendChild(script);
}

init();
