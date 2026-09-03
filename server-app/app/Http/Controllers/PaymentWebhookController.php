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
        // Cuerpo exacto recibido desde PayPal.
        $rawPayload = $request->getContent();

        try {
            // Array utilizado para procesar el evento.
            $payload = json_decode(
                $rawPayload,
                true,
                512,
                JSON_THROW_ON_ERROR
            );

            Log::info('Webhook recibido', [
                'provider' => $provider,
                'event_id' => $payload['id'] ?? null,
                'event_type' => $payload['event_type'] ?? null,
                'raw_payload_length' => strlen($rawPayload),
            ]);

            $this->paymentService->verifyAndProcessWebhook(
                provider: $provider,
                headers: $request->headers->all(),
                payload: $payload,
                rawPayload: $rawPayload,
            );

            return response()->json(['success' => true]);
        } catch (WebhookVerificationFailed $e) {
            Log::warning('Webhook con firma inválida', [
                'provider' => $provider,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        } catch (\JsonException $e) {
            Log::warning('JSON de webhook inválido', [
                'provider' => $provider,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'JSON inválido',
            ], 400);
        } catch (\Throwable $e) {
            Log::error('Webhook error', [
                'provider' => $provider,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno',
            ], 500);
        }
    }
}
