import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from 'react';
import { ModalView } from '@/components/ModalView';

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

      {stack.map((content, index) => (
        <ModalView
          key={index}
          visible={true}
          onClose={closeModal}
          zIndex={1000 + index}
        >
          {content}
        </ModalView>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be inside ModalProvider');
  }

  return context;
};
