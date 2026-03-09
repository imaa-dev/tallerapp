import { ServiDataForm } from '@/types';

export type FormAction = { type: 'SET_FIELD'; field: keyof ServiDataForm; value: ServiDataForm[keyof ServiDataForm] }
                            | { type: 'REMOVE_REASON_NOTE';  index: number; } | { type: 'CLEAN_REASON_NOTE' }
                            | { type: 'CLEAN_FORM' }

export const initialState: ServiDataForm = {
    organization_id: 0,
    product_id: 0,
    user_id: 0,
    date_entry: "",
    file: null,
    status_id: 0,
    reason_notes: [],
}

export function formReducer(state: ServiDataForm, action: FormAction): ServiDataForm{
    switch (action.type) {
        
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };

        case 'REMOVE_REASON_NOTE':
            return {
                ...state,
                reason_notes: state.reason_notes.filter((_, i) => i !== action.index)
            }

        case 'CLEAN_REASON_NOTE':
            return { ...state, reason_notes: [] }

        case 'CLEAN_FORM':
            return { ...initialState }

        default:
            return state;
    }
}
