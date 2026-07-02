<?php

namespace App\Services;

use App\DTO\CreateSparePartsDTO;
use App\DTO\ServiceResult;
use App\Jobs\GenerateApproveEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\Servi;
use App\Models\SpareParts;

class SparePartsService
{

    private ServiService $serviService;
    private UserService $userService;

    public function __construct(
        ServiService $serviService,
        UserService $userService
    )
    {
        $this->serviService = $serviService;
        $this->userService = $userService;
    }

    public function createSparePart(CreateSparePartsDTO $data)
    {
        $spare_part = SpareParts::create([
            'servi_id' => $data->servi_id,
            'user_id' => $data->user_id,
            'model' => $data->model,
            'brand' => $data->brand,
            'price' => $data->price,
            'note' => $data->note
        ]);
        return $spare_part;
    }

    public function update(int $id, array $data)
    {
        $spare_part = SpareParts::findOrfail($id);

        $allowed = ['servi_id', 'user_id', 'model', 'brand', 'price', 'note'];
        $data = array_intersect_key($data, array_flip($allowed));
        $spare_part->update($data);
        return $spare_part;
    }

    public function delete($id): void
    {
        SpareParts::destroy($id);
    }
    public function sparePartNotificate(int $service_id, bool $notificate,bool $notificate_client ,array $spare_parts)
    {
        foreach ($spare_parts as $spare_part) {
            
            $this->update($spare_part, ['servi_id' =>  $service_id]);
        }
        if($notificate_client){
            $serviceApprove = Servi::where('id', $service_id);
            $serviceApprove->update([
                'approve_spare_parts' => true
            ]);
            $this->serviService->updateStatusService($service_id, 4);
        }else if($notificate){
            $service = $this->serviService->getServiceWithProductClientFileReasonDiagnosis($service_id);
            $client = $this->userService->getClientById($service->client->id);
            $token = $this->userService->addTokenClient($client);

            $urls = [
                'approve' => url(
                    '/approve/spare-parts/' . $token->approval_token . 
                    '?action=approve&uuid=' . $service->uuid
                ),
                'reject' => url(
                    '/approve/spare-parts/' . $token->approval_token . 
                    '?action=reject&uuid=' . $service->uuid
                ),
            ];
            GenerateApproveEmail::dispatch($service, $urls);
            $this->serviService->updateStatusService($service_id, 4);
        }
    }

    public function getSpareParts(int $user_id){
        return SpareParts::where('user_id', $user_id)->get();
    }
}
