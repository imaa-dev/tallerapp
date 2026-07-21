import React, { useState } from 'react';
import {
    FlatList,
    View,
    StyleSheet,
} from 'react-native';
import {ServiceRecord} from "@/types/servi/servi.type";
import {ServiceCard} from "@/components/services/ServiceCard";

interface Props {
    services: ServiceRecord[];
}

export default function ServiceList({ services }: Props) {
    const [serviceShow, setServiceShow] = useState(services);

    const handleDelete = (id:number) => {
        // aquí después conectamos React Query mutation
        setServiceShow(prev =>
            prev.filter(service => service.id !== id)
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={serviceShow}
                keyExtractor={(item)=> item.id.toString()}
                renderItem={({item})=>(
                    <ServiceCard
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

    container:{
        flex:1,
        padding:16
    }

});