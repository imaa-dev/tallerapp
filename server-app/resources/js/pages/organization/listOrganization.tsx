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
import { useModal } from '@/context/ModalContextForm';
import AskOrganizacion from '@/components/forms/organization/askOrganization';


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
    const { openModal } = useModal()
    useEffect(() => {
        setOrgList(organizations)
        const activeOrganization = orgList.filter(org => org.status === 'trial' || org.status === 'active').length

        if(!activeOrganization){
            openModal(() => <AskOrganizacion /> )
        }
    },[organizations])
    const handleDelete = (organizationId: number) => {
        showConfirm({
            title: "Deseas eliminar la organizacion",
            onConfirm: () => handleRemoveOrganization(organizationId)
        })
    }
    const handleRemoveOrganization = async (id: number) => {
        showLoading()
        try {
            const response = await deleteOrganization(id)
            success(response.message);
            setOrgList(prev => prev.filter(org => org.id !== id));
        } catch (err: any) {
            if (!err.response) {
                // Backend apagado, timeout, sin internet, CORS, etc.
                error("No fue posible conectar con el servidor.");
                return;
            }
            const status = err.response.status;
            switch (status) {
                case 409:
                    error(err.response.data.message ?? "No se pudo eliminar el registro.");
                    break;

                case 422:
                    error(err.response.data.message ?? "Los datos enviados son inválidos.");
                    break;

                case 401:
                    error("Tu sesión ha expirado.");
                    break;

                case 403:
                    error("No tienes permisos para realizar esta acción.");
                    break;

                case 404:
                    error("La organización no existe.");
                    break;

                case 500:
                    error("Ha ocurrido un error interno del servidor.");
                    break;

                default:
                    error(
                        err.response.data?.message ??
                        "Ha ocurrido un error inesperado."
                    );
            }
        } finally {
            hideLoading()
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizacion" />
            <ButtonBack />
            <div className="flex h-full flex-1 flex-col items-center gap-4 px-4 sm:px-5">
                <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">
                    <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Organizacion
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Estado
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Subscripción
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
                                    <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                                        {organization.file && organization.file.path ? (
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={`${appUrl}/storage/${organization.file?.path}`}
                                                alt="logo image"
                                            />
                                        ) : (
                                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(organization.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="ps-3">
                                            <div className="text-base font-semibold">{organization.name}</div>
                                            <div className="font-normal text-gray-500">{organization.description}</div>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        {organization.status === 'active' && (
                                            <div className="flex items-center">
                                                <div className="me-2 h-2.5 w-2.5 rounded-full bg-green-500"></div>
                                                {organization.status}
                                            </div>
                                        )}
                                        {organization.status === 'inactive' && (
                                            <div className="flex items-center">
                                                <div className="me-2 h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                                                {organization.status}
                                            </div>
                                        )}
                                        {organization.status === 'blocked' && (
                                            <div className="flex items-center">
                                                <div className="me-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>
                                                {organization.status}
                                            </div>
                                        )}
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        {organization.subscription.status === 'trial' && (
                                            <div className="flex items-center">
                                                <div className="me-2 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                                                {organization.subscription.status}
                                            </div>
                                        )}
                                        {organization.subscription.status === 'active' && (
                                            <div className="flex items-center">
                                                <div className="me-2 h-2.5 w-2.5 rounded-full bg-green-500"></div>
                                                {organization.subscription.status}
                                            </div>
                                        )}
                                        {organization.subscription.status === 'cancelled' && (
                                            <div className="flex items-center">
                                                <div className="me-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>
                                                {organization.subscription.status}
                                            </div>
                                        )}
                                        {organization.subscription.status === 'expired' && (
                                            <div className="flex items-center">
                                                <div className="me-2 h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                                                {organization.subscription.status}
                                            </div>
                                        )}
                                        {organization.subscription.status === 'suspected' && (
                                            <div className="flex items-center">
                                                <div className="me-2 h-2.5 w-2.5 rounded-full bg-black"></div>
                                                {organization.subscription.status}
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
                                                handleDelete(organization.id);
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
