import { router } from '@inertiajs/react';
import { ButtonItem } from '@/types';


interface itemsProps {
    items: ButtonItem[];
}
const ButtonTop = ({ items }: itemsProps) => {
    return (
        <>
            <div className="inline-flex rounded-md shadow-xs">
                {items.length > 0 &&
                    items.map((item: ButtonItem, index: number) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => router.visit(item.href)}
                            className="me-2 mb-2 rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:ring-4 focus:ring-gray-300 focus:outline-none dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
                        >
                            {item.title}
                        </button>
                    ))}
            </div>
        </>
    );
};
export default ButtonTop;
