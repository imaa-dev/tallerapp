import { BreadcrumbItem, ServiData } from '@/types';
import React, { useEffect, useState } from 'react';
import { useConfirmDialog } from '@/context/ModalContext';
import { useServiceActions } from '@/utils/useServiceActions';
import { initFlowbite } from 'flowbite';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ServiceCard } from '@/components/cards/service/ServiceCard';
import { SparePartsProvider } from '@/context/SparePartsContext';

const buildBreadcrumbs = (title: string, statusColor: string): BreadcrumbItem[] => [
    {
        title: 'Servicios',
        href: '/service',
    },
    {
        title: (
            <div className="flex items-center">
                {title}
                <div className={`ml-3 mt-1 h-2.5 w-2.5 rounded-full ${statusColor}`} />
            </div>
        ),
        href: '/service',
    },
];

interface ServiceDataProp {
    services: ServiData[];
    title: string;
    statusColor: string;
}
export default function ListService({ services, title, statusColor }: ServiceDataProp ){
    const [serviceShow, setServiceShow] = useState(services);
    const { showConfirm } = useConfirmDialog();
    const { removeService } = useServiceActions(setServiceShow);
    const breadcrumbs = buildBreadcrumbs(title, statusColor);

    const handleDelete = (serviceId: number) => {
        showConfirm({
            title: 'Deseas eliminar el servicio',
            onConfirm: () => removeService(serviceId),
        });
    }
    useEffect(() => {
        initFlowbite();
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios" />
            <div className="flex h-full flex-1 flex-col items-center gap-4 px-4 sm:px-5">
                <div className="w-full max-w-full rounded-lg border shadow-md">
                    {serviceShow.map((service: ServiData) => (
                        <ServiceCard key={service.id} service={service} handleDelete={() => handleDelete(service.id)} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
