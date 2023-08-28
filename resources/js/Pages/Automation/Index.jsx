import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import DataTable from 'react-data-table-component';
import { Inertia } from '@inertiajs/inertia';

export default function Automation({auth, workflows}) {

    const columns = [
        {
            name: 'Name',
            selector: row => row.title,
            sortable: true,

        },
        {
            name: 'created_at',
            selector: row => row.created_at.split('T')[0],
            sortable: true,

        },
        {
            name: 'Actions',
            cell: (row) => (
                <button style={{border: "2px solid black", borderRadius: 5, padding: 5}} onClick={() => handleAction(row)}>Action</button>
            ),
        },
    ];

    const ExpandedComponent = ({data}) => <pre>{JSON.stringify(data, null, 2)}</pre>;

    const handleAction = (row) => {
        Inertia.visit(`/workflows/${row.id}`);
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Automation
                testing</h2>}
        >
            <Head title="Automation workflow"/>

            <div className="container m-5" style={{color: "white", width: "100%"}}>
                <DataTable
                    columns={columns}
                    data={workflows}
                    selectableRows
                    pagination={true}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    theme={'dark'}
                />
            </div>
        </AuthenticatedLayout>
    );
}
