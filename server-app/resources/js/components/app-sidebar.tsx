import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { User, type NavItem } from '@/types';
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
        roles: ['ADMIN'],
    },
    {
        title: 'Organización',
        href: '/organization/show',
        icon: Building2,
        roles: ['ADMIN'],
    },
    {
        title: 'Servicios',
        href: '/service',
        icon: Handshake,
        roles: ['TECHNICIAN', 'ADMIN'],
    },
    {
        title: 'Productos',
        href: '/product',
        icon: Box,
        roles: ['TECHNICIAN', 'ADMIN'],
    },
    {
        title: 'Clientes',
        href: '/clients',
        icon: SquareUser,
        roles: ['TECHNICIAN'],
    },
    {
        title: 'Usuarios',
        href: '/users',
        icon: SquareUser,
        roles: ['ADMIN'],
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

export interface PagePropsOrganization {
    organization?: OrganizationData;
    [key: string]: unknown;
}

export function AppSidebar() {
    const { organization } = usePage<PagePropsOrganization>().props;
    const page = usePage();
    const role = page.props.auth.user.rol;

    const filteredNavItems = mainNavItems.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(role);
    });
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
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
