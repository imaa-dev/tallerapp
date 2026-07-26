import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Pressable,
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appUrl, API_URL } from '@/config/env';
import { ServiceRecord } from "@/types/servi/servi.type";
import { Colors } from '@/constants/theme';
import { ActionBottomSheet, ServiceActions } from "@/components/services/ServiceActions";

interface Props {
    service: ServiceRecord;
    handleDelete: () => void;
}

export function RecepcionadosCard({
    service,
    handleDelete
}: Props) {
    const scheme = useColorScheme() ?? "dark";
    const colors = Colors[scheme];
    const [isExpanded, setIsExpanded] = useState(false);

    const image = service.file?.[0]?.path
        ? `${appUrl}/storage/${service.file[0].path}`
        : `${appUrl}/images/image.png`;
    const formattedDate = new Date(service.date_entry).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    return (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                />
                <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
                    <Ionicons name="checkmark-circle" size={16} color="#fff" />
                    <Text style={styles.statusText}>Recibido</Text>
                </View>
            </View>

            <View style={[styles.content, { borderTopColor: colors.border }]}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.serviceId, { color: colors.text }]}>
                            Servicio #{service.id}
                        </Text>
                        <Text style={[styles.productName, { color: colors.subtitle }]}>
                            {service.product.name}
                        </Text>
                    </View>
                    <View>
                        <ServiceActions
                            service={service}
                            handleDelete={handleDelete}
                        />
                    </View>
                </View>

                {/* Key Info Row */}
                <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                    <View style={styles.infoBlock}>
                        <Ionicons name="person" size={18} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.subtitle }]}>
                            Cliente
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {service.client.name}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.infoBlock}>
                        <Ionicons name="calendar" size={18} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.subtitle }]}>
                            Entrada
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {formattedDate}
                        </Text>
                    </View>
                </View>

                {/* Reason Section */}
                <View style={styles.reasonSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Motivo de ingreso
                    </Text>
                    {service.reasons && service.reasons.length > 0 ? (
                        <View>
                            {service.reasons.slice(0, isExpanded ? service.reasons.length : 1).map(reason => (
                                <Text
                                    key={reason.id}
                                    style={[styles.reasonText, { color: colors.subtitle }]}
                                >
                                    • {reason.reason_note}
                                </Text>
                            ))}
                            {service.reasons.length > 1 && !isExpanded && (
                                <Text style={[styles.moreText, { color: colors.primary }]}>
                                    +{service.reasons.length - 1} más
                                </Text>
                            )}
                        </View>
                    ) : (
                        <Text style={[styles.noDataText, { color: colors.subtitle }]}>
                            Sin especificar
                        </Text>
                    )}
                </View>

                {/* Product Details - Expandable */}
                {isExpanded && (
                    <View style={[styles.detailsSection, { borderTopColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Detalles del producto
                        </Text>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>
                                Marca:
                            </Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>
                                {service.product.brand}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>
                                Modelo:
                            </Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>
                                {service.product.model}
                            </Text>
                        </View>
                        {service.client.phone && (
                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: colors.subtitle }]}>
                                    Teléfono:
                                </Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>
                                    {service.client.phone}
                                </Text>
                            </View>
                        )}
                        {service.client.email && (
                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: colors.subtitle }]}>
                                    Email:
                                </Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>
                                    {service.client.email}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Expand/Collapse Button */}
                <Pressable
                    onPress={() => setIsExpanded(!isExpanded)}
                    style={[styles.expandButton, { borderTopColor: colors.border }]}
                >
                    <Text style={[styles.expandButtonText, { color: colors.primary }]}>
                        {isExpanded ? 'Ver menos' : 'Ver detalles'}
                    </Text>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={colors.primary}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: '#e5e7eb',
    },
    image: {
        width: '100%',
        height: 200,
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 16,
        borderTopWidth: 1,
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    serviceId: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        marginBottom: 12,
    },
    infoBlock: {
        flex: 1,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 2,
    },
    divider: {
        width: 1,
        marginHorizontal: 12,
    },
    reasonSection: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
    },
    reasonText: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 4,
    },
    moreText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
    },
    noDataText: {
        fontSize: 13,
        fontStyle: 'italic',
    },
    detailsSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 12,
        flex: 1,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    expandButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 8,
        borderTopWidth: 1,
        gap: 8,
    },
    expandButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
