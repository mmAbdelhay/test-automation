import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import React, {useState} from "react";
import MonacoEditor from "react-monaco-editor";

export default function Automation({auth, workflow, file}) {
    const [code, setCode] = useState(file)
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Automation
                testing</h2>}
        >
            <Head title="Automation workflow"/>

            <div className="container m-5" style={{color: "white", height: 750, width: "100vw"}}>

                <MonacoEditor
                    language="javascript" // Set the language for syntax highlighting
                    theme="vs-dark" // Set the editor theme
                    value={code}
                    options={{
                        selectOnLineNumbers: true, // Enable line number selection
                    }}
                    onChange={newCode => setCode(newCode)}
                />

            </div>
        </AuthenticatedLayout>
    );
}
