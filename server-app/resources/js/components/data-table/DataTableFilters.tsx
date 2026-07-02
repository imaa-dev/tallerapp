import React from "react";

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterField {
    key: string;
    label: string;
    type?: "text" | "date" | "select";
    placeholder?: string;
    options?: FilterOption[];
}

interface DataTableFiltersProps {
    fields: FilterField[];
    values: Record<string, any>;
    onChange: (field: string, value: any) => void;
    onSearch: () => void;
    onClear: () => void;
    actions?: React.ReactNode;
}

export default function DataTableFilters({
    fields,
    values,
    onChange,
    onSearch,
    onClear,
    actions
}: DataTableFiltersProps) {

    const renderField = (field: FilterField) => {

        switch (field.type) {

            case "date":

                return (
                    <div key={field.key} className="group relative w-full">
                        <label
                            htmlFor={field.key}
                            className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                            {field.label}
                        </label>

                        <input
                            id={field.key}
                            type="date"
                            value={values[field.key] ?? ""}
                            onChange={(e) =>
                                onChange(field.key, e.target.value)
                            }
                            className="block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white"
                        />
                    </div>
                );

            case "select":

                return (
                    <div key={field.key}>
                        <label
                            htmlFor={field.key}
                            className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                            {field.label}
                        </label>

                        <select
                            id={field.key}
                            value={values[field.key] ?? ""}
                            onChange={(e) =>
                                onChange(field.key, e.target.value)
                            }
                            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                        >
                            <option value="">
                                Todos
                            </option>

                            {field.options?.map(option => (

                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>

                            ))}

                        </select>
                    </div>
                );

            default:

                return (
                    <div
                        key={field.key}
                        className="group relative z-0 w-full"
                    >

                        <input
                            id={field.key}
                            type="text"
                            placeholder=" "
                            value={values[field.key] ?? ""}
                            onChange={(e) =>
                                onChange(field.key, e.target.value)
                            }
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white"
                        />

                        <label
                            htmlFor={field.key}
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
                        >
                            {field.placeholder ?? field.label}
                        </label>

                    </div>
                );
        }

    }

    return (

        <div className="mb-6 rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-900">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

                <h2 className="text-lg font-semibold">
                    Filtros
                </h2>

                {actions}

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {fields.map(renderField)}

            </div>

            <div className="mt-8 flex flex-wrap items-center justify-end gap-4">

                <button
                    type="button"
                    onClick={onSearch}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                    Buscar
                </button>

                <button
                    type="button"
                    onClick={onClear}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                    Limpiar filtros
                </button>

            </div>

        </div>

    );

}