import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem, OrganizationData } from '@/types';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ButtonBack from '@/components/button-back';
import { deleteOrganization } from '@/api/organization/organizationService';
import { useConfirmDialog } from '@/context/ModalContext';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useLoading } from '@/context/LoadingContext';
import { useInitials } from '@/hooks/use-initials';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organización',
        href: '/organization/show',
    },
    {
        title: 'Listar',
        href: '/list/organization',
    }
];
interface OrganizationDataProp {
    organizations:  OrganizationData[];
}
const appUrl = import.meta.env.VITE_APP_URL;
export default function ListOrganization({ organizations }: OrganizationDataProp) {
    const { success, error } = useToast()
    const [orgList, setOrgList] = useState(organizations);
    const { showConfirm } = useConfirmDialog();
    const { showLoading, hideLoading } = useLoading();
    const getInitials = useInitials();
    useEffect(() => {
        setOrgList(organizations)
    },[organizations])
    const handleDelete = (organizationId: number) => {
        showConfirm({
            title: "Deseas eliminar la organizacion",
            onConfirm: () => handleRemoveOrganization(organizationId)
        })
    }
    const handleRemoveOrganization = async (id: number) => {
        showLoading()
        const response = await deleteOrganization(id)
        if (response.code === 200 && typeof response.message === "string") {
            success(response.message);
            setOrgList(prev => prev.filter(org => org.id !== id));
        }
        if(response.code === 422 && typeof response.message === 'string') {
            error(response.message)
        }
        hideLoading()
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizacion" />
            <ButtonBack />
            <div className="flex h-full flex-1 flex-col items-center gap-4 px-4 sm:px-5">
                <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">
                    <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                        <thead
                            className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Organizacion
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Activa
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {orgList.map((organization: OrganizationData, index: number) => (
                            <tr
                                key={index}
                                className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                            >

                                <th scope="row"
                                    className="flex items-center px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                                    {organization.file && organization.file.path ? (
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={`${appUrl}/storage/${organization.file?.path}`}
                                                alt="logo image"
                                            />
                                        ) :
                                         <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(organization.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    }
                                    <div className="ps-3">
                                        <div className="text-base font-semibold">{organization.name}</div>
                                        <div className="font-normal text-gray-500">{organization.description}</div>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    {organization.active ? (
                                        <div className="flex items-center">
                                            <div className="me-2 h-2.5 w-2.5 rounded-full bg-green-500"></div>
                                            Activa
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <div className="me-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>
                                            Inactiva
                                        </div>
                                    )}
                                </th>

                                <td className="px-6 py-4">
                                    <button
                                        type="button"
                                        className="p-2"
                                        onClick={() => {
                                            router.visit(`/organization/${organization.id}/edit`);
                                        }}
                                    >
                                        <Pencil color={'#1d4ed8'} />
                                    </button>

                                    <button
                                        type="button"
                                        className="p-2"
                                        onClick={() => {
                                            handleDelete(organization.id)
                                        }}
                                    >
                                        <Trash2 color={'#b91c1c'} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
