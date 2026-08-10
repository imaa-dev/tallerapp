import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ButtonAddProps {
    title: string;
    route: string;
}

const ButtonAdd = ({ route, title }: ButtonAddProps) => {
    return (
        <Button type="button" size="sm" onClick={() => router.visit(route)}>
            <Plus className="mr-2 h-4 w-4" />
            {title}
        </Button>
    );
};

export default ButtonAdd;
