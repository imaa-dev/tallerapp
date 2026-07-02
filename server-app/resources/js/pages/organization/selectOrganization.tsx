import { OrganizationData } from "@/types";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from "react";
import { useInitials } from "@/hooks/use-initials";
import { selectOrganization } from "@/api/organization/organizationService";
import { router } from "@inertiajs/react";
import { useToast } from "@/context/ToastContext";

const appUrl = import.meta.env.VITE_APP_URL;

interface OrganizationDataProp {
    organizations:  OrganizationData[];
}

export default function Organization({
    organizations,
}: OrganizationDataProp) {

    const [orgList] = useState(organizations);
    const getInitials = useInitials();
    const { error } = useToast();
    const handleSelectOrganization = async (organization_id: number) => {
        
        try {
            const response = await selectOrganization(organization_id);
            router.get('/dashboard')
        } catch (err: any) {
            console.log(err)
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
        <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 sm:px-5">
            <div className="w-full max-w-2xl overflow-x-auto rounded-lg border shadow-md">
                <div className="border-b px-6 py-4 text-lg font-semibold">
                    Seleccionar Organización
                </div>

                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-3">
                                Organización
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {orgList.map((organization, index) => (
                            <tr
                                key={index}
                                className="cursor-pointer border-b bg-white hover:bg-gray-50"
                            >
                                <td className="px-6 py-4">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleSelectOrganization(organization.id)
                                        }}
                                        className="flex items-center"
                                    >
                                        {organization.file?.path ? (
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={`${appUrl}/storage/${organization.file.path}`}
                                                alt="logo"
                                            />
                                        ) : (
                                            <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                                                <AvatarFallback className="bg-neutral-200 text-black">
                                                    {getInitials(
                                                        organization.name
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div className="ps-3">
                                            <div className="text-base font-semibold text-gray-900">
                                                {organization.name}
                                            </div>
                                            <div className="text-gray-500">
                                                {organization.description}
                                            </div>
                                        </div>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}