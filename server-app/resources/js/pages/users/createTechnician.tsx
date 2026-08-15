import { CreateTechnicianForm } from '@/components/forms/user/CreateTechnicianForm';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { UserCog } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
    },
    {
        title: 'Crear Técnico ',
        href: '/users',
    },
];

export default function CreateTechnician() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Técnico" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserCog className="text-muted-foreground h-6 w-6" />
                                <div>
                                    <h1 className="text-2xl font-semibold">Crear técnico</h1>
                                    <p className="text-muted-foreground text-sm">Registra un nuevo técnico en tu organización.</p>
                                </div>
                            </div>
                        </div>

                        <CreateTechnicianForm />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
