import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OrganizationData, Pagination, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useInitials } from '@/hooks/use-initials';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ButtonAdd from '@/components/button-add';
import { useConfirmDialog } from '@/context/ModalContext';
import { deleteClient } from '@/api/clients/clientsService';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { CirclePlus } from 'lucide-react';
import { useModal } from '@/context/ModalContextForm';
import ListOrganizationForm from '@/components/forms/organization/listOrganizationForm';
import { getUsers } from '@/api/users/usersService';
import DataTableFilters from '@/components/data-table/DataTableFilters';
import DataFilterPagination from '@/components/data-table/DataFilterPagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users'
    },
];
interface DataProp {
    users: User[],
    organizations: OrganizationData[],
    pagination: Pagination
}
export default function Users({ users, organizations, pagination: initialPagination }: DataProp) {

    const { success, error } = useToast()
    const [usersShow, setUsersShow] = useState(users)
    const [pagination, setPagination] = useState(initialPagination);
    const [filters, setFilters] = useState({
        search: "",
        brand: "",
        model: "",
    });
    const getInitials = useInitials();
    const { showConfirm } = useConfirmDialog();
    const { openModal } = useModal();
    useEffect(() => {
        router.reload({ only: ['users'] })
    }, [])
    const handleDelete = (clientId: number) => {
        showConfirm({
            title: "Deseas eliminar al usuario",
            onConfirm: () => removeClient(clientId)
        })
    }
    const handleFilterChange = (
        field: keyof typeof filters,
        value: string
    ) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
        }));
    };
    const searchUsers = async (page = 1) => {

        try {

            const response = await getUsers({
                ...filters,
                page,
            });

            if (response.success) {

                setUsersShow(response.users);
                setPagination(response.pagination);

            }

        } catch (err) {
            console.error(err);
        }

    };
    const clearFilters = async () => {

        const reset = {
            search: "",
            brand: "",
            model: "",
        };

        setFilters(reset);

        await searchUsers(1);

    };
    const removeClient = async (id: number) => {
        try {
            const response = await deleteClient(id);
            success(response.message)
            setUsersShow(prev => prev.filter(usr => usr.id !== id));
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
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cliente" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className='flex' >

                    </div>
                    <div className="flex h-full flex-1 flex-col items-center gap-4 px-1 sm:px-5">
                        <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">
                            <DataTableFilters
                                fields={[
                                    {
                                        key: "search",
                                        label: "Buscar usuario",
                                        placeholder: "Buscar nombre usuario"
                                    },
                                    {
                                        key: "email",
                                        label: "Email"
                                    },
                                    {
                                        key: "rol",
                                        label: "Rol"
                                    }
                                ]}
                                values={filters}
                                onChange={handleFilterChange}
                                onSearch={searchUsers}
                                onClear={clearFilters}
                                actions={
                                    <>
                                        <ButtonAdd route="/create/user-client" title="Agregar Cliente" />
                                        <ButtonAdd route="/create/user-technician" title="Agregar Tecnico" />
                                    </>
                                }
                            />
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Nombre
                                        </th>
                                        <th>
                                            Rol
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Celular
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Accion
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersShow.map((user: User, index: number) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">

                                            <th scope="row"
                                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">{user.name}</div>
                                                    <div className="font-normal text-gray-500">{user.email}</div>
                                                </div>
                                            </th>
                                            <td>
                                                {user.rol}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.phone ? user.phone : 'Celular sin ingresar'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    className="p-2"
                                                    onClick={() => router.visit(`/update/${user.id}/user-client`)}
                                                >
                                                    <Pencil color={'#1d4ed8'} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="p-2"
                                                    onClick={() => {
                                                        handleDelete(user.id)
                                                    }}
                                                >
                                                    <Trash2 color={'#b91c1c'} />
                                                </button>
                                                {user.rol === 'TECHNICIAN' && (
                                                    <button
                                                        type="button"
                                                        className="p-2"
                                                        onClick={() => openModal(() => (<ListOrganizationForm user={user} organizations={organizations} />))}
                                                    >
                                                        <CirclePlus />
                                                    </button>
                                                )}

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <DataFilterPagination
                                pagination={pagination}
                                onPageChange={searchUsers}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}
