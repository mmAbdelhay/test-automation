    console.log("in background")
    let recordedEvents = [];
chrome.runtime.onMessage.addListener((message,isRecording) => {
    console.log("in onMessage background")
    console.log({message})
    console.log({isRecording})
    console.log({recordedEvents})
    if (isRecording) {
        recordedEvents.push(message);
    console.log({recordedEvents})
    }
});
