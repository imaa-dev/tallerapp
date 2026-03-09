import { router } from '@inertiajs/react';
import { CirclePlus } from 'lucide-react';

interface ButtonAddProps {
    title: string;
    route: string;
}

const ButtonAdd = ({ route, title }: ButtonAddProps) => {
    return (
        <div className="relative p-5">
            <button type="button" className="flex" onClick={() => router.visit(route)}>
                <CirclePlus />
                {title}
            </button>
        </div>
    );
};

export default ButtonAdd;
