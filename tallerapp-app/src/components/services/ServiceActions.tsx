import { useRouter } from 'expo-router';

import { ServiceRecord } from '@/types/servi/servi.type';
import {ActionBottomSheet, ServiceAction,} from "@/components/services/ActionBottomSheet";

interface Props {
    service: ServiceRecord;
    handleDelete: () => void;
}

export function ServiceActions({
                                   service,
                                   handleDelete,
                               }: Props) {

    const router = useRouter();

    const actions: ServiceAction[] = [];

    // Editar
    actions.push({
        title: 'Editar',
        icon: 'edit',
        onPress: (service) => {
            router.push(`/service/${service.id}/edit`);
        },
    });

    // Diagnosticar
    if (service.status_id === 2) {
        actions.push({
            title: 'Diagnosticar',
            icon: 'build',
            onPress: (service) => {
                console.log(service);
            },
        });
    }

    // Eliminar
    actions.push({
        title: 'Eliminar',
        icon: 'delete',
        danger: true,
        onPress: () => {
            handleDelete();
        },
    });

    return (
        <ActionBottomSheet
            service={service}
            actions={actions}
        />
    );
}