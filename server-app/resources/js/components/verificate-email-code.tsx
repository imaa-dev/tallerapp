import React, { FormEventHandler, useEffect, useState } from 'react';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { useLoading } from '@/context/LoadingContext';
import { resendVerifyCodeEmail, sendVerifyCodeEmail } from '@/api/users/usersService';
import InputError from '@/components/input-error';

interface CodeData {
    verification_code: string
}

export default function VerificateEmailCode(){
    const { closeModal } = useModal();
    const { success, error } = useToast();
    const { showLoading, hideLoading } = useLoading();
    const [ checkEmailSend, setCheckEmailSend ] = useState<boolean>(false);
    const [cooldown, setCooldown] = useState(0)
    useEffect(() => {
        if (cooldown <= 0) return

        const timer = setInterval(() => {
          setCooldown(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
      }, [cooldown])

    const { post, data, setData, errors } = useForm<Required<CodeData>>({
        verification_code: ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        showLoading()
        post('/verificate-code/user', {
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                if(message){
                    success(message);
                }
                hideLoading();
                closeModal();
            },
            onError: (errors) => {
                if (errors.code) {
                  error(errors.code)
                } else {
                  error('Error al verificar el código')
                }
                hideLoading()
              },
        })
    }

    const sendEmailVerificationCode = async () => {
        setCheckEmailSend(true);
        showLoading();
        setCooldown(60);
        const response = await sendVerifyCodeEmail();
        hideLoading();

        if(response.message === "Código de verificacion enviado"){
            success(response.message);
        } else {
            error('Ocurrio un error al enviar el código de verificación')
        }
    }

    const resendEmailVerification = async () => {
        showLoading()
        setCooldown(60);
        const response = await resendVerifyCodeEmail();
        if(response.message === "Código de varificacion reenviado"){
            success(response.message);
        } else {
            error('Ocurrio un error al enviar el código de verificación')
        }
        hideLoading();
    }
    return (
        <React.Fragment>
            <form
                onSubmit={submit}
                className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800 overflow-y-auto max-h-[70vh]"
            >
                <SidebarGroupLabel>Verificar correo electrónico</SidebarGroupLabel>
                <div className="group relative z-0 mb-5 w-full" >
                    <label
                        htmlFor="email-code-verify"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Código verificación  <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email-code-verify"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        value={data.verification_code}
                        onChange={(e) => setData('verification_code', e.target.value)}
                    />
                    <InputError message={errors.verification_code} />
                </div>
                { !checkEmailSend && (
                    <Button
                        className="mt-4 2-full"
                        type="button"
                        onClick={()=> sendEmailVerificationCode()}
                        disabled={false}
                    >
                        Enviar codigo de verificacion
                    </Button>
                ) }
                { checkEmailSend && (
                    <Button
                        className="mt-4 2-full"
                        type="button"
                        onClick={()=> resendEmailVerification()}
                        disabled={cooldown !== 0}
                    >
                        {cooldown > 0
                            ? `Reenviar en ${cooldown}s`
                            : 'Reenviar código'}
                    </Button>
                )}
                <Button
                    className="mt-4 w-full"
                    type="submit"
                >
                    Validar codigo
                </Button>

            </form>
        </React.Fragment>
    );
}
