// Initialize the recording status from storage (default to false)
let recordedEvents = [];
let isRecording =  false;

chrome.storage.local.get(['isRecording'], (result) => {
     isRecording = result.isRecording || false;
    // Update the UI based on the stored recording status
    updateUI(isRecording);

    // Add event listeners
    document.getElementById('startButton').addEventListener('click',recordEvents);

    document.getElementById('stopButton').addEventListener('click', stopRecording);

    document.getElementById('exportButton').addEventListener('click', exportEvents);

    chrome.tabs.executeScript({ file: 'content.js' });

    startListeningForEvents(isRecording);

    // Listen for events from content script

});
function startListeningForEvents(isRecording) {
    chrome.runtime?.onMessage.addListener((message) => {
        if (isRecording) {
            recordedEvents.push(message);
        }
    });
}
// Function to update the UI based on the recording status
function updateUI(isRecording) {
    if (isRecording) {
        // Disable start button and enable stop button
        document.getElementById('startButton').disabled = true;
        document.getElementById('stopButton').disabled = false;
    } else {
        // Enable start button and disable stop button
        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
    }
}
function recordEvents() {
    isRecording = true;
    recordedEvents = [];
    // Store the updated recording status
    chrome.storage.local.set({ isRecording: true });

    // Update the UI
    updateUI(true);

    // Disable start button and enable stop button
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;

}


function stopRecording() {
    isRecording = false;

    // Store the updated recording status
    chrome.storage.local.set({ isRecording: false });

    // Update the UI
    updateUI(false);

    // Disable stop button and enable start button
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;

    // Output the recorded events (you can send them to a server or store locally)
}
function exportEvents() {
    chrome.runtime?.sendMessage({ type: 'exportEvents' },(data)=>{
        recordedEvents = data
        const jsonContent = JSON.stringify(recordedEvents, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        chrome.downloads.download({
            url: url,
            filename: 'recorded_events.json',
            saveAs: true,
        });
        recordedEvents=[];
    });
    // if (recordedEvents.length > 0) {

    // }
}
