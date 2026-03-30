import { OrganizationData } from '@/types';

const appUrl = import.meta.env.VITE_APP_URL;

interface OrganizationEditFormProps {
    organization?: OrganizationData;
}

export default function AppLogoIcon({organization}: OrganizationEditFormProps ){

    return (
        <>
            {organization?.file?.path ?
                <img src={`${appUrl}/storage/${organization.file?.path}`} alt='Logo' />
                :
                <img src={`${appUrl}/images/LOGO.png`} alt='Logo' />
            }
        </>
    );
}
