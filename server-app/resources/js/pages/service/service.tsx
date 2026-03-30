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
                            <div className="relative ml-7">
                                <button
                                    type="button"
                                    className="flex"
                                    onClick={() => {
                                        router.visit('/list-reception/service');
                                    }}
                                >
                                    <ConciergeBell />
                                    {countTypeService.serviceRecepcionado > 0 && (
                                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-blue-400 px-1.5 py-0.5 text-xs font-bold text-white">
                                        {countTypeService.serviceRecepcionado}
                                    </span>
                                    )}
                                </button>
                            </div>
                            <div className="relative ml-7" >
                                <button
                                    type="button"
                                    className="flex"
                                    onClick={() => {
                                        router.visit('/list-diagnosis/service')
                                    }}
                                >
                                    <BriefcaseMedical />
                                    { countTypeService.serviceDiagnosticado > 0 && (
                                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-violet-400 px-1.5 py-0.5 text-xs font-bold text-white" >
                                            { countTypeService.serviceDiagnosticado }
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="relative ml-7">
                                <button
                                    type="button"
                                    className="flex"
                                    onClick={() => {
                                        router.visit('/list-to-aprove-spare-part/service');
                                    }}
                                >

                                    <Boxes />
                                    {countTypeService.serviceAR > 0 && (
                                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-orange-400 px-1.5 py-0.5 text-xs font-bold text-white">
                                    {countTypeService.serviceAR}
                                    </span>
                                    )}
                                </button>
                            </div>
                            <div className="relative ml-7">
                                <button
                                    type="button"
                                    className="flex"
                                    onClick={() => {
                                        router.visit('/list-repair/service');
                                    }}
                                >

                                    <Wrench />
                                    {countTypeService.serviceER > 0 && (
                                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-gray-400 px-1.5 py-0.5 text-xs font-bold text-white">
                                    {countTypeService.serviceER}
                                    </span>
                                    )}
                                </button>

                            </div>

                            <div className="relative ml-7">
                                <button
                                    type="button"
                                    className="flex"
                                    onClick={() => {
                                        router.visit('/list-repaired/service');
                                    }}
                                >
                                    <ClipboardCheck />
                                    {countTypeService.serviceReparado > 0 && (
                                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-green-400 px-1.5 py-0.5 text-xs font-bold text-white">
                                    {countTypeService.serviceReparado}
                                    </span>
                                    )}
                                </button>
                            </div>
                            <div className="relative ml-7">
                                <button
                                    type="button"
                                    className="flex"
                                    onClick={() => {
                                        router.visit('/list-delivered/service');
                                    }}
                                >
                                    <Handshake />

                                    {countTypeService.serviceEntregado > 0 && (
                                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-green-400 px-1.5 py-0.5 text-xs font-bold text-white">
                                            {countTypeService.serviceEntregado}
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="relative ml-7" >
                                <button
                                    type="button"
                                    className="flex"
                                    onClick={ () => {
                                        router.visit('')
                                    }}
                                >
                                    <CircleX />
                                    { countTypeService.serviceIncidencia > 0 && (
                                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-green-500 px-1.5 py-0.5 text-xs font-bold text-white" >
                                            {countTypeService.serviceIncidencia}
                                        </span>
                                    ) }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            
        </AppLayout>
    );
}
