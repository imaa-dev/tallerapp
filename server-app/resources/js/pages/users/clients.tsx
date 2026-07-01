import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useInitials } from '@/hooks/use-initials';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ButtonAdd from '@/components/button-add';
import { useConfirmDialog } from '@/context/ModalContext';
import { deleteClient } from '@/api/clients/clientsService';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clientes',
        href: '/clients'
    },
];
interface DataProp {
    clients: User[],
}
export default function Users({clients}: DataProp){

    const { success, error } = useToast()
    const [ clientShow, setClientShow ] = useState(clients)
    const getInitials = useInitials();
    const { showConfirm } = useConfirmDialog();

    const handleDelete = (clientId: number) => {
        showConfirm({
            title: "Deseas eliminar al usuario",
            onConfirm: () => removeClient(clientId)
        })
    }
    const removeClient = async (id: number) => {
        try {
            const response = await deleteClient(id);
            console.log(response)
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
                        <ButtonAdd route="/create/user-client" title="Agregar Cliente" />
                    </div>
                    
                    <div className="flex h-full flex-1 flex-col items-center gap-4 px-1 sm:px-5">
                        <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                    {clientShow.map((user: User, index: number)=> (
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

                                            <td className="px-6 py-4">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.phone ? user.phone : 'Celular sin ingresar' }
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
    )
}
