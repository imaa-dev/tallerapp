import { ListSparePartsData } from '@/types';

declare module '@inertiajs/core' {
    interface PageProps {
        spare_parts: ListSparePartsData[];
    }
}
export interface AppPageProps {
    auth?: {
        user?: any;
    };

    flash?: {
        message?: string;
        error?: string;
        status?: string;
    };

    organization?: any;
    products?: any;
    clients?: any;
    spare_parts?: any;
}