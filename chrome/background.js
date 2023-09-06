console.log("in background")
let recordedEvents = [];
chrome.runtime?.onMessage.addListener((message, sender,sendResponse) => {
    // console.log({isRecording})
    // console.log({sendResponse})
    if (message.type === 'exportEvents') {
        sendResponse(recordedEvents)
    } else {
        // console.log("in onMessage background")
        // console.log({message})
        // console.log({isRecording})
        // console.log({recordedEvents})
        // if (isRecording) {
            recordedEvents.push(message);

            // console.log({recordedEvents})
        // }
    }
});
