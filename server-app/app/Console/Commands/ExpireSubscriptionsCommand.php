<?php

namespace App\Console\Commands;

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class ExpireSubscriptionsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync subscription status when ends_at has passed';

    /**
     * Execute the console command.
     */
    public function handle(SubscriptionService $subscriptionService): int
    {
        $subscriptions = Subscription::query()
            ->whereIn('status', [SubscriptionStatus::Trial, SubscriptionStatus::Active])
            ->where('ends_at', '<', now())
            ->get();

        $subscriptions->each(fn (Subscription $subscription) => $subscriptionService->syncStatus($subscription));

        $this->info("{$subscriptions->count()} suscripciones sincronizadas.");

        return self::SUCCESS;
    }
}
