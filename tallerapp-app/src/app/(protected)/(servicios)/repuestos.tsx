import { View, Text, StyleSheet } from "react-native";

export default function Repuestos(){
    return(
        <View style={styles.container} >
            <Text style={styles.text} > Servicios en aprovacion de repuestos </Text>
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
    }
})