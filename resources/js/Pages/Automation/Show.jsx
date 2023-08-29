import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import React, {useState} from "react";
import MonacoEditor from "react-monaco-editor";
import {router} from '@inertiajs/react';

export default function Automation({auth, workflow, file}) {
    const [code, setCode] = useState(file);
    const [isProcessRunning, setIsProcessRunning] = useState(false);
    const [processId, setProcessId] = useState(null);
    const [process, setProcess] = useState(null);
    const [expertMode, setExpertMode] = useState(false);

    function handleStopProcess() {
        router.visit(`/workflows/${workflow.id}/stop/${process.id}`, {
            method: "get",
            preserveState: true,
            replace: false,
            onSuccess: page => {
                setIsProcessRunning(false);
                setProcessId(null);
                setProcess(null);
                router.replace(`/workflows/${workflow.id}`)
            },
            onError: errors => {
                console.log(errors)
            }
        });
    }

    async function handleStartProcess() {
        router.visit(`/workflows/${workflow.id}/run`, {
            method: "get",
            preserveState: true,
            replace: false,
            onSuccess: page => {
                setIsProcessRunning(true);
                setProcessId(page.props.processInstance);
                setProcess(page.props.process);
                router.replace(`/workflows/${workflow.id}`)
            },
            onError: errors => {
                console.log(errors)
            }
        });
    }

    function handleSaveScript() {
        router.visit(`/workflows/${workflow.id}/change`, {
            method: "PUT",
            preserveState: true,
            replace: false,
            data: {
                newCode: code
            },
            onSuccess: page => {
                router.replace(`/workflows/${workflow.id}`)
            },
            onError: errors => {
                console.log(errors)
            }
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Automation
                testing</h2>}
        >
            <Head title="Automation workflow"/>

            <div className="container m-5" style={{color: "white", height: "75vh", width: "100vw"}}>

                <div style={{margin: 5, display: "flex", gap: 5}}>
                    {isProcessRunning ? (
                        <button style={{border: "2px solid white", borderRadius: 5, padding: 5, backgroundColor: "red"}}
                                onClick={handleStopProcess}>Stop testing</button>
                    ) : (
                        <button
                            style={{border: "2px solid white", borderRadius: 5, padding: 5, backgroundColor: "blue"}}
                            onClick={handleStartProcess}>Start testing</button>
                    )}
                    <button style={{border: "2px solid white", borderRadius: 5, padding: 5, backgroundColor: "green"}}
                            onClick={handleSaveScript}>Save script
                    </button>
                    {isProcessRunning && (
                        <div>
                            Process id : {processId} is running now
                        </div>
                    )}
                    <div style={{marginTop: 5, padding: 5}}>
                        <label>Expert mode : </label>
                        <input type="checkbox" checked={expertMode} onChange={e => {
                            setExpertMode(e.target.checked)
                        }}/>
                    </div>
                </div>

                <br/>

                {expertMode && <MonacoEditor
                    language="javascript" // Set the language for syntax highlighting
                    theme="vs-dark" // Set the editor theme
                    value={code}
                    options={{
                        selectOnLineNumbers: true, // Enable line number selection
                    }}
                    onChange={newCode => setCode(newCode)}
                />}

            </div>
        </AuthenticatedLayout>
    );
}
