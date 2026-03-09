import { Undo2 } from 'lucide-react';

const ButtonBack = () => {

    return (
        <div className="relative p-5">
            <button type="button" className="flex" onClick={() =>  window.history.back()}  >
                <Undo2 />
            </button>
        </div>
    )
}

export default ButtonBack;
