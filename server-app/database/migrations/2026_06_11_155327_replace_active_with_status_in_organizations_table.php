<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn('active');
            $table->enum('status', [
                'active',
                'blocked',
                'inactive'
            ])->default('active');
        });
    }

    public function down(): void
    {

    }
};
