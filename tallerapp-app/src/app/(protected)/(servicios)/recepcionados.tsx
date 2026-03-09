import { View, Text, StyleSheet } from "react-native";

export default function ThirdScreen(){
    return(
        <View style={styles.container} >
            <Text style={styles.text} > Servicio RECEPCIONADO </Text>
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