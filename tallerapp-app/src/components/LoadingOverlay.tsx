import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useLoading } from "@/context/LoadingContext";

export default function LoadingOverlay() {
  const { loading } = useLoading();

  return (
    <Modal
      transparent
      visible={loading}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});