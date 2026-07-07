<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\WebhooksEvent;
use App\Models\Subscription;
use Illuminate\Support\Facades\DB;

class PayPalWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // probar con id subscription que llega de paypal
        // cambiar el id que te entrega sandbox de prueba porque
        // no son los mismos
        Log::info('Webhook recibido', $request->all());
        Log::info('id webhook', ['id',$request->id]);
        Log::info('request event type', ['id',$request->event_type]);
        
        $event = WebhooksEvent::firstOrCreate(
            ['event_id' => $request->id],
            [
                'provider' => 'paypal',
                'event_type' => $request->event_type,
                'payload' => $request->all(),
                
            ]
        );

        if (! $event->wasRecentlyCreated) {
            return response()->json(['success' => true]);
        }
        
        DB::transaction(function () use ($request, $event) {

            switch ($request->event_type) {

                case 'BILLING.SUBSCRIPTION.ACTIVATED':

                    $paypalId = $request->input('resource.id');
                    
                    $subscription = Subscription::where(
                        'provider_subscription_id',
                        $paypalId
                    )->lockForUpdate()->first();

                    if (! $subscription) {
                        throw new \Exception('Subscription no encontrada');
                    }

                    $subscription->update([
                        'status' => 'active',
                        'starts_at' => now(),
                        'ends_at' => now()->addMonth()
                    ]);

                    break;
            }

            $event->update([
               'processed_at' => now(),
            ]);
        });

    return response()->json(['success' => true]);
    }
}
