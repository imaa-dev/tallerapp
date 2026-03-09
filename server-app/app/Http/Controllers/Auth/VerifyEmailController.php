<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\ServiService;
use App\Services\UserService;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\VerifyEmailCode;

class VerifyEmailController extends Controller
{

    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }

    public function sendVerificationCode(Request $request)
    {
        $user_id = $request->user()->id;
        $user = $this->userService->getClientById($user_id);
        $code = $this->generateVerificationCode($user);
        Mail::to($user->email)->send(new VerifyEmailCode($code));
        return response()->json(['message' => 'Código de verificacion enviado']);
    }

    public function resendVerificationCode(Request $request)
    {
        $user_id = $request->user()->id;
        $key = 'resend-verification' . $user_id;
        $expiresAt = $request->user()->verification_code_expires_at;
        if( RateLimiter::tooManyAttempts($key, 1)) {
            return back()->withErrors([
                'message' => 'Debes esperar antes de reenviar el codigo'
            ]);
        }
        if( now()->lessThan( $request->user()->verification_code_expires_at->subMinutes(9) ) ){
            return back()->withErrors([
                'message' => 'Espera 1 minuto antes de reenviar el código.',
            ]);
        }

        RateLimiter::hit($key, 60);
        $user = $this->userService->getClientById($user_id);
        $code = $this->generateVerificationCode($user);
        Mail::to($user->email)->send(new VerifyEmailCode($code));
        return response()->json(['message' => 'Código de verificaión enviado']);
    }
    public function generateVerificationCode(User $user)
    {
        $code = random_int(100000, 999999);
        $user->verification_code = $code;
        $user->verification_code_expires_at = now()->addMinutes(10);
        $user->save();
        return $code;
    }

    public function verifyCode(Request $request)
    {

        $request->validate([
            'verification_code' => 'required|numeric',
        ]);
        $user = $this->userService->getClientById($request->user()->id);
        if ($user->verification_code == $request->verification_code && now()->lessThanOrEqualTo($user->verification_code_expires_at)) {
            $user->email_verified_at = now();
            $user->verification_code = null;
            $user->verification_code_expires_at = null;
            $user->save();

            return redirect()->back()->with('message', 'Email verificado satisfactoriamente!');
        }

        return redirect()->back()->withErrors([
            'code' => 'Código inválido o expirado',
        ]);
    }


}
