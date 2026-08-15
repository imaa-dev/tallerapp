import CreateServiceForm from '@/components/forms/service/CreateServiceForm';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ClientDataProp, ProductDataProp } from '@/types';
import { Head } from '@inertiajs/react';
import { Wrench } from 'lucide-react';

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

export default function CreateServis({ clients, products }: ClientDataProp & ProductDataProp) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Servicio" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Wrench className="text-muted-foreground h-6 w-6" />
                                <div>
                                    <h1 className="text-2xl font-semibold">Crear servicio</h1>
                                    <p className="text-muted-foreground text-sm">Registra un nuevo ingreso de servicio técnico.</p>
                                </div>
                            </div>
                        </div>

                        <CreateServiceForm clients={clients} products={products} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
