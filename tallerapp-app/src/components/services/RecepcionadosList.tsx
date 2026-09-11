import React, { useState, useEffect } from 'react';
import {
    FlatList,
    View,
    StyleSheet,
} from 'react-native';
import { ServiceRecord } from "@/types/servi/servi.type";
import { RecepcionadosCard } from "@/components/services/RecepcionadosCard";
import AppEmptyState from "@/components/ui/AppEmptyState";

interface Props {
    services: ServiceRecord[];
}

export default function RecepcionadosList({ services }: Props) {
    const [serviceShow, setServiceShow] = useState(services);

    useEffect(() => {
        setServiceShow(services);
    }, [services]);

    const handleDelete = (id: number) => {
        setServiceShow(prev =>
            prev.filter(service => service.id !== id)
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={serviceShow}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                    <RecepcionadosCard
                        service={item}
                        handleDelete={() =>
                            handleDelete(item.id)
                        }
                    />
                )}
                ListEmptyComponent={
                    <AppEmptyState
                        icon="notifications-outline"
                        title="Sin servicios"
                        description="No hay servicios recepcionados."
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    listContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 104,
    }
});
