import React from "react";
import { router } from '@inertiajs/react';
import { useModal } from '@/context/ModalContextForm';

export const AskContent = () =>  {
    const { closeModal } = useModal();
    return (
        <React.Fragment>
            <div className="fixed top-0 right-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50">
                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-700">
                    <h3 className="mb-4 text-lg text-gray-800 dark:text-gray-200">
                        Notamos que no tienes una organización o no esta activa, ¿deseas crear una o activarla?
                    </h3>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                router.visit('/create/organization');
                                closeModal();
                            }}
                            className="me-2 mb-2 rounded-lg border border-green-700 px-5 py-2.5 text-center text-sm font-medium text-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 focus:outline-none dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800"
                        >
                            Ir a crear organización
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
