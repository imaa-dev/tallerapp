import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import { useLoading } from '@/context/LoadingContext';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { finalRepairLink } from '@/api/services/serviService';

export function ToFinalRepairForm({ serviceId }: { serviceId: number }) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const [notificateWhatsapp, setNotificateWhatsapp] = useState(true);
    const [link, setLink] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) {
            return;
        }
        setSubmitting(true);
        showLoading();
        try {
            const response = await finalRepairLink(serviceId, notificateWhatsapp);
            success(response.message);
            closeModal();
            if (response.whatsapp_url) {
                window.location.href = response.whatsapp_url;
                return;
            }
            if (response.link) {
                setLink(response.link);
            } else {
                router.visit('/service');
            }
        } catch (err: any) {
            if (!err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            error(err.response.data?.message ?? 'Ha ocurrido un error.');
        } finally {
            setSubmitting(false);
            hideLoading();
        }
    };

    return (
        <React.Fragment>
            <form onSubmit={submit} className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800">
                <SidebarGroupLabel> Enviar reparación final </SidebarGroupLabel>
                <div className="flex w-full items-center">
                    <input
                        type="checkbox"
                        name="isNotificableWhatsapp"
                        id="isNotificableWhatsapp"
                        className="h-4 w-4 rounded border-gray-300 bg-transparent text-green-600 focus:ring-green-600 dark:border-gray-600 dark:focus:ring-green-500"
                        checked={notificateWhatsapp}
                        onChange={(e) => setNotificateWhatsapp(e.target.checked)}
                        tabIndex={1}
                    />

                    <label htmlFor="isNotificableWhatsapp" className="ml-2 text-sm text-gray-900 select-none dark:text-white">
                        Enviar enlace de reparación final al whatsapp del cliente
                    </label>
                </div>
                <Button type="submit" className="mt-4 w-full" tabIndex={2} disabled={submitting}>
                    Obtener enlace de reparación final
                </Button>
                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-center text-sm text-blue-600 underline dark:text-blue-400"
                    >
                        {link}
                    </a>
                )}
            </form>
        </React.Fragment>
    );
}
