import React from 'react';
import { ServiData } from '@/types';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { appUrl } from '@/config/env';
import { NavDropDown } from '@/components/cards/service/NavDropDown';
import { mainNavItems } from '@/constants/items';

interface ServiceDataPropCard {
    service: ServiData,
    handleDelete: () => void,
}

const ServiceCard = ({ service, handleDelete }: ServiceDataPropCard ) => {
    const dropdownId = `dropdown-${service.id}`;
    const buttonId = `dropdownButton-${service.id}`;
    const getInitials = useInitials()
    return (
        <div>
            <div className="flex justify-end px-4 pt-2">
                <button
                    id={`${buttonId}`}
                    data-dropdown-toggle={`${dropdownId}`}
                    className="inline-block rounded-lg p-1.5 text-sm text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    type="button"
                >
                    <span className="sr-only">Open dropdown</span>
                    <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                </button>
                <div
                    id={`${dropdownId}`}
                    className="z-10 hidden w-44 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow-sm dark:bg-gray-700"
                >
                    <ul className="py-2" aria-labelledby="dropdownButton">
                        <NavDropDown items={mainNavItems} service={service} handleDelete={handleDelete} />
                    </ul>
                </div>
            </div>
            <a
                href="#"
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-100 md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
                {service.file?.[0]?.path ? (
                    <img
                        src={`${appUrl}/storage/${service.file?.[0]?.path}`}
                        className="max-h-full w-full max-w-full rounded border md:w-80"
                        alt="Servi File"
                    />
                ) : (
                    <img src={`${appUrl}/images/image.png`} className="max-h-full w-full max-w-full rounded border md:w-80" alt="Servi File" />
                )}
                <div className="flex flex-col justify-between p-4 leading-normal">
                    <SidebarGroupLabel>
                        Datos del servicio: <span className="text-blue-500 ml-1 ">{ service.uuid}</span>
                    </SidebarGroupLabel>
                    <div className="flex pt-3">
                        <SidebarGroupLabel> CLIENTE: </SidebarGroupLabel>
                        <Avatar className="ms-3 h-8 w-8 rounded-full">
                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(service.client.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-col ps-3">
                            <div className="text-base font-semibold">{service.client.name}</div>
                            <div className="text-base text-gray-500">{service.client.phone}</div>
                            <div className="text-base text-gray-500">
                                <div className="[overflow-wrap:anywhere]">{service.client.email}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex pt-3">
                        <SidebarGroupLabel> PRODUCTO: </SidebarGroupLabel>
                        <div className="flex-col ps-3">
                            <div className="text-base font-semibold">{service.product.name}</div>
                            <div className="text-base font-semibold">{service.product.brand}</div>
                            <div className="font-normal text-gray-500">{service.product.model}</div>
                        </div>
                    </div>
                    <div className="flex-col pt-3">
                        <SidebarGroupLabel> DETALLES DE INGRESO: </SidebarGroupLabel>
                        {service.reasons.map((reason) => (
                            <div className="text-base font-semibold" key={reason.id}>
                                {reason.reason_note}{' '}
                            </div>
                        ))}
                    </div>
                    <div className="flex pt-3">
                        <SidebarGroupLabel> FECHA: </SidebarGroupLabel>
                        <div className="mt-1 flex-col ps-3">
                            {new Date(service.date_entry).toLocaleString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
                    </div>
                    {service.diagnosis.length > 0 && (
                        <div className="flex-col pt-3">
                            <SidebarGroupLabel> DIAGNOSTICO: </SidebarGroupLabel>
                            {service.diagnosis.map((diagnosis) => (
                                <div className="text-base font-semibold" key={diagnosis.id}>
                                    {diagnosis.diagnosis}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </a>
        </div>
    );
}

export { ServiceCard }
