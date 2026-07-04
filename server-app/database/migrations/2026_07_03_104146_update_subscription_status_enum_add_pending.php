<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
        public function up(): void
    {
        DB::statement("
            ALTER TABLE subscriptions
            MODIFY COLUMN status ENUM(
                'pending',
                'trial',
                'active',
                'cancelled',
                'expired',
                'suspended'
            ) NOT NULL DEFAULT 'pending'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE subscriptions
            MODIFY COLUMN status ENUM(
                'trial',
                'active',
                'cancelled',
                'expired',
                'suspended'
            ) NOT NULL DEFAULT 'trial'
        ");
    }
};
