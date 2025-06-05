import { ChromeMessage, ChromeMessageType } from '@/common/chrome-api-wrapper';

// 설치 시 초기화
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear();
});

// content script로부터 메시지를 받아 popup으로 전달
chrome.runtime.onMessage.addListener((message: ChromeMessage<any>, sender, sendResponse) => {
    console.debug('Background received message:', message, 'from:', sender);

    if (message.type === ChromeMessageType.SCRAPING_RESULTS) {
        // popup으로 메시지 전달
        chrome.runtime.sendMessage(message).catch(error => {
            console.error('Error forwarding message to popup:', error);
        });
    }

    return false;
});

// 탭 업데이트 감지
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // TODO: Here you can add logic such as e.g. disable popup button on specific pages
    console.debug('tabId', tabId, 'changeInfo', changeInfo, 'tab', tab);
});

export {};
