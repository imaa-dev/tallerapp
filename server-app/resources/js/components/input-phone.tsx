import PhoneInput from 'react-phone-input-2';
import React from 'react';
import { useAppearance } from '@/hooks/use-appearance';

interface PhoneInputProps {
    data: { phone: string };
    setData: (field: string, value: string ) => void;
}
const InputPhone: React.FC<PhoneInputProps> = ({data, setData}) => {
    const { appearance } = useAppearance()
    return(
            <PhoneInput
                
                enableSearch={true}
                country={'cl'}
                value={data.phone}
                onChange={phone => setData('phone', phone)}
                inputStyle={{
                    backgroundColor: appearance === 'dark' ? '#374151' : '#f9fafb',
                    color: appearance === 'dark' ? '#ffffff' : '#111827',
                    border: '1px solid',
                    borderColor: appearance === 'dark' ? '#4b5563' : '#d1d5db',
                    width: '100%',
                }}
            />
    )
}
export default InputPhone;
