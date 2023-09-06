// Content script to capture clicks on buttons and input events on web pages
document.addEventListener('click', (event) => {
    let res = chrome.runtime?.sendMessage({type: 'click', target: event.target.nodeName})
});

document.addEventListener('input', (event) => {
    if (event.target.nodeName === 'INPUT') {
        chrome.runtime?.sendMessage({type: 'input', value: event.target.value, target: event.target.nodeName});
    }
});
