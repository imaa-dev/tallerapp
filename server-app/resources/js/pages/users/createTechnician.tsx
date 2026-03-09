import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import ButtonBack from '@/components/button-back';
import { CreateTechnicianForm } from '@/components/forms/user/CreateTechnicianForm';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
    },
    {
        title: 'Crear Tecnico ',
        href: '/users',
    },

];

export default function CreateTechnician() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    
                    <ButtonBack />
                    <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                
                            <CreateTechnicianForm />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
