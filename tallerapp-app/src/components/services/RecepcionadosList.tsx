import React, { useState } from 'react';
import {
    FlatList,
    View,
    StyleSheet,
} from 'react-native';
import { ServiceRecord } from "@/types/servi/servi.type";
import { RecepcionadosCard } from "@/components/services/RecepcionadosCard";

interface Props {
    services: ServiceRecord[];
}

export default function RecepcionadosList({ services }: Props) {
    const [serviceShow, setServiceShow] = useState(services);

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
                renderItem={({ item }) => (
                    <RecepcionadosCard
                        service={item}
                        handleDelete={() =>
                            handleDelete(item.id)
                        }
                    />
                )}
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
        paddingBottom: 24,
    }
});
