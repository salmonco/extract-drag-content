import { ChromeMessage, ChromeMessageType } from '@/common/chrome-api-wrapper';

// 드래그된 텍스트를 감지하는 함수
function handleTextSelection() {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
        const message = new ChromeMessage(ChromeMessageType.SCRAPING_RESULTS, {
            type: 'selection',
            content: selectedText,
            pageTitle: document.title
        });
        // background script로 메시지 전송
        chrome.runtime.sendMessage(message).catch(error => {
            console.error('Error sending selected text:', error);
        });
    }
}

// 드래그 이벤트 리스너 등록
document.addEventListener('mouseup', () => {
    // 약간의 지연을 주어 선택이 완료되도록 함
    setTimeout(handleTextSelection, 100);
});

console.debug('Chrome plugin content script loaded');

export {};
