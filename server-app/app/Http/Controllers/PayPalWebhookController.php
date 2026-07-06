<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\WebhooksEvent;
use App\Models\Subscription;

class PayPalWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('Webhook recibido', $request->all());
             // evitar duplicados
        if (
            WebhookEvent::where(
                'event_id',
                $request->id
            )->exists()
        ) {
            return response()->json([
                'success'=>true
            ]);
        }
        
          switch($request->event_type)
        {

            case 'BILLING.SUBSCRIPTION.ACTIVATED':

                $paypalId =
                    $request->input('resource.id');


                $subscription =
                    Subscription::where(
                        'provider_subscription_id',
                        $paypalId
                    )->first();


                if($subscription){

                    $subscription->update([
                        'status'=>'active',
                        'starts_at'=>now(),
                    ]);


                    
                    $subscription->organization
                         ->update([
                             'active'=>true
                         ]);
                }


            break;


        }

        return response()->json([
            'success' => true
        ]);
    }
}
