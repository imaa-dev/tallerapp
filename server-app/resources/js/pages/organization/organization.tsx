import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem, OrganizationData } from '@/types';
import { Button } from '@/components/ui/button';
import ButtonAdd from '@/components/button-add';
import ButtonList from '@/components/button-list';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organización',
        href: '/organization/show',
    },
];
interface OrganizationDataProp {
    organization:  OrganizationData;
}
const appUrl = import.meta.env.VITE_APP_URL;

export default function Organization({ organization }: OrganizationDataProp) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizacion" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex">
                    <ButtonAdd  route="/create/organization" title="Agregar Organizacion" />
                    <ButtonList route="/list/organization" title="Listar Organizaciones" />
                </div>
                <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    {organization ? (
                        <div className="max-w-sm overflow-hidden rounded shadow-lg">
                            <img className="w-110" src={
                                organization?.file?.path
                                ? `${appUrl}/storage/${organization.file.path}`
                                : `${appUrl}/images/image.png`
                            } alt="Image organization" />
                            <div className="px-6 py-4">
                                <div className="mb-2 text-xl font-bold">{organization.name}</div>
                                <p className="text-base text-gray-700">
                                    {organization.description}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-sm overflow-hidden rounded shadow-lg">
                            <img className="w-110 p-20" src={`${appUrl}/images/organization.png`} alt="Image default" />
                            <div className="px-6 py-4">
                                <div className="mb-2 text-xl font-bold">Tu Organizacion</div>
                                <p className="text-base text-gray-700">
                                    Descripcion de organizacion
                                </p>
                                <Button
                                    onClick={() => router.visit('/create/organization')}
                                    className="mt-4 w-full"
                                >
                                    Crear Organizacion
                                </Button>
                            </div>

                        </div>
                    )}

                </div>
            </div>
            </div>
        </AppLayout>
    );
}
