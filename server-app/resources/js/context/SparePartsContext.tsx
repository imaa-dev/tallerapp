import { createContext, useContext, useEffect, useState } from "react";
import { ListSparePartsData } from '@/types';
import { router } from "@inertiajs/react";
interface SparePartsContextType {
    spareParts: ListSparePartsData[];
    addSparePart: (item: ListSparePartsData) => void;
    setSpareParts: React.Dispatch<React.SetStateAction<ListSparePartsData[]>>;
}

const SparePartsContext = createContext<SparePartsContextType | null>(null);

export function SparePartsProvider({ children, initialParts = [] }: { children: React.ReactNode; initialParts?: ListSparePartsData[] }) {
    const [spareParts, setSpareParts] = useState<ListSparePartsData[]>(initialParts);
    
    const addSparePart = (item: ListSparePartsData) => setSpareParts((prev) => [...prev, item]);

    return <SparePartsContext.Provider value={{ spareParts, setSpareParts, addSparePart }}>{children}</SparePartsContext.Provider>;
}

export function useSpareParts(): SparePartsContextType {
    const context = useContext(SparePartsContext);

    if (!context) {
        throw new Error('useSpareParts must be used within a SparePartsProvider');
    }

    return context;
}
