<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_issues', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('servi_id');
            $table->foreign('servi_id')->references('id')->on('servis')->onDelete('cascade');
            $table->string('issue');
            $table->string('diagnosis')->nullable();
            $table->string('repair_time')->nullable();
            $table->double('cost')->nullable();
            $table->boolean('attend')->default(false);
            $table->timestamps();
        });

        if (Schema::hasTable('reasons')) {
            $reasons = DB::table('reasons')->get();

            foreach ($reasons as $reason) {
                $diagnosis = null;

                if ($reason->diagnosis_id && Schema::hasTable('diagnosis')) {
                    $diagnosis = DB::table('diagnosis')->where('id', $reason->diagnosis_id)->first();
                }

                DB::table('service_issues')->insert([
                    'servi_id' => $reason->servi_id,
                    'issue' => $reason->reason_note,
                    'diagnosis' => $diagnosis?->diagnosis,
                    'repair_time' => $diagnosis?->repair_time,
                    'cost' => $diagnosis?->cost,
                    'attend' => (bool) $reason->attend,
                    'created_at' => $reason->created_at,
                    'updated_at' => $reason->updated_at,
                ]);
            }

            Schema::dropIfExists('reasons');
        }

        if (Schema::hasTable('diagnosis')) {
            Schema::dropIfExists('diagnosis');
        }
    }

    public function down(): void
    {
        Schema::create('diagnosis', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('servi_id');
            $table->foreign('servi_id')->references('id')->on('servis')->onDelete('cascade');
            $table->string('diagnosis');
            $table->string('repair_time');
            $table->double('cost');
            $table->timestamps();
        });

        Schema::create('reasons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('servi_id');
            $table->foreign('servi_id')->references('id')->on('servis')->onDelete('cascade');
            $table->string('reason_note');
            $table->boolean('attend')->default(false);
            $table->unsignedBigInteger('diagnosis_id')->nullable();
            $table->foreign('diagnosis_id')->references('id')->on('diagnosis')->onDelete('set null');
            $table->timestamps();
        });

        $issues = DB::table('service_issues')->get();

        foreach ($issues as $issue) {
            $diagnosisId = null;

            if ($issue->diagnosis !== null || $issue->repair_time !== null || $issue->cost !== null) {
                $diagnosisId = DB::table('diagnosis')->insertGetId([
                    'servi_id' => $issue->servi_id,
                    'diagnosis' => $issue->diagnosis ?? '',
                    'repair_time' => $issue->repair_time ?? '',
                    'cost' => $issue->cost ?? 0,
                    'created_at' => $issue->created_at,
                    'updated_at' => $issue->updated_at,
                ]);
            }

            DB::table('reasons')->insert([
                'servi_id' => $issue->servi_id,
                'diagnosis_id' => $diagnosisId,
                'reason_note' => $issue->issue,
                'attend' => (bool) $issue->attend,
                'created_at' => $issue->created_at,
                'updated_at' => $issue->updated_at,
            ]);
        }

        Schema::dropIfExists('service_issues');
    }
};
