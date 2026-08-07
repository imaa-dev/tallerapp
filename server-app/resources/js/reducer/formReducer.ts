import { ServiDataForm } from '@/types';

export type FormAction = { type: 'SET_FIELD'; field: keyof ServiDataForm; value: ServiDataForm[keyof ServiDataForm] }
                            | { type: 'REMOVE_ISSUE';  index: number; } | { type: 'CLEAN_ISSUES' }
                            | { type: 'CLEAN_FORM' }

export const initialState: ServiDataForm = {
    organization_id: undefined,
    product_id: undefined,
    user_id: undefined,
    date_entry: "",
    file: null,
    status_id: undefined,
    issues: [],
}

export function formReducer(state: ServiDataForm, action: FormAction): ServiDataForm{
    switch (action.type) {
        
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };

        case 'REMOVE_ISSUE':
            return {
                ...state,
                issues: (state.issues ?? []).filter((_, i) => i !== action.index)
            }

        case 'CLEAN_ISSUES':
            return { ...state, issues: [] }

        case 'CLEAN_FORM':
            return { ...initialState }

        default:
            return state;
    }
}
