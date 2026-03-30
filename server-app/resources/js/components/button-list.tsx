import { router } from '@inertiajs/react';
import { List } from 'lucide-react';
interface ButtonListProps {
    route: string;
    title: string;
}
const ButtonList = ({route, title }: ButtonListProps) => {
    return (
        <div className="relative p-5">
            <button type="button" className="flex" onClick={() => router.visit(route)}>
                <List />
                {title}
            </button>
        </div>
    )
}

export default ButtonList;
