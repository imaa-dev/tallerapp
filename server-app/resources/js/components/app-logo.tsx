import AppLogoIcon from './app-logo-icon';
import { OrganizationData } from '@/types';
interface OrganizationEditFormProps {
    organization?: OrganizationData;
}
export default function AppLogo({ organization }: OrganizationEditFormProps) {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon organization={organization}  />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                {organization ? <span className="mb-0.5 truncate leading-none font-semibold">{organization.name}</span>
                    :
                    <span className="mb-0.5 truncate leading-none font-semibold">Crear Organizacion</span>
                }
            </div>
        </>
    );
}
