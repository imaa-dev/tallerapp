import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ModalWrapper } from '@/components/ModalWrapper';

type ModalContextType = {
    openModal: (render: () => ReactNode) => void;
    closeModal: () => void;
};

const ModalContextForm = createContext<ModalContextType | undefined>(undefined);

export function ModalFormProvider({ children }: { children: ReactNode }) {
    const [modalStack, setModalStack] = useState<(() => ReactNode)[]>([])

    const openModal = (renderFn: () => ReactNode) => {
        setModalStack((prev) => [...prev, renderFn]);
    };

    const closeModal = () => {
        setModalStack((prev) => prev.slice(0, -1));
    };

    return (
        <ModalContextForm.Provider value={{ openModal, closeModal }}>
            {children}

            {modalStack.map((renderFn, index) => (
                <ModalWrapper key={index} onClose={closeModal}>
                    {renderFn()}
                </ModalWrapper>
            ))}
        </ModalContextForm.Provider>
    );
}

export function useModal() {
    const ctx = useContext(ModalContextForm);
    if (!ctx) throw new Error("useModal must be inside ModalProvider");
    return ctx;
}
