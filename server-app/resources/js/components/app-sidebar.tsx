import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Building2,
    Handshake,
    Box,
    SquareUser
} from 'lucide-react';
import AppLogo from './app-logo';
import { OrganizationData } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Organización',
        href: '/organization/show',
        icon: Building2,
    },
    {
        title: 'Servicios',
        href: '/service',
        icon: Handshake,
    },
    {
        title: 'Productos',
        href: '/product',
        icon: Box,
    },
    {
        title: 'Clientes',
        href: '/users',
        icon: SquareUser,
    },
];

const footerNavItems: NavItem[] = [
//    {
//        title: 'Repository',
//        href: 'https://github.com/laravel/react-starter-kit',
//        icon: Folder,
//    },
//    {
//        title: 'Documentation',
//        href: 'https://laravel.com/docs/starter-kits#react',
//        icon: BookOpen,
//    },
];

export interface PageProps {
    organization?: OrganizationData;
    [key: string]: unknown;
}
export function AppSidebar() {
    const { organization } = usePage<PageProps>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={organization ? '/dashboard' : '/create/organization'} prefetch>
                                <AppLogo organization={organization} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
