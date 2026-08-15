import { CreateClientForm } from '@/components/forms/client/CreateClientForm';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
    },
    {
        title: 'Crear Cliente',
        href: '/users',
    },
];

export default function CreateClient() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Cliente" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserPlus className="text-muted-foreground h-6 w-6" />
                                <div>
                                    <h1 className="text-2xl font-semibold">Crear cliente</h1>
                                    <p className="text-muted-foreground text-sm">Registra un nuevo cliente en tu organización.</p>
                                </div>
                            </div>
                        </div>

                        <CreateClientForm />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
