import React from "react";

export default function AskOrganizacion(){
    return (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <h2 className="text-lg font-semibold text-yellow-800">
                Advertencia
            </h2>

            <p className="mt-2 text-sm text-yellow-700">
                No pueden existir todas las organizaciones inactivas. 
                Debe mantener al menos una organización activa para continuar.
            </p>
        </div>
    )
}