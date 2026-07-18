<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PendingLogin;

class ClearPendingLogins extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pending-logins:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        PendingLogin::where(
            'expires_at',
            '<',
            now()
        )->delete();
    }
}
