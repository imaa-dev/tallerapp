<?php

namespace App\Http\Controllers\api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\UserService;

class UserController extends Controller
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function storeClient(Request $request)
    {

    }

    public function store(LoginRequest $request)
    {
        try {
            $email = $request->email;
            $password = $request->password;
            return $this->userService->authLoguin($email, $password);
        } catch (\Throwable $th) {
            throw $th;
        }  
    }

    public function logout(Request $request){
    
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logout exitoso'
        ]);
    }
}
