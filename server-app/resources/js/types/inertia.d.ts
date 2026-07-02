import { ListSparePartsData } from '@/types';

declare module '@inertiajs/core' {
    interface PageProps {
        spare_parts: ListSparePartsData[];
    }
}