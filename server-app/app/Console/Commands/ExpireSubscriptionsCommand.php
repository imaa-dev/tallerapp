<?php

namespace App\Console\Commands;

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
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
    protected $description = 'Subscription expired';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Subscription::query()
            ->where('status', SubscriptionStatus::Trial)
            ->where('ends_at', '<', now())
            ->update([
                'status' => SubscriptionStatus::Expired
            ]);
    }
}
