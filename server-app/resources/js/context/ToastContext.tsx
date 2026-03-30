import React, { createContext, useContext } from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';

const defaultOptions: ToastOptions = {
    position: 'bottom-center',
    duration: 4000,
}

interface ToastContextType {
    notify: (message: string, options?: ToastOptions) => void;
    success: (message: string, options?: ToastOptions) => void;
    error: (mesage: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({children}: {children: React.ReactNode}) => {
    const notify = (message: string, options: ToastOptions = {}) => {
        toast(message, { ...defaultOptions, ...options })
    }

    const success = (message: string, options: ToastOptions = {} ) => {
        toast.success(message,  { ...defaultOptions, ...options })
    }

    const error = (message: string, options: ToastOptions = {}) => {
        toast.error(message, { ...defaultOptions, ...options })
    }

    return(
        <ToastContext.Provider value={{ notify, success, error }}>
            {children}
            <Toaster />
        </ToastContext.Provider>
    )
}


export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext)
    if(!context) {
        throw new Error('UseToast must be used within a ToastProvider')
    }
    return context;
}
