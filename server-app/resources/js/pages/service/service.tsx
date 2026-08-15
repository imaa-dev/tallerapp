import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Boxes, BriefcaseMedical, ClipboardCheck, Coins, ConciergeBell, FilePlus2, Handshake, LucideIcon, Wrench } from 'lucide-react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicios',
        href: '/service',
    },
];

interface ServiDataProp {
    countTypeService: CountTypeService;
}
interface CountTypeService {
    serviceRecepcionado: number;
    serviceDiagnosticado: number;
    serviceAR: number;
    serviceCostApproval: number;
    serviceER: number;
    serviceReparado: number;
    serviceEntregado: number;
    serviceIncidencia: number;
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

export default function Service({ countTypeService }: ServiDataProp) {
    useEffect(() => {
        router.reload({ only: ['countTypeService'] });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        <div className="mb-6 flex items-center gap-3">
                            <Wrench className="text-muted-foreground h-6 w-6" />
                            <h1 className="text-2xl font-semibold">Servicios</h1>
                        </div>

                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Flujo de servicios</h2>

                            <Button onClick={() => router.visit('/create/service')}>
                                <FilePlus2 className="mr-2 h-4 w-4" />
                                Nuevo servicio
                            </Button>
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
        </AppLayout>
    );
}
