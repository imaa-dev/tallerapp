<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PayPalWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('Webhook recibido', $request->all());

        return response()->json([
            'success' => true
        ]);
    }
}
