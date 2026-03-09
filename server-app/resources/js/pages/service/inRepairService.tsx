import React, { useEffect, useState } from "react";
import AppLayout from '@/layouts/app-layout';
import  { BreadcrumbItem, ServiData } from '@/types';
import { Head } from '@inertiajs/react';
import { ServiceCard } from '@/components/cards/service/ServiceCard';
import { useConfirmDialog } from '@/context/ModalContext';
import { useLoading } from '@/context/LoadingContext';
import { deleteService } from '@/api/services/serviService';
import { useToast } from '@/context/ToastContext';
import { initFlowbite } from 'flowbite';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicios',
        href: '/service',
    },
    {
        title:  <div className="flex">En Reparación<div className="ml-3 mt-1 h-2.5 w-2.5 rounded-full bg-orange-500"> </div></div>,
        href: '/service',
    },
];

interface ServicesForm {
    services: ServiData[]
}
export default function InRepairService({ services }: ServicesForm) {
    const [ servicesToShow, setServicesToShow ] = useState(services);
    const { showConfirm } = useConfirmDialog();
    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useToast();

    const handleDelete = (serviceId: number) => {
        showConfirm({
            title: "Deseas eliminar el servicio",
            onConfirm: () => removeService(serviceId)
        });
    }

    const removeService = async (id: number) => {
        showLoading();
        const response = await deleteService(id);
        if(response.code === 200){
            success(response.message);
            setServicesToShow(prev => prev.filter(ser => ser.id !== id))
        } else {
            error(response.message)
        }
        hideLoading();
    }

    useEffect(() => {
        initFlowbite();
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios" />
            <div className="flex h-full flex-1 flex-col items-center gap-4 px-4 sm:px-5">
                <div className="w-full max-w-full rounded-lg border shadow-md">
                    {
                        servicesToShow.map((service: ServiData)=> (
                            <ServiceCard key={service.id} service={service} handleDelete={() => handleDelete(service.id)} />
                        ))
                    }
                </div>
            </div>
        </AppLayout>
    );
}
