<?php

namespace Database\Seeders;

use App\Enums\SubscriptionStatus;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $DATA = [
            [
                'organization_id' => 1,
                'plan_id' => 1,
                'starts_at' => Carbon::now(),
                'ends_at' => Carbon::now()->addDays(14),
                'status' => SubscriptionStatus::Trial
            ],
            [
                'organization_id' => 2,
                'plan_id' => 1,
                'starts_at' => Carbon::now(),
                'ends_at' => Carbon::now()->addDays(14),
                'status' => SubscriptionStatus::Trial
            ],
            [
                'organization_id' => 3,
                'plan_id' => 1,
                'starts_at' => Carbon::now(),
                'ends_at' => Carbon::now()->addDays(14),
                'status' => SubscriptionStatus::Trial
            ],

        ];
        DB::table('subscriptions')->insert($DATA);
    }
}
