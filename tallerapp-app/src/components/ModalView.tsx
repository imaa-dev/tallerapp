import { Modal, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ModalView = ({
  visible,
  children,
  onClose,
}: any) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <Pressable
          onPress={onClose}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
          }}
        >
          <Pressable
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 15,
              right: 15,
              zIndex: 10,
            }}
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