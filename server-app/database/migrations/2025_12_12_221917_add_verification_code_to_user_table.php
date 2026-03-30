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
        Schema::table('users', function (Blueprint $table) {
            $table->string('verification_code')->nullable()->after('remember_token');
            $table->timestamp('verification_code_expires_at')->nullable()->after('verification_code');
            $table->string('approval_token')->nullable()->after('verification_code_expires_at');
            $table->timestamp('token_expires_at')->nullable()->after('approval_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

        });
    }
};
