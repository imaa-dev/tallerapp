import { Button } from '@/components/ui/button';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { Reasons } from '@/types';
import { useConfirmDialog } from '@/context/ModalContext';

interface Props {
    reason: string;
    reasons: Reasons[];
    onReasonChange: (value: string) => void;
    onAddReason: () => void;
    onDeleteReason: (id: number) => void;
}

export default function ServiceDetailsForm({
    reason,
    reasons,
    onReasonChange,
    onAddReason,
    onDeleteReason
}: Props) {
    const { showConfirm } = useConfirmDialog();

    const handleDelete = (reasonId: number) => {
        showConfirm({
            title: "Deseas eliminar el detalle de ingreso",
            onConfirm: () => onDeleteReason(reasonId)
        })
    }
    return (
        <>
            <SidebarGroupLabel>Detalles del ingreso</SidebarGroupLabel>
            <div className="group relative z-0 mb-5 w-full">
                <input
                    type="text"
                    name="reason"
                    id="reason"
                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                    value={reason}
                    onChange={(e) => onReasonChange(e.target.value)}
                />
                <label
                    htmlFor="reason"
                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
                >
                    Agregar detalle ingreso de servicio
                </label>
            </div>
            <Button
                type="button"
                onClick={onAddReason}
                className="mt-4 w-full"
            >
                <Plus /> Agregar Detalle
            </Button>

            {reasons.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">Detalles agregados:</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-800 dark:text-white space-y-1">
                        {reasons.map((item) => (
                            <li key={item.id} className="flex justify-between items-center">
                                {item.reason_note}
                                <button
                                    type="button"
                                    className="text-red-500 text-xs ml-2"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}
