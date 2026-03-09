import { type NavItemDrop, ServiData } from '@/types';
import { router } from '@inertiajs/react';
import { useModal } from '@/context/ModalContextForm';
import { CreateDiagnosisForm } from '@/components/forms/service/CreateDiagnosisForm';
import { ToDiagnosisForm } from '@/components/forms/service/ToDiagnosisForm';
import ToGoBack from '@/components/to-go-back';
import ToSparePartsForm from '@/components/forms/service/ToSparePartsForm';
import { CreateRepairForm } from '@/components/forms/service/CreateRepairForm';
import { ToRepairForm } from '@/components/forms/service/ToRepairForm';
import { ToDeliveredForm } from '@/components/forms/service/ToDeliveredForm';


export function NavDropDown({ items = [], service, handleDelete }: { items: NavItemDrop[] } & { service: ServiData } & {handleDelete: (id: number) => void}  ) {
    const { openModal } = useModal();

    return (
        <>
            {items.map((item) => {
                if (service.status_id !== 2 && item.title === 'Diagnosticar') return null;
                if (service.status_id === 2 && item.title === 'Reparar') return null;
                if (service.status_id === 1 && item.title === 'Regresar') return null;
                if (service.status_id !== 4 && item.title === 'Reparar') return null;
                if (service.status_id !== 1 && item.title === 'A Taller') return null;
                if (service.status_id !== 3 && item.title === 'Aprobar repuestos') return null;
                if (service.status_id !== 3 && item.title === 'Continuar sin repuestos') return null;
                if (service.status_id !== 5 && item.title === 'Entregar servicio') return null;

                    return (
                        <li key={item.title}>
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (item.title === 'Eliminar') {
                                        handleDelete(service.id);
                                    }
                                    if (item.title === 'Editar') {
                                        router.visit(`/edit/${service.id}/service`);
                                    }
                                    if (item.title === 'Reparar') {
                                        console.log('create a form');
                                    }
                                    if (item.title === 'Diagnosticar') {
                                        openModal(() => <CreateDiagnosisForm service={service} />);
                                    }
                                    if (item.title === 'Aprobar repuestos') {
                                        openModal(() => <ToSparePartsForm serviceId={service.id} />);
                                    }
                                    if (item.title === 'A Taller') {
                                        openModal(() => <ToDiagnosisForm serviceId={service.id} />);
                                    }
                                    if (item.title === 'Continuar sin repuestos') {
                                        openModal(() => <ToRepairForm serviceId={service.id} />);
                                    }
                                    if (item.title === 'Reparar') {
                                        openModal(() => <CreateRepairForm serviceId={service.id} />);
                                    }
                                    if (item.title === 'Regresar') {
                                        openModal(() => <ToGoBack service={service} />);
                                    }
                                    if(item.title === 'Entregar servicio'){
                                        openModal( () => <ToDeliveredForm serviceId={service.id} /> )
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </a>
                        </li>
                    );
            })}
        </>
    );
}
