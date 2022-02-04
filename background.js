chrome.browserAction.onClicked.addListener(IconClicked);
function IconClicked(tab) {
  chrome.tabs.sendMessage(tab.id, "msg213");
}
