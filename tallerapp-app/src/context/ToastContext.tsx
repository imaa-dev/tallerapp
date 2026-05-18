import { createContext, useContext } from "react";
import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

interface ToastContextProps {
  showToast: (
    type: ToastType,
    title: string,
    message?: string
  ) => void;
}

const ToastContext = createContext<ToastContextProps | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const showToast = (
    type: ToastType,
    title: string,
    message?: string
  ) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}