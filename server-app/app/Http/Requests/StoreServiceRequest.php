<?php

namespace App\Http\Requests;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $organization_id = $this->getOrganizationId();

        // Si viene de web y no mandaron org, usa la del usuario
        if (!$organization_id && $this->user()) {
            $organization_id = $this->user()->organization_id;
        }

        $this->merge([
            'organization_id' => $organization_id,
        ]);
    }

    private function getOrganizationId(): ?int
    {
        // 1. API / App RN: viene en el token de Sanctum
        if ($this->user() && $token = $this->user()->currentAccessToken()) {
            return $token->organization_id; // <- null-safe
        }

        // 2. WEB / Inertia: viene en el form o en el usuario
        return $this->input('organization_id') ?? $this->user()?->organization_id;
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
                Rule::exists('products', 'id')->where('organization_id', $organization_id)
            ],

            'status_id' => ['required', 'exists:status_services,id'],
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

            'reason_notes.required' => 'El detalle de ingreso es requerido'
        ];
    }
}
