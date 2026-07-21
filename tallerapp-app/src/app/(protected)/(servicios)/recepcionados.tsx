import {View, Text, StyleSheet, ActivityIndicator} from "react-native";
import {useGetServices} from "@/hooks/useGetServices";
import ServiceList from "@/components/services/ServiceList";
export default function ThirdScreen(){
    const serviceQuery = useGetServices();
    const services = serviceQuery.data ?? [];
    console.log("RECEPCIONADOS")
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
           <ServiceList services={services} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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