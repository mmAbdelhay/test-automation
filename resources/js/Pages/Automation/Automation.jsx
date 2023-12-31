import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import {useState} from "react";
import InteractionRecorder from "@/Pages/Automation/InterctionRecorder.jsx";

export default function Automation({auth}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Automation
                testing</h2>}
        >
            <Head title="Automation workflow"/>

            <div className="container m-5" style={{color: "white"}}>
                {/*<label>Domain : </label>*/}
                {/*<input type="text" onChange={(e) => setDomain(e.target.value)} value={domain}*/}
                {/*       className={'form-control'}/>*/}

                <InteractionRecorder />
            </div>
        </AuthenticatedLayout>
    );
}
