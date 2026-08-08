<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_issues', function (Blueprint $table) {
            $table->dropUnique(['token']);
            $table->dropColumn(['token', 'client_accessed', 'pdf_downloaded']);
        });
    }

    public function down(): void
    {
        Schema::table('service_issues', function (Blueprint $table) {
            $table->string('token', 64)->nullable()->unique()->after('attend');
            $table->boolean('client_accessed')->default(false)->after('token');
            $table->boolean('pdf_downloaded')->default(false)->after('client_accessed');
        });
    }
};
