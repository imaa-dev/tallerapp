<?php

namespace App\Http\Controllers;

use App\DTO\CreateSparePartsDTO;
use App\Models\Servi;
use App\Models\SpareParts;
use App\Models\User;
use App\Services\SparePartsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SparePartsController extends Controller
{

    private SparePartsService $sparePartsService;

    public function __construct( SparePartsService $sparePartsService )
    {
        $this->sparePartsService = $sparePartsService;
    }

    public function create(Request $request)
    {
        $dto = new CreateSparePartsDTO($request);
        $res = $this->sparePartsService->createSparePart($dto);
        return response()->json($res);
    }

    public function spareParts(Request $request)
    {
        $notificate = $request->notificate;
        $notificate_client = $request->notificate_client;
        $spare_parts = $request->spare_parts;
        $service_id = $request->servi_id;
        $res = $this->sparePartsService->sparePartNotificate($service_id, $notificate, $notificate_client, $spare_parts);
        session()->flash('message', $res->message);
        return redirect()->route('services.view');
    }

    public function approve(Request $request, $token)
    {

        $action = $request->query('action');    
        $uuid = $request->query('uuid');
        if (!in_array($action, ['approve', 'reject'])) {
            abort(400);
        }

        $user = User::where('approval_token', $token)
            ->where('token_expires_at', '>', now())
            ->firstOrFail();
        if (!$user) {
            return view('client.rejected');
        }
        

        $serviceApprove = Servi::where('uuid', $uuid);
        
        $serviceApprove->update([
            'approve_spare_parts' => true
        ]);

        $user->update([
            'approval_token' => null,
            'token_expires_at' => null,
            'approved_at' => now(),
        ]);

        return view(
            $action === 'approve'
                ? 'client.success'
                : 'client.rejected'
        );
    }
    public function getSpareParts(Request $request){
        return response()->json(
            $this->sparePartsService->getSpareParts($request->user()->id)
        );
    }
}
