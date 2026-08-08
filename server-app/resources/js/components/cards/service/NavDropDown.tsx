import { type NavItemDrop, ServiData } from '@/types';
import { ServiceStatus } from '@/constants/service-status';
import { router } from '@inertiajs/react';
import { useModal } from '@/context/ModalContextForm';
import { CreateDiagnosisForm } from '@/components/forms/service/CreateDiagnosisForm';
import { ToDiagnosisForm } from '@/components/forms/service/ToDiagnosisForm';
import ToGoBack from '@/components/to-go-back';
import ToSparePartsForm from '@/components/forms/service/ToSparePartsForm';
import { CreateRepairForm } from '@/components/forms/service/CreateRepairForm';
import { ToDeliveredForm } from '@/components/forms/service/ToDeliveredForm';
import { ToCostApprovalForm } from '@/components/forms/service/ToCostApprovalForm';
import { ToCostApprovalTransitionForm } from '@/components/forms/service/ToCostApprovalTransitionForm';
import { ToFinalRepairForm } from '@/components/forms/service/ToFinalRepairForm';


export function NavDropDown({ items = [], service, handleDelete }: { items: NavItemDrop[] } & { service: ServiData } & {handleDelete: (id: number) => void}  ) {
    const { openModal } = useModal();

    return (
        <>
            {items.map((item) => {
                if (service.status_id !== ServiceStatus.Diagnosis && item.title === 'Diagnosticar') return null;
                if (service.status_id === ServiceStatus.Diagnosis && item.title === 'Reparar') return null;
                if (service.status_id === ServiceStatus.Reception && item.title === 'Regresar') return null;
                if (service.status_id !== ServiceStatus.InRepair && item.title === 'Reparar') return null;
                if (service.status_id !== ServiceStatus.Reception && item.title === 'A Taller') return null;
                if (service.status_id !== ServiceStatus.SparePartApproval && item.title === 'Agregar repuestos') return null;
                if (service.status_id !== ServiceStatus.SparePartApproval && item.title === 'Enviar a aprobación de costos') return null;
                if (service.status_id !== ServiceStatus.CostApproval && item.title === 'Aprobar costos') return null;
                if (service.status_id !== ServiceStatus.Repaired && item.title === 'Enviar reparación final') return null;
                if (service.status_id !== ServiceStatus.Repaired && item.title === 'Entregar servicio') return null;

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
                                    if (item.title === 'A Taller') {
                                        openModal(() => <ToDiagnosisForm serviceId={service.id} />);
                                    }
                                    if (item.title === 'Diagnosticar') {
                                        openModal(() => <CreateDiagnosisForm service={service} />);
                                    }
                                    if (item.title === 'Agregar repuestos') {
                                        openModal(() => <ToSparePartsForm serviceId={service.id} />);
                                    }
                                    if (item.title === 'Enviar a aprobación de costos') {
                                        openModal(() => <ToCostApprovalTransitionForm serviceId={service.id} />);
                                    }
                                    if (item.title === 'Aprobar costos') {
                                        openModal(() => <ToCostApprovalForm serviceId={service.id} />);
                                    }
                                    if (item.title === 'Enviar reparación final') {
                                        openModal(() => <ToFinalRepairForm serviceId={service.id} />);
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
                                href='#'
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
