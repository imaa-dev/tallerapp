<?php

namespace App\Http\Requests;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        
        return auth()->user()->rol !== 'CLIENT';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
    $organizationRule = Rule::exists('organizations', 'id');

    if (auth()->user()->rol === 'ADMIN') {
        $organizationRule->where('active', true);
    }

    return [
        'user_id' => [
            'required',
            'exists:users,id'
        ],

        'organization_id' => [
            'required',
            $organizationRule
        ],

        'product_id' => [
            'required',
            Rule::exists('products', 'id')
                ->where('organization_id', $this->organization_id)
        ],

        'status_id' => [
            'required',
            'exists:status_services,id'
        ],

        'date_entry' => [
            'required',
            'date'
        ],
    ];
}

    public function messages(): array
    {
        return [
            'product_id.required' => 'El producto es requerido.',
            'product_id.exists' => 'El producto no pertenece a la organización seleccionada.',

            'organization_id.required' => 'La organización es requerida.',
            'organization_id.exists' => 'La organización no existe o no está activa.',

            'user_id.required' => 'El cliente es requerido.',
            'user_id.exists' => 'El cliente seleccionado no existe.',

            'status_id.required' => 'El estado es requerido.',
            'status_id.exists' => 'El estado seleccionado no existe.',

            'date_entry.required' => 'La fecha de ingreso es requerida.',
            'date_entry.date' => 'La fecha debe ser válida.',
        ];
    }
}
