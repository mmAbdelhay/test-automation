import React, {useState, useEffect, useRef} from 'react';
import MonacoEditor from 'react-monaco-editor';
import { router } from '@inertiajs/react'


function InteractionRecorder() {
    const [recording, setRecording] = useState(false);
    const [startPoint, setStartPoint] = useState('');
    const [name, setName] = useState('');
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
                };
                setRecordedActions([...recordedActions, action]);
            }
        };

        const handleKeyDown = (event) => {
            if (recording) {
                const target = event.target;
                const uniqueSelector = getUniqueSelector(target, iframeRef.current);
                const keysToExclude = ['Shift', 'Tab', 'Control', 'Alt', 'Enter'];

                if (!keysToExclude.includes(event.key)) {
                    const action = {
                        type: 'keydown',
                        target: uniqueSelector,
                        key: event.key,
                    };
                    setRecordedActions([...recordedActions, action]);
                }
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
        if(name.length <= 0) {
            alert('please fill your workflow name');
            return;
        }
        router.post('/workflows/store', {
            recorded_actions: recordedActions,
            start_point: startPoint,
            name: name
        });
    };

    return (
        <div style={{width: '95vw'}}>
            <div style={{display: "flex", gap: 7}}>
                <button style={{border: "1px solid white", borderRadius: 5, padding: 4}} onClick={startRecording}
                        disabled={recording}>
                    Start Recording
                </button>
                <button style={{border: "1px solid white", borderRadius: 5, padding: 4}} onClick={stopRecording}
                        disabled={!recording}>
                    Stop Recording
                </button>
                <button style={{border: "1px solid white", borderRadius: 5, padding: 4}}
                        disabled={recordedActions.length <= 0}
                        onClick={exportRecording}>Export Recording
                </button>
                <div>
                    <label>name : </label>
                    <input type="text" value={name} style={{color: "black"}}
                           onChange={e => setName(e.target.value)}/>
                </div>
                <div>
                    <label>start point : </label>
                    <input type="text" value={startPoint} style={{color: "black"}}
                           onChange={e => setStartPoint(e.target.value)}/>
                </div>
            </div>
            <div style={{margin: 10, display: "flex", flexDirection: "row", width: "100%", height: "75vh"}}>

                <div style={{border: "2px solid white", borderRadius: 5, width: "70%"}}>
                    <iframe
                        ref={iframeRef}
                        src={"http://127.0.0.1:8000/" + startPoint}
                        title="Embedded Content"
                        width={"100%"}
                        height="700"
                    ></iframe>
                </div>

                <div style={{
                    border: "2px solid white",
                    width: "30%",
                    overflow: "scroll",
                    marginLeft: '10px',
                    padding: 5
                }}>
                    <h2>Recorded Actions:</h2>
                    <MonacoEditor
                        language="json" // Set the language for syntax highlighting
                        theme="vs-dark" // Set the editor theme
                        value={JSON.stringify(recordedActions, null, 2)}
                        options={{
                            selectOnLineNumbers: true, // Enable line number selection
                            readOnly: true
                        }}
                    />
                    {/*<pre>{JSON.stringify(recordedActions, null, 2)}</pre>*/}
                </div>
            </div>
        </div>
    );
}

export default InteractionRecorder;
