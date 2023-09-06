let recordedEvents = [];
let isRecording = false;

chrome.runtime?.onMessage.addListener((message, sender,sendResponse) => {
    chrome.storage.local.get(['isRecording'], (result) => {
        isRecording = result ||false;
    })
    if (message.type === 'exportEvents') {
        sendResponse(recordedEvents)
        recordedEvents = [];
    } else {
        if (isRecording) {
            recordedEvents.push(message);
        }
    }
});
