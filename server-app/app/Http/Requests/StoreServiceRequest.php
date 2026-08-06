<?php

namespace App\Http\Requests;

use App\Enums\ServiceStatus;
use App\Enums\UsersRol;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array(
            $this->user()->rol,
            [
                UsersRol::ADMIN->value,
                UsersRol::TECHNICIAN->value,
            ]
        );
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'organization_id' => $this->getOrganizationId(),
        ]);
    }

    private function getOrganizationId(): ?int
    {
        // 1. API / App RN: viene en el token de Sanctum
        if ($this->user() && $token = $this->user()->currentAccessToken()) {
            return $token->organization_id;
        }

        // 2. WEB / Inertia: viene en el form o en la organización activa de la sesión
        return $this->input('organization_id') ?? session('tenant_id');
    }

    public function rules(): array
    {
        $organization_id = $this->organization_id;

        return [
            'organization_id' => ['required', 'exists:organizations,id'],

            'user_id' => [
                'required',
            ],

            'product_id' => [
                'required',
                Rule::exists('products', 'id')->where('organization_id', $organization_id),
            ],

            'status_id' => [
                'required',
                Rule::in(array_column(ServiceStatus::cases(), 'value')),
            ],
            'date_entry' => ['required', 'date'],
            'reason_notes' => ['required', 'array'],
            'reason_notes.*.reason_note' => ['required', 'string'],

            'file' => ['nullable'],
            'file.*' => ['file', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'organization_id.required' => 'La organización es requerida.',
            'organization_id.exists' => 'La organización no existe.',

            'user_id.required' => 'El cliente es requerido.',
            'user_id.exists' => 'El cliente seleccionado no pertenece a esta organización.',

            'product_id.required' => 'El producto es requerido.',
            'product_id.exists' => 'El producto no pertenece a la organización seleccionada.',

            'status_id.required' => 'El estado es requerido.',
            'status_id.exists' => 'El estado seleccionado no existe.',

            'date_entry.required' => 'La fecha de ingreso es requerida.',
            'date_entry.date' => 'La fecha debe ser válida.',

            'reason_notes.required' => 'El detalle de ingreso es requerido',
        ];
    }
}
