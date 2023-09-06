// Content script to capture clicks on buttons and input events on web pages
document.addEventListener('click', (event) => {
    let res = chrome.runtime?.sendMessage({ type: 'click', target: event.target.nodeName })
    console.log({event})
    console.log("bla")
});

document.addEventListener('input', (event) => {
    if (event.target.nodeName === 'INPUT') {
        chrome.runtime?.sendMessage({ type: 'input', value: event.target.value });
    }
    console.log({event})
});
