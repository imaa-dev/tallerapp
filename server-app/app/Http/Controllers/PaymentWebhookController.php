<?php

namespace App\Http\Controllers;

use App\Payments\Exceptions\WebhookVerificationFailed;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService,
    ) {}

    public function handlePaypal(Request $request)
    {
        return $this->handle('paypal', $request);
    }

    public function handleMercadoPago(Request $request)
    {
        return $this->handle('mercadoPago', $request);
    }

    protected function handle(string $provider, Request $request)
    {
        Log::info('Webhook recibido', [
            'provider' => $provider,
            'payload' => $request->all(),
        ]);

        try {
            $this->paymentService->verifyAndProcessWebhook(
                provider: $provider,
                headers: $request->headers->all(),
                payload: $request->all(),
            );

            return response()->json(['success' => true]);
        } catch (WebhookVerificationFailed $e) {
            Log::warning('Webhook con firma inválida', [
                'provider' => $provider,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        } catch (\Throwable $e) {
            Log::error('Webhook error', [
                'provider' => $provider,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['success' => false, 'message' => 'Error interno'], 500);
        }
    }
}
