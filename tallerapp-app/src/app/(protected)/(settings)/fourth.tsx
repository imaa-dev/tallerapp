import { AuthContext } from "@/context/authContext";
import { useContext } from "react";
import { View, Text, StyleSheet,Button } from "react-native";

export default function FourthScreen(){

    const authContext = useContext(AuthContext)
    const handlelogout = async () => {
        const response = await authContext.logout();
    }
    return(
        <View style={styles.container} >
            <Text style={styles.text} > LogOut </Text>
            <Button title="LogOut" onPress={() => handlelogout()} />
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