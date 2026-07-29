import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import ServiceStatusChart from '@/components/ServiceStatusChart';
import { Wrench, Users, ChartColumn } from 'lucide-react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Central',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const page = usePage();
    const props = page.props as any;

    const hasOrganization = props.hasOrganization ?? true;
    const services = props.services ?? { total: 0, active: 0, in_repair: 0, waiting_spare_parts: 0, ready_to_deliver: 0 };
    const clients = props.clients ?? { total: 0, new_this_month: 0, recurring: 0 };
    const business = props.business ?? { revenue_this_month: 0, avg_ticket: 0 };
    console.log("business", business)
    console.log(services.status)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel central" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {!hasOrganization ? (
                    <div className="rounded-xl border p-6">No hay organización seleccionada</div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <Wrench className="h-5 w-5 text-blue-500" />

                                    <h3 className="text-sidebar-foreground/70 ring-sidebar-ring flex shrink-0 items-center rounded-md text-base font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0">
                                        Servicios
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    {services.status.map((service) => (
                                        <div key={service.slug} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: service.color }} />

                                                <SidebarGroupLabel>{service.label}</SidebarGroupLabel>
                                            </div>

                                            <span className="font-bold">{service.count}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t pt-3">
                                    <SidebarGroupLabel>Total servicios</SidebarGroupLabel>

                                    <span className="font-bold">{services.total}</span>
                                </div>
                            </div>
                            <div className="rounded-xl border p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-violet-500" />

                                    <h3 className="text-sidebar-foreground/70 ring-sidebar-ring flex shrink-0 items-center rounded-md text-base font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0">
                                        Clientes
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <SidebarGroupLabel>Total clientes</SidebarGroupLabel>

                                        <span className="font-bold">{clients.total}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <SidebarGroupLabel>Nuevos este mes</SidebarGroupLabel>

                                        <span className="font-bold">{clients.new_this_month}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <SidebarGroupLabel>Clientes recurrentes</SidebarGroupLabel>

                                        <span className="font-bold">{clients.recurring}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <ChartColumn className="h-5 w-5 text-green-500" />

                                    <h3 className="text-sidebar-foreground/70 ring-sidebar-ring flex shrink-0 items-center rounded-md text-base font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0">
                                        Métricas de negocio
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <SidebarGroupLabel>Ingresos este mes</SidebarGroupLabel>
                                        <span className="font-bold">
                                            {new Intl.NumberFormat('es-CL', {
                                                style: 'currency',
                                                currency: 'CLP',
                                                maximumFractionDigits: 0,
                                            }).format(business.revenue_this_month)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border p-6">
                            <h3 className="mb-6 text-lg font-semibold">Servicios por estado</h3>

                            <ServiceStatusChart services={services.status} />
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
