import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    BreadcrumbItem,
    ClientDataProp,
    ProductDataProp,
} from '@/types';
import CreateServiceForm from '@/components/forms/service/CreateServiceForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicio',
        href: '/service',
    },
    {
        title: 'Crear',
        href: '/',
    },
];

export default function CreateServis({clients, products} : ClientDataProp & ProductDataProp) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicio" />
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 rounded-xl">
                <div className="relative m-5 overflow-x-auto shadow-md sm:rounded-lg">
                    <CreateServiceForm clients={clients} products={products} />
                </div>
            </div>
        </AppLayout>
    );
}
