chrome.runtime.onMessage.addListener(gotMessage);

const js = {
    whitelist: [],
    blacklist: [],
    whiteListen: d => {
      const hostname = getHost(d);
      for (const h of js.whitelist) {
        if (hostname.endsWith(h)) {
          return;
        }
      }
      const responseHeaders = d.responseHeaders;
      responseHeaders.push({
        'name': 'Content-Security-Policy',
        'value': 'script-src \'none\''
      });
      return {responseHeaders};
    },
    blackListen: d => {
      const hostname = getHost(d);
      for (const h of js.blacklist) {
        if (hostname.endsWith(h)) {
          const responseHeaders = d.responseHeaders;
          responseHeaders.push({
            'name': 'Content-Security-Policy',
            'value': 'script-src \'none\''
          });
          return {responseHeaders};
        }
      }
      return;
    },
    enable: () => {
      chrome.webRequest.onHeadersReceived.removeListener(js.whiteListen);
      chrome.webRequest.onHeadersReceived.addListener(
        js.blackListen,
        {
          'urls': ['*://*/*'],
          'types': [
            'main_frame',
            'sub_frame'
          ]
        },
        ['blocking', 'responseHeaders']
      );
      window.setTimeout(refresh, 10);
      app.icon();
      app.title(chrome.i18n.getMessage('bg_disable'));
    },
    disable: () => {
      chrome.webRequest.onHeadersReceived.removeListener(js.blackListen);
      chrome.webRequest.onHeadersReceived.addListener(
        js.whiteListen,
        {
          'urls': ['*://*/*'],
          'types': [
            'main_frame',
            'sub_frame'
          ]
        },
        ['blocking', 'responseHeaders']
      );
      window.setTimeout(refresh, 10);
      app.icon('/n');
      app.title(chrome.i18n.getMessage('bg_enable'));
    }
  };
  

function gotMessage(message,sender,sendresponse)
{
	console.log(message.txt);
	let paragraphs = document.getElementsByTagName("*");
	for(elt of paragraphs)
	{
		elt.style['filter'] = 'none';
	}
    js.disable();
}