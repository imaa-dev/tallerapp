<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Insert new CostApproval status between SparePartApproval(3) and InRepair(4).
        // Existing rows 4..7 shift to 5..8.
        DB::table('servis')
            ->where('status_id', '>=', 4)
            ->orderByDesc('status_id')
            ->update(['status_id' => DB::raw('status_id + 1')]);
    }

    public function down(): void
    {
        DB::table('servis')
            ->where('status_id', '>=', 5)
            ->orderByDesc('status_id')
            ->update(['status_id' => DB::raw('status_id - 1')]);
    }
};
