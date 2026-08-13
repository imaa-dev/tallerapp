<?php

namespace App\Console\Commands;

use App\Models\Plan;
use App\Payments\PayPalGateway;
use App\Services\PaymentService;
use Illuminate\Console\Command;

class SyncPayPalPlansCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'paypal:sync-plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea los billing plans de PayPal para cada plan interno y guarda su id.';

    /**
     * Execute the console command.
     */
    public function handle(PaymentService $paymentService): int
    {
        $gateway = $paymentService->gateway('paypal');

        if (! $gateway instanceof PayPalGateway) {
            $this->error('El proveedor paypal no está disponible.');

            return self::FAILURE;
        }

        $plans = Plan::where('is_active', true)->get();

        foreach ($plans as $plan) {
            if ($plan->providerPlanId('paypal')) {
                $this->info("Plan {$plan->name}: ya configurado.");

                continue;
            }

            try {
                $paypalPlanId = $gateway->createPlan($plan);

                $this->info("Plan {$plan->name}: creado con id {$paypalPlanId}.");
            } catch (\Throwable $e) {
                $this->error("Plan {$plan->name}: {$e->getMessage()}");
            }
        }

        return self::SUCCESS;
    }
}
