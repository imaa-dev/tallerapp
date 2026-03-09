import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { formReducer, initialState, FormAction } from '@/reducer/formReducer';
import { ServiDataForm } from '@/types';

interface FormContextProps {
    state: ServiDataForm;
    dispatch: React.Dispatch<FormAction>;
}

export const FormContext = createContext<FormContextProps>({
    state: initialState,
    dispatch: () => {},
});

interface ProviderProps {
    children: ReactNode;
}

export const FormProvider: React.FC<ProviderProps> = ({ children }) => {
    const getSavedForm = (): ServiDataForm => {
        try {
            const saved = localStorage.getItem('formData');
            return saved ? JSON.parse(saved): initialState;
        } catch {
            return initialState;
        }
    };

    const [ state, dispatch ] = useReducer(formReducer, getSavedForm());
    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(state));
    }, [state]);

    return (
        <FormContext.Provider value={{ state, dispatch }} >
            {children}
        </FormContext.Provider>
    );
}
