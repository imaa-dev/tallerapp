import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { ModalView } from '@/components/ModalView';

type ModalContextType = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = (modalContent: ReactNode) => {
    setContent(modalContent);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {children}

      <ModalView visible={visible} onClose={closeModal} >
        {content}
      </ModalView>
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