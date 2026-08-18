<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE repair_documents MODIFY COLUMN type ENUM('diagnosis', 'final', 'cost_approval') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE repair_documents MODIFY COLUMN type ENUM('diagnosis', 'final') NOT NULL");
    }
};
