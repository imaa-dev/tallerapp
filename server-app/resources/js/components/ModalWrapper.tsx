import React from 'react';
import ReactDOM from 'react-dom';

export function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
             <button className="close-btn" onClick={onClose}>×</button>
                {children}
            </div>
        </div>,
        document.body
    );
}
