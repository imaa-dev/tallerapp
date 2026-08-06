<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['categorie_id']);
            $table->dropColumn('categorie_id');
        });

        Schema::dropIfExists('payments_subscriptions');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('orders_items');
        Schema::dropIfExists('payments_orders');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('chats');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('categories');
    }

    public function down(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('parent_id');
            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('categorie_id')->nullable()->constrained('categories')->nullOnDelete();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->decimal('total');
            $table->enum('status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->timestamps();
        });

        Schema::create('orders_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('product_id')->constrained('products');
            $table->enum('payment_method', ['card', 'transfer', 'crypto', 'cash'])->default('card');
            $table->integer('quantity');
            $table->decimal('price');
            $table->decimal('subtotal');
            $table->timestamps();
        });

        Schema::create('payments_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->decimal('amount');
            $table->enum('payment_method', ['card', 'transfer', 'crypto', 'cash'])->default('card');
            $table->enum('status', ['pending', 'canceled', 'failed'])->default('pending');
            $table->string('transaction_id');
            $table->decimal('subtotal');
            $table->dateTime('paid_at');
            $table->timestamps();
        });

        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('order_id')->constrained('orders');
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_id')->constrained('chats');
            $table->foreignId('user_id')->constrained('users');
            $table->text('content');
            $table->enum('type', ['text', 'file', 'system'])->default('text');
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('product_id')->constrained('products');
            $table->tinyInteger('raiting')->unsigned()->default(1);
            $table->text('comment');
            $table->timestamps();
        });

        Schema::create('payments_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('USD');
            $table->enum('method', ['paypal', 'monero', 'stripe']);
            $table->string('transaction_id')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->timestamps();
        });
    }
};
