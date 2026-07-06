<?php

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
        Schema::create('webhooks_events', function (Blueprint $table) {
            $table->id();

            $table->string('provider', 50);
            $table->string('event_id')->unique();
            $table->string('event_type');
            $table->string('resource_id')->nullable();

            $table->json('payload');

            $table->timestamp('processed_at')->nullable();

            $table->timestamps();

            $table->index(['provider', 'event_type']);
            $table->index('resource_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhooks_events');
    }
};