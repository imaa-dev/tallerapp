import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { FilePlus2, Wrench, ConciergeBell, BriefcaseMedical, Handshake, Boxes, ClipboardCheck, Coins, LucideIcon } from 'lucide-react';
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
    serviceCostApproval: number,
    serviceER: number,
    serviceReparado: number,
    serviceEntregado: number,
    serviceIncidencia: number
}
type CountTypeKey = keyof CountTypeService;

type ServiceButton = {
    label: string;
    description: string;
    icon: LucideIcon;
    route: string;
    countKey: CountTypeKey;
    color: string;
};

const serviceButtons: ServiceButton[] = [
    {
        label: 'Recepción',
        description: 'Servicios recién ingresados',
        icon: ConciergeBell,
        route: '/list-reception/service',
        countKey: 'serviceRecepcionado',
        color: 'bg-blue-400',
    },
    {
        label: 'Diagnóstico',
        description: 'Pendientes de diagnóstico',
        icon: BriefcaseMedical,
        route: '/list-diagnosis/service',
        countKey: 'serviceDiagnosticado',
        color: 'bg-violet-400',
    },
    {
        label: 'Repuestos',
        description: 'Agregar repuestos utilizados',
        icon: Boxes,
        route: '/list-to-aprove-spare-part/service',
        countKey: 'serviceAR',
        color: 'text-orange-500',
    },
    {
        label: 'Aprobación de Costos',
        description: 'Pendiente de aprobación del cliente',
        icon: Coins,
        route: '/list-cost-approval/service',
        countKey: 'serviceCostApproval',
        color: 'bg-teal-500',
    },
    {
        label: 'Reparación',
        description: 'Trabajos en proceso',
        icon: Wrench,
        route: '/list-repair/service',
        countKey: 'serviceER',
        color: 'bg-gray-400',
    },
    {
        label: 'Reparado',
        description: 'Listos para entrega',
        icon: ClipboardCheck,
        route: '/list-repaired/service',
        countKey: 'serviceReparado',
        color: 'bg-green-400',
    },
    {
        label: 'Entregado',
        description: 'Servicios finalizados',
        icon: Handshake,
        route: '/list-delivered/service',
        countKey: 'serviceEntregado',
        color: 'bg-green-400',
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            {/* Desktop */}
                            <div className="mt-10">
                                <div className="mb-8 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Flujo de servicios</h2>

                                    <button
                                        onClick={() => router.visit('/create/service')}
                                        className="bg-primary text-primary-foreground flex items-center gap-2 rounded-lg px-4 py-2 transition hover:opacity-90"
                                    >
                                        <FilePlus2 className="h-4 w-4" />
                                        Nuevo servicio
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-5 xl:grid-cols-3 2xl:grid-cols-6">
                                    {serviceButtons.map((btn) => {
                                        const Icon = btn.icon;
                                        const count = countTypeService?.[btn.countKey] ?? 0;

                                        return (
                                            <button
                                                key={btn.label}
                                                onClick={() => router.visit(btn.route)}
                                                className="group bg-card hover:border-primary rounded-xl border p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className={`bg-muted rounded-lg p-3 ${btn.color}`}>
                                                        <Icon className="h-6 w-6" />
                                                    </div>

                                                    <span className="text-3xl font-bold">{count}</span>
                                                </div>

                                                <h3 className="mt-5 font-semibold">{btn.label}</h3>

                                                <p className="text-muted-foreground mt-1 text-sm">{btn.description}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
