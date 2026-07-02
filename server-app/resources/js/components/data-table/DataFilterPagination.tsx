import React from "react";

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface DataFilterPaginationProps {
    pagination: PaginationData;
    onPageChange: (page: number) => void;
}

export default function DataFilterPagination({
    pagination,
    onPageChange,
}: DataFilterPaginationProps) {

    if (!pagination || pagination.last_page <= 1) {
        return null;
    }

    const {
        current_page,
        last_page,
        total,
        from,
        to,
    } = pagination;

    const pages = [];

    // Mostrar máximo 5 páginas alrededor de la actual
    const start = Math.max(1, current_page - 2);
    const end = Math.min(last_page, current_page + 2);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="mt-6 flex flex-col items-center gap-4">

            <div className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando {from} - {to} de {total} registros
            </div>

            <div className="flex flex-wrap items-center gap-2">

                <button
                    type="button"
                    disabled={current_page === 1}
                    onClick={() => onPageChange(current_page - 1)}
                    className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    Anterior
                </button>

                {start > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => onPageChange(1)}
                            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            1
                        </button>

                        {start > 2 && (
                            <span className="px-2 text-gray-500">
                                ...
                            </span>
                        )}
                    </>
                )}

                {pages.map(page => (

                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`rounded-lg px-3 py-2 text-sm transition ${
                            page === current_page
                                ? "bg-blue-600 text-white"
                                : "border hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        {page}
                    </button>

                ))}

                {end < last_page && (
                    <>
                        {end < last_page - 1 && (
                            <span className="px-2 text-gray-500">
                                ...
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={() => onPageChange(last_page)}
                            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {last_page}
                        </button>
                    </>
                )}

                <button
                    type="button"
                    disabled={current_page === last_page}
                    onClick={() => onPageChange(current_page + 1)}
                    className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    Siguiente
                </button>

            </div>

        </div>
    );
}