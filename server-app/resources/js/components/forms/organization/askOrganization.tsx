import React from "react";

export default function AskOrganizacion(){
    return (
        <div
            className="text-fg-warning rounded-base bg-warning-soft border-warning-subtle mb-4 flex items-start border p-4 text-sm sm:items-center"
            role="alert"
        >
            <svg
                className="me-2 mt-0.5 h-4 w-4 shrink-0 sm:mt-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
            <p>
                <span className="me-1 font-medium">Advertencia!</span> Su organización esta inactiva, elija un plan de subscripción para continuar.
            </p>
        </div>
    );
}
