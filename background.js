chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.create({'url': "https://themes.trac.wordpress.org/query?priority=theme+update&status=closed&status=new&status=reopened&keywords=!~buddypress&col=id&col=summary&col=status&col=priority&col=owner&col=time&col=changetime&col=reporter&report=1&desc=1&order=changetime"}, function (tab) {
		// Tab opened.
	});
});