import { CreateDiagnosisForm } from '@/components/forms/service/CreateDiagnosisForm';
import { CreateRepairForm } from '@/components/forms/service/CreateRepairForm';
import { ToCostApprovalForm } from '@/components/forms/service/ToCostApprovalForm';
import { ToCostApprovalTransitionForm } from '@/components/forms/service/ToCostApprovalTransitionForm';
import { ToDeliveredForm } from '@/components/forms/service/ToDeliveredForm';
import { ToDiagnosisForm } from '@/components/forms/service/ToDiagnosisForm';
import { ToFinalRepairForm } from '@/components/forms/service/ToFinalRepairForm';
import ToSparePartsForm from '@/components/forms/service/ToSparePartsForm';
import ToGoBack from '@/components/to-go-back';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ServiceStatus } from '@/constants/service-status';
import { useModal } from '@/context/ModalContextForm';
import { type NavItemDrop, ServiData } from '@/types';
import { router } from '@inertiajs/react';

export function NavDropDown({
    items = [],
    service,
    handleDelete,
}: { items: NavItemDrop[] } & { service: ServiData } & { handleDelete: (id: number) => void }) {
    const { openModal } = useModal();

    const handleAction = (title: string) => {
        switch (title) {
            case 'Eliminar':
                handleDelete(service.id);
                break;
            case 'Editar':
                router.visit(`/edit/${service.id}/service`);
                break;
            case 'A Taller':
                openModal(() => <ToDiagnosisForm serviceId={service.id} />);
                break;
            case 'Diagnosticar':
                openModal(() => <CreateDiagnosisForm service={service} />);
                break;
            case 'Agregar repuestos':
                openModal(() => <ToSparePartsForm serviceId={service.id} />);
                break;
            case 'Enviar a aprobación de costos':
                openModal(() => <ToCostApprovalTransitionForm serviceId={service.id} />);
                break;
            case 'Aprobar costos':
                openModal(() => <ToCostApprovalForm serviceId={service.id} />);
                break;
            case 'Enviar reparación final':
                openModal(() => <ToFinalRepairForm serviceId={service.id} />);
                break;
            case 'Reparar':
                openModal(() => <CreateRepairForm serviceId={service.id} />);
                break;
            case 'Regresar':
                openModal(() => <ToGoBack service={service} />);
                break;
            case 'Entregar servicio':
                openModal(() => <ToDeliveredForm serviceId={service.id} />);
                break;
        }
    };

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
                    <DropdownMenuItem
                        key={item.title}
                        variant={item.title === 'Eliminar' ? 'destructive' : 'default'}
                        onClick={() => handleAction(item.title)}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </DropdownMenuItem>
                );
            })}
        </>
    );
}
