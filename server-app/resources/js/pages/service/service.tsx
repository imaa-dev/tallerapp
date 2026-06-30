import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { FilePlus2, Wrench, ConciergeBell, BriefcaseMedical, Handshake, Boxes, ClipboardCheck, CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useModal } from '@/context/ModalContextForm';
import { AskContent } from '@/components/ask-content';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicios',
        href: '/service',
    },
];

interface ServiDataProp {
    notOrganization: boolean;
    countTypeService: CountTypeService;
    message: string | null;
    user_rol: string;
    
}
interface CountTypeService {
    serviceRecepcionado: number,
    serviceDiagnosticado: number,
    serviceAR: number,
    serviceER: number,
    serviceReparado: number,
    serviceEntregado: number,
    serviceIncidencia: number
}
const serviceButtons = [
    {
        label: 'Recepción',
        icon: ConciergeBell,
        route: '/list-reception/service',
        countKey: 'serviceRecepcionado',
        color: 'bg-blue-400',
    },
    {
        label: 'Diagnóstico',
        icon: BriefcaseMedical,
        route: '/list-diagnosis/service',
        countKey: 'serviceDiagnosticado',
        color: 'bg-violet-400',
    },
    {
        label: 'Aprobación repuestos',
        icon: Boxes,
        route: '/list-to-aprove-spare-part/service',
        countKey: 'serviceAR',
        color: 'bg-orange-400',
    },
    {
        label: 'En reparación',
        icon: Wrench,
        route: '/list-repair/service',
        countKey: 'serviceER',
        color: 'bg-gray-400',
    },
    {
        label: 'Reparado',
        icon: ClipboardCheck,
        route: '/list-repaired/service',
        countKey: 'serviceReparado',
        color: 'bg-green-400',
    },
    {
        label: 'Entregado',
        icon: Handshake,
        route: '/list-delivered/service',
        countKey: 'serviceEntregado',
        color: 'bg-green-400',
    },
    {
        label: 'Incidencias',
        icon: CircleX,
        route: '/list-incident/service',
        countKey: 'serviceIncidencia',
        color: 'bg-red-500',
    },
];

export default function Service({ notOrganization, countTypeService, message, user_rol }: ServiDataProp){
    
    const [modal] = useState<boolean>(notOrganization);
    const { openModal } = useModal();
    useEffect(() => {
        if(modal){
            openModal( () => (<AskContent message={message} userRol={user_rol} />) )
        }
        router.reload({ only: ['countTypeService'] })
    }, [modal])
    return (
        // TODO
        // agregar forma de agregar menos botones 
        // no repetir codigo         
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">     
                    
                    <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                            <div className="flex p-5 " >
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="flex"
                                        onClick={() => {
                                            router.visit('/create/service');
                                        }}
                                    >
                                        <FilePlus2 />
                                    </button>
                                </div>
                                {serviceButtons.map((btn, index) => {
                                    const Icon = btn.icon;
                                    const count = countTypeService?.[btn.countKey] ?? 0;
                                    return (
                                        <div key={index} className="relative ml-7">
                                            <button
                                                type="button"
                                                className="flex"
                                                onClick={() => router.visit(btn.route)}
                                            >
                                                <Icon />

                                                {count > 0 && (
                                                    <span className={`absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold text-white ${btn.color}`}>
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </AppLayout>
    );
}
