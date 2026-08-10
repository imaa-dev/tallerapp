<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('spare_parts', function (Blueprint $table) {
            $table->unsignedBigInteger('organization_id')->nullable()->after('user_id');
            $table->foreign('organization_id')->references('id')->on('organizations');
        });

        DB::statement('UPDATE spare_parts sp LEFT JOIN servis s ON sp.servi_id = s.id SET sp.organization_id = s.organization_id');
        DB::statement('UPDATE spare_parts sp JOIN organizations o ON o.user_id = sp.user_id SET sp.organization_id = o.id WHERE sp.organization_id IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spare_parts', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropColumn('organization_id');
        });
    }
};
