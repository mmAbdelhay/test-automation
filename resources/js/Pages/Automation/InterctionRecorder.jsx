import React, { useState, useEffect, useRef } from 'react';

function InteractionRecorder() {
    const [recording, setRecording] = useState(false);
    const [recordedActions, setRecordedActions] = useState([]);
    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;

        if (!iframe) {
            return;
        }

        const iframeDocument = iframe.contentDocument;

        const handleMouseClick = (event) => {
            if (recording) {
                const target = event.target;
                const uniqueSelector = getUniqueSelector(target, iframeRef.current);
                const action = {
                    type: 'click',
                    target: uniqueSelector,
                    timestamp: Date.now(),
                };
                setRecordedActions([...recordedActions, action]);
            }
        };

        const handleKeyDown = (event) => {
            if (recording) {
                const target = event.target;
                const uniqueSelector = getUniqueSelector(target, iframeRef.current);
                const action = {
                    type: 'keydown',
                    target: uniqueSelector,
                    key: event.key,
                    timestamp: Date.now(),
                };
                setRecordedActions([...recordedActions, action]);
            }
        };


        if (iframeDocument) {
            iframeDocument.addEventListener('click', handleMouseClick);
            iframeDocument.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (iframeDocument) {
                iframeDocument.removeEventListener('click', handleMouseClick);
                iframeDocument.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [recording, recordedActions]);

    function getUniqueSelector(element, iframe) {
        const selectors = [];
        let currentElement = element;

        while (currentElement !== iframe) {
            if (!currentElement) {
                break; // In case something went wrong or element is not within the iframe
            }

            if (currentElement.id) {
                selectors.unshift(`#${currentElement.id}`);
                break; // IDs are unique, so we can stop here
            } else {
                let index = Array.from(currentElement.parentElement.children).indexOf(currentElement) + 1;
                let siblingSelector = `:nth-child(${index})`;
                selectors.unshift(`${currentElement.tagName.toLowerCase()}${siblingSelector}`);
                currentElement = currentElement.parentElement;
            }
        }

        return selectors.join(' > ');
    }

    const startRecording = () => {
        setRecording(true);
        setRecordedActions([]);
    };

    const stopRecording = () => {
        setRecording(false);
    };

    const exportRecording = () => {
        // Export the recorded actions as JSON
        const jsonRecording = JSON.stringify(recordedActions, null, 2);
        console.log(jsonRecording);
    };

    return (
        <div>
            <button onClick={startRecording} disabled={recording}>
                Start Recording
            </button>
            <button onClick={stopRecording} disabled={!recording}>
                Stop Recording
            </button>
            <button onClick={exportRecording}>Export Recording</button>
            <iframe
                ref={iframeRef}
                src={"http://127.0.0.1:8000/"}
                title="Embedded Content"
                width={"100%"}
                height="500"
            ></iframe>
            <div>
                <h2>Recorded Actions:</h2>
                <pre>{JSON.stringify(recordedActions, null, 2)}</pre>
            </div>
        </div>
    );
}

export default InteractionRecorder;
