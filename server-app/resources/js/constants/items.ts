import { NavItemDrop } from '@/types';
import { BellRing, Boxes, BriefcaseMedical, Cog, Pencil, Trash2, Undo2, ClipboardCheck } from 'lucide-react';

export const mainNavItems: NavItemDrop[] = [
    {
        title: 'Editar',
        icon: Pencil,
    },
    {
        title: 'Eliminar',
        icon: Trash2,
    },
    {
        title: 'Reparar',
        icon: Cog,
    },
    {
        title: 'A Taller',
        icon: BellRing,
    },
    {
        title: 'Diagnosticar',
        icon: BriefcaseMedical,
    },
    {
        title: 'Aprobar repuestos',
        icon: Boxes
    },
    {
        title: 'Continuar sin repuestos',
        icon: Boxes,
    },
    {
        title: 'Entregar servicio',
        icon: ClipboardCheck
    },
    {
        title: 'Regresar',
        icon: Undo2,
    },
];

