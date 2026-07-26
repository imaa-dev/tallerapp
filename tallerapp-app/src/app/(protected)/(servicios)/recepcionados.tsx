import {View, Text, StyleSheet, ActivityIndicator} from "react-native";
import {useGetServices} from "@/hooks/useGetServices";
import RecepcionadosList from "@/components/services/RecepcionadosList";
export default function RecepcionadosScreen(){
    const serviceQuery = useGetServices();
    const services = serviceQuery.data ?? [];

    if(serviceQuery.isLoading){
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }
    if(serviceQuery.isError){
        return (
            <View style={styles.center}>
                <Text>
                    Error cargando servicios
                </Text>
            </View>
        );
    }
    return(
        <View style={styles.container} >
           <RecepcionadosList services={services} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    text: {
        textAlign: "center"
    },
    center:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
