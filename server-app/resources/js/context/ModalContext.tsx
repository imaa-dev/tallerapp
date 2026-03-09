import { createContext, useContext, useState, ReactNode } from "react";
import { createPortal } from 'react-dom';

interface ConfirmDialogOptions {
  title: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmDialogContextType {
  showConfirm: (options: ConfirmDialogOptions) => void;
  hideConfirm: () => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

  export const useConfirmDialog = () => {
    const ctx = useContext(ConfirmDialogContext);
    if (!ctx) throw new Error("useConfirmDialog must be used inside ConfirmDialogProvider");
    return ctx;
  };

  export const ConfirmDialogProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);

    const showConfirm = (opts: ConfirmDialogOptions) => {
      setOptions(opts);
      setIsOpen(true);
    };

    const hideConfirm = () => {
      setIsOpen(false);
      setOptions(null);
    };

    return (
      <ConfirmDialogContext.Provider value={{ showConfirm, hideConfirm }}>
        {children}
        {isOpen && options && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-4 text-lg text-gray-800 dark:text-white">{options.title}</h3>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    options.onConfirm();
                    hideConfirm();
                  }}
                  className="rounded-md border border-red-700 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white"
                >
                  {options.confirmText || "Sí, eliminar"}
                </button>
                <button
                  onClick={hideConfirm}
                  className="rounded-md border border-gray-800 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-800 hover:text-white dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {options.cancelText || "Cancelar"}
                </button>
              </div>
            </div>
          </div>, document.body
        )}
      </ConfirmDialogContext.Provider>
    );
  };
  
