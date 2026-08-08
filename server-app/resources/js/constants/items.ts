import { NavItemDrop } from '@/types';
import { BellRing, Boxes, BriefcaseMedical, Cog, Pencil, Trash2, Undo2, ClipboardCheck, SendHorizontal, Coins, HandCoins } from 'lucide-react';

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
        title: 'Agregar repuestos',
        icon: Boxes
    },
    {
        title: 'Enviar a aprobación de costos',
        icon: Coins,
    },
    {
        title: 'Aprobar costos',
        icon: HandCoins,
    },
    {
        title: 'Enviar reparación final',
        icon: SendHorizontal,
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

