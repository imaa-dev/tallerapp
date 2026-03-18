import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}
export interface BreadcrumbItem {
    title: string | JSX.Element;
    href: string;
}
export interface ButtonItem {
    title: string;
    href: string;
}
export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles: Array | null;
    handleDelete?: () => void;
}
export interface NavItemDrop {
    title: string;
    icon: LucideIcon;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}
export interface User {
    id: number;
    created_by_organization_id?: number;
    name: string;
    email: string;
    phone: string;
    rol: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    file?: FileMeta | null;
    [key: string]: unknown; // This allows for additional properties...
}
export interface FileMeta {
    id: number;
    fileable_id: number;
    fileable_type: string;
    path: string | null;
    created_at: string;
    updated_at: string;
}
export interface OrganizationData {
    id: number;
    user_id: number;
    file: FileMeta | null;
    name: string;
    description: string;
    active: number;
    phone: string;
    address: string;
    email: string;
    city: string;
    state: string;
    postal_code: string;
    website: string;
    created_at: string;
    updated_at: string;
}
export interface ProductData {
    id: number;
    brand: string,
    model: string,
    name: string
}
export interface Client{
    id: number;
    name: string;
    email: string;
    phone: string;
}
export interface Technician{
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
}
export interface Page {
    props: {
        organization: {
            id: number,
        }
    };
}
export interface DiagnosisPage {
    props: {
        products: ProductData;
        clients: User;
    }
}
export interface ClientDataProp {
    clients: Client[];
}
export interface ProductDataProp {
    products: ProductData[];
}
export interface ServiDataForm {
    organization_id: number;
    product_id: number;
    user_id: number;
    status_id: number;
    date_entry: string;
    file: File[] | null;
    reason_notes: { reason_note: string }[];
}
interface DiagnosisData {
    servi_id: number;
    diagnosis: string;
    repairTime: string;
    cost: number;
}
export interface Reasons{
    id: number;
    servi_id: number;
    reason_note: string;
    created_at: string;
    updated_at: string;
}
export interface Status {
    id: number;
    name: string;
}
export interface ServiData {
    id: number;
    uuid: string;
    user_id: number;
    product_id: number;
    organization_id: number;
    status_id: number;
    date_entry: string;
    date_exit: string;
    satisfied: number;
    reasons: Reasons[];
    file: FileMeta[];
    product: ProductData;
    client: Client;
    diagnosis: DiagnosisData[];
    created_at: Date;
    updated_at: Date;
}

export interface SparePartsData {
    service_id: number | null;
    model: string;
    brand: string;
    price: number;
    note: string;
}

export interface ListSparePartsData{
    id: number;
    service_id: number;
    user_id: number
    model: string;
    brand: string;
    price: number;
    note: string;
}

export interface ServiForm {
    id: number;
    organization_id: number;
    product_id: number;
    user_id: number;
    date_entry: string;
}

export interface FileResponse {
    code: number;
    message: string;
    success: boolean;
    files: FileMeta[];
}
export interface ReasonResponse {
    code: number;
    message: string;
    success: boolean;
    data: Reasons[];
}

