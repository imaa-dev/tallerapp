<?php

namespace App\Providers;

use App\Models\Organization;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Request::macro('organization', function () {
            /** @var \Illuminate\Http\Request $this */
            if(!$this->user()){
                return null;
            }
            return Organization::where('user_id', $this->user()->id)
                ->where('active', true)
                ->first();
        });
    }
}
