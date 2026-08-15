import CreateProductForm from '@/components/forms/product/CreateProductForm';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Producto',
        href: '/product',
    },
    {
        title: 'Crear',
        href: '/',
    },
];

export default function CreateProduct() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Producto" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package className="text-muted-foreground h-6 w-6" />
                                <div>
                                    <h1 className="text-2xl font-semibold">Crear producto</h1>
                                    <p className="text-muted-foreground text-sm">Registra un nuevo tipo de producto.</p>
                                </div>
                            </div>
                        </div>

                        <CreateProductForm />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
