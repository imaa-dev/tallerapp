import React, {createContext, useState, useContext, ReactNode} from 'react';

interface LoadingContextType {
    loading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
}
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
export const LoadingProvider = ({children}: {children: ReactNode}) => {
    const [loading, setLoading] = useState(false);
    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);
    return (
        <LoadingContext.Provider value={{loading, showLoading, hideLoading}}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}
