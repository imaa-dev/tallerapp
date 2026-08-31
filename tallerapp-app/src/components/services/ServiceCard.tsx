import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appUrl } from "@/config/env";
import { ServiceRecord } from "@/types/servi/servi.type";
import { Colors } from "@/constants/theme";
import { ServiceActions } from "@/components/services/ServiceActions";
import { useModal } from "@/context/ModalContextForm";
import {
  DiagnosisForm,
  SparePartsApprovalForm,
  CostApprovalForm,
  RepairForm,
  DeliveredForm,
} from "@/components/services/ServiceForms";

interface Props {
  service: ServiceRecord;
  statusColor?: string;
  statusLabel?: string;
}

export function ServiceCard({
  service,
  statusColor = "#3B82F6",
  statusLabel = "Servicio",
}: Props) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const [isExpanded, setIsExpanded] = useState(false);
  const { openModal } = useModal();

  const image = service.file?.[0]?.path
    ? `${appUrl}/storage/${service.file[0].path}`
    : `${appUrl}/images/image.png`;

  const formattedDate = new Date(service.date_entry).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = () => {};

  const handleAction = (action: string) => {
    switch (action) {
      case "diagnosis":
        openModal(<DiagnosisForm service={service} />);
        break;
      case "spare-parts":
        openModal(<SparePartsApprovalForm service={service} />);
        break;
      case "cost":
        openModal(<CostApprovalForm service={service} />);
        break;
      case "repair":
        openModal(<RepairForm service={service} />);
        break;
      case "delivered":
        openModal(<DeliveredForm service={service} />);
        break;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={[styles.content, { borderTopColor: colors.border }]}>
        <View style={styles.headerSection}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.serviceId, { color: colors.text }]}>
              Servicio #{service.id}
            </Text>
            <Text style={[styles.productName, { color: colors.subtitle }]}>
              {service.product?.name ?? "Sin producto"}
            </Text>
          </View>
          <ServiceActions service={service} handleDelete={handleDelete} onAction={handleAction} />
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <View style={styles.infoBlock}>
            <Ionicons name="person" size={18} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.subtitle }]}>Cliente</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {service.client?.name ?? "Sin cliente"}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoBlock}>
            <Ionicons name="calendar" size={18} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.subtitle }]}>Entrada</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.reasonSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Motivo de ingreso</Text>
          {service.service_issues && service.service_issues.length > 0 ? (
            <View>
              {service.service_issues
                .slice(0, isExpanded ? service.service_issues.length : 1)
                .map((issue) => (
                  <Text key={issue.id} style={[styles.reasonText, { color: colors.subtitle }]}>
                    {"\u2022"} {issue.issue}
                  </Text>
                ))}
              {service.service_issues.length > 1 && !isExpanded && (
                <Text style={[styles.moreText, { color: colors.primary }]}>
                  +{service.service_issues.length - 1} mas
                </Text>
              )}
            </View>
          ) : (
            <Text style={[styles.noDataText, { color: colors.subtitle }]}>Sin especificar</Text>
          )}
        </View>

        {isExpanded && (
          <View style={[styles.detailsSection, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Detalles del producto</Text>
            {service.product?.brand && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Marca:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{service.product.brand}</Text>
              </View>
            )}
            {service.product?.model && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Modelo:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{service.product.model}</Text>
              </View>
            )}
            {service.client?.phone && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Telefono:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{service.client.phone}</Text>
              </View>
            )}
            {service.client?.email && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Email:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{service.client.email}</Text>
              </View>
            )}
          </View>
        )}

        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
          style={[styles.expandButton, { borderTopColor: colors.border }]}
        >
          <Text style={[styles.expandButtonText, { color: colors.primary }]}>
            {isExpanded ? "Ver menos" : "Ver detalles"}
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
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    position: "relative",
    backgroundColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: 200,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    borderTopWidth: 1,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  serviceId: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  infoBlock: {
    flex: 1,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
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
    fontWeight: "700",
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  moreText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  noDataText: {
    fontSize: 13,
    fontStyle: "italic",
  },
  detailsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 12,
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  expandButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  expandButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
