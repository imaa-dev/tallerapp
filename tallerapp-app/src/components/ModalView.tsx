import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ModalView = ({
  visible,
  children,
  onClose,
  zIndex = 10,
}: {
  visible: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
  zIndex?: number;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View
        style={[
          styles.backdrop,
          {
            zIndex,
          },
        ]}
      >
        <Pressable
          onPress={onClose}
          style={styles.backdropPressable}
        />

        <View style={styles.card}>
          <Pressable
            onPress={onClose}
            style={styles.closeButton}
          >
            <Ionicons
              name="close"
              size={26}
              color="black"
            />
          </Pressable>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  backdropPressable: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
});