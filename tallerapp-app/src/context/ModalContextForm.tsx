import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/theme';

type ModalContextType = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  closeAllModals: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];
  const [stack, setStack] = useState<ReactNode[]>([]);

  const openModal = useCallback((modalContent: ReactNode) => {
    setStack((prev) => [...prev, modalContent]);
  }, []);

  const closeModal = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const closeAllModals = useCallback(() => {
    setStack([]);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        closeAllModals,
      }}
    >
      {children}

      {stack.length > 0 && (
        <Modal
          transparent
          visible
          animationType="fade"
          onRequestClose={closeModal}
        >
          {stack.map((content, index) => {
            const isTop = index === stack.length - 1;
            return (
              <View
                key={index}
                pointerEvents={isTop ? "auto" : "none"}
                style={StyleSheet.absoluteFill}
              >
                <Pressable
                  style={styles.backdrop}
                  onPress={isTop ? closeModal : undefined}
                />
                <View style={styles.cardContainer}>
                  <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    {content}
                  </View>
                </View>
              </View>
            );
          })}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
  },
});

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be inside ModalProvider');
  }

  return context;
};