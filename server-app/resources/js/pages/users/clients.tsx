import { deleteClient } from '@/api/clients/clientsService';
import { CreateClientForm } from '@/components/forms/client/CreateClientForm';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useConfirmDialog } from '@/context/ModalContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Client } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clientes',
        href: '/clients',
    },
];
interface DataProp {
    clients: Client[];
}
export default function Users({ clients }: DataProp) {
    const { success, error } = useToast();
    const [clientShow, setClientShow] = useState(clients);
    const getInitials = useInitials();
    const { showConfirm } = useConfirmDialog();
    const { openModal } = useModal();

    const handleDelete = (clientId: number) => {
        showConfirm({
            title: 'Deseas eliminar al usuario',
            onConfirm: () => removeClient(clientId),
        });
    };
    const removeClient = async (id: number) => {
        try {
            const response = await deleteClient(id);
            success(response.message);
            setClientShow((prev) => prev.filter((client) => client.id !== id));
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
                    <div className="flex">
                        <Button type="button" size="sm" onClick={() => openModal(() => <CreateClientForm setClientsData={setClientShow} />)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Cliente
                        </Button>
                    </div>

                    <div className="flex h-full flex-1 flex-col items-center gap-4 px-1 sm:px-5">
                        <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">
                            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Nombre
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
                                    {clientShow.map((client: Client, index: number) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                        >
                                            <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                        {getInitials(client.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">{client.name}</div>
                                                    <div className="font-normal text-gray-500">{client.email}</div>
                                                </div>
                                            </th>

                                            <td className="px-6 py-4">{client.email}</td>
                                            <td className="px-6 py-4">{client.phone ? client.phone : 'Celular sin ingresar'}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    className="p-2"
                                                    onClick={() => router.visit(`/update/${client.id}/user-client`)}
                                                >
                                                    <Pencil color={'#1d4ed8'} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="p-2"
                                                    onClick={() => {
                                                        handleDelete(client.id);
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
                </div>
            </div>
        </AppLayout>
    );
}
