<?php

namespace App\Http\Requests;

use App\Models\Organization;
use Illuminate\Foundation\Http\FormRequest;

class OrganizationCustomRequest extends FormRequest
{
    public function organization()
    {
        return Organization::where('user_id', $this->user()->id)->first();
    }
}
