import { deleteClient } from '@/api/clients/clientsService';
import { getUsers } from '@/api/users/usersService';
import DataFilterPagination from '@/components/data-table/DataFilterPagination';
import DataTableFilters from '@/components/data-table/DataTableFilters';
import { CreateClientForm } from '@/components/forms/client/CreateClientForm';
import ListOrganizationForm from '@/components/forms/organization/listOrganizationForm';
import { CreateTechnicianForm } from '@/components/forms/user/CreateTechnicianForm';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useConfirmDialog } from '@/context/ModalContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OrganizationData, Pagination, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { CirclePlus, Pencil, Plus, Trash2, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
    },
];
interface DataProp {
    users: User[];
    organizations: OrganizationData[];
    pagination: Pagination;
}
export default function Users({ users, organizations, pagination: initialPagination }: DataProp) {
    const { success, error } = useToast();
    const [usersShow, setUsersShow] = useState(users);
    const [pagination, setPagination] = useState(initialPagination);
    const [filters, setFilters] = useState({
        search: '',
        email: '',
        rol: '',
    });
    const getInitials = useInitials();
    const { showConfirm } = useConfirmDialog();
    const { openModal } = useModal();
    const handleDelete = (clientId: number) => {
        showConfirm({
            title: 'Deseas eliminar al usuario',
            onConfirm: () => removeClient(clientId),
        });
    };
    const handleFilterChange = (field: string, value: string) => {
        setFilters((prev) => ({
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
            search: '',
            email: '',
            rol: '',
        };

        setFilters(reset);

        await searchUsers(1);
    };
    const removeClient = async (id: number) => {
        try {
            const response = await deleteClient(id);
            success(response.message);
            setUsersShow((prev) => prev.filter((usr) => usr.id !== id));
        } catch (err: unknown) {
            if (!axios.isAxiosError(err) || !err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            const { status, data } = err.response;
            switch (status) {
                case 409:
                    error(data?.message ?? 'No se pudo eliminar el registro.');
                    break;

                case 422:
                    error(data?.message ?? 'Los datos enviados son inválidos.');
                    break;

                case 401:
                    error('Tu sesión ha expirado.');
                    break;

                case 403:
                    error('No tienes permisos para realizar esta acción.');
                    break;

                case 404:
                    error('La organización no existe.');
                    break;

                case 500:
                    error('Ha ocurrido un error interno del servidor.');
                    break;

                default:
                    error(data?.message ?? 'Ha ocurrido un error inesperado.');
            }
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cliente" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        <div className="mb-6 flex items-center gap-3">
                            <UsersIcon className="text-muted-foreground h-6 w-6" />
                            <h1 className="text-2xl font-semibold">Usuarios</h1>
                        </div>

                        <DataTableFilters
                            fields={[
                                {
                                    key: 'search',
                                    label: 'Buscar usuario',
                                    placeholder: 'Buscar nombre usuario',
                                },
                                {
                                    key: 'email',
                                    label: 'Email',
                                },
                                {
                                    key: 'rol',
                                    label: 'Rol',
                                },
                            ]}
                            values={filters}
                            onChange={handleFilterChange}
                            onSearch={searchUsers}
                            onClear={clearFilters}
                            actions={
                                <>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => openModal(() => <CreateClientForm onCreated={() => searchUsers(1)} />)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Agregar Cliente
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => openModal(() => <CreateTechnicianForm onCreated={() => searchUsers(1)} />)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Agregar Tecnico
                                    </Button>
                                </>
                            }
                        />

                        <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">
                            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Nombre
                                        </th>
                                        <th>Rol</th>
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
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                        >
                                            <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
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
                                            <td>{user.rol}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{user.phone ? user.phone : 'Celular sin ingresar'}</td>
                                            <td className="px-6 py-4">
                                                <button type="button" className="p-2" onClick={() => router.visit(`/update/${user.id}/user-client`)}>
                                                    <Pencil color={'#1d4ed8'} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="p-2"
                                                    onClick={() => {
                                                        handleDelete(user.id);
                                                    }}
                                                >
                                                    <Trash2 color={'#b91c1c'} />
                                                </button>
                                                {user.rol === 'TECHNICIAN' && (
                                                    <button
                                                        type="button"
                                                        className="p-2"
                                                        onClick={() =>
                                                            openModal(() => <ListOrganizationForm user={user} organizations={organizations} />)
                                                        }
                                                    >
                                                        <CirclePlus />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <DataFilterPagination pagination={pagination} onPageChange={searchUsers} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
