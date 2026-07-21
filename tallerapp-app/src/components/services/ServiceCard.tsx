import React from 'react';

import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import {appUrl} from '@/config/env';
import {ServiceRecord} from "@/types/servi/servi.type";
import {ActionBottomSheet, ServiceActions} from "@/components/services/ServiceActions";

interface Props {
    service: ServiceRecord;
    handleDelete: () => void;
}

export function ServiceCard({
                                service,
                                handleDelete
                            }: Props) {
    const image = service.file?.[0]?.path
        ?
        `${appUrl}/storage/${service.file[0].path}`
        :
        `${appUrl}/images/image.png`;
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <ServiceActions
                    service={service}
                    handleDelete={handleDelete}
                />

            </View>
            <Image
                source={{
                    uri: image
                }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.title}>
                    Datos del servicio
                </Text>
                <Text>
                    UUID:
                    <Text style={styles.blue}>
                        {' '}{service.uuid}
                    </Text>
                </Text>
                <Text>
                    Número:
                    <Text style={styles.blue}>
                        {' '}{service.id}
                    </Text>
                </Text>
                {/* CLIENTE */}
                <Text style={styles.section}>
                    CLIENTE
                </Text>
                <Text style={styles.bold}>
                    {service.client.name}
                </Text>
                <Text>
                    {service.client.phone}
                </Text>
                <Text>
                    {service.client.email}
                </Text>
                {/* PRODUCTO */}
                <Text style={styles.section}>
                    PRODUCTO
                </Text>
                <Text style={styles.bold}>
                    {service.product.name}
                </Text>
                <Text>
                    {service.product.brand}
                </Text>
                <Text>
                    {service.product.model}
                </Text>
                {/* MOTIVOS */}
                <Text style={styles.section}>
                    DETALLES INGRESO
                </Text>
                {
                    service.reasons.map(reason => (
                        <Text
                            key={reason.id}
                            style={styles.bold}
                        >
                            {reason.reason_note}
                        </Text>
                    ))
                }
                {/* FECHA */}
                <Text style={styles.section}>
                    FECHA
                </Text>
                <Text>
                    {
                        new Date(service.date_entry)
                            .toLocaleString('es-ES')
                    }
                </Text>
                {
                    service.diagnosis.length > 0 &&
                    <>
                        <Text style={styles.section}>
                            DIAGNOSTICO
                        </Text>
                        {
                            service.diagnosis.map(item => (
                                <Text
                                    key={item.id}
                                    style={styles.bold}
                                >
                                    {item.diagnosis}
                                </Text>
                            ))
                        }
                    </>
                }
                {
                    service.approve_spare_parts === 1 &&
                    <Text style={styles.approved}>
                        Instalación de piezas aprobada
                    </Text>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3
    },
    header: {
        alignItems: 'flex-end',
        padding: 10
    },
    image: {
        width: '100%',
        height: 220
    },
    content: {
        padding: 16
    },
    section: {
        marginTop: 14,
        fontWeight: '700',
        fontSize: 15
    },
    title: {
        fontWeight: '700'
    },
    bold: {
        fontWeight: '600'
    },
    blue: {
        color: '#2563eb'
    },
    approved: {
        marginTop: 15,
        color: 'green',
        fontWeight: '700'
    }
});