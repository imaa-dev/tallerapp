<?php

namespace App\Services;

use App\DAO\SparePartsDAO;
use App\DTO\CreateSparePartsDTO;
use App\DTO\ServiceResult;
use App\Jobs\GenerateApproveEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\Servi;

class SparePartsService
{

    private SparePartsDAO $sparePartsDAO;
    private ServiService $serviService;
    private UserService $userService;

    public function __construct(
        SparePartsDAO $sparePartsDAO,
        ServiService $serviService,
        UserService $userService
    )
    {
        $this->serviService = $serviService;
        $this->sparePartsDAO = $sparePartsDAO;
        $this->userService = $userService;
    }

    public function createSparePart(CreateSparePartsDTO $data): ServiceResult
    {
        try {
            $sparePart = $this->sparePartsDAO->createSparePart([
                'servi_id' => $data->servi_id,
                'user_id' => $data->user_id,
                'model' => $data->model,
                'brand' => $data->brand,
                'price' => $data->price,
                'note' => $data->note
            ]);
            return ServiceResult::success(
                $sparePart,
                'Pieza de respuesto creada satisfactoriamente',
                201,
            );
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
            return ServiceResult::fail(
                null,
            503,
                'ERROR',

            );
        }
    }

    public function update(int $id, array $data): ServiceResult
    {
        try {
            $sparePart = $this->sparePartsDAO->getById($id);

            if(!$sparePart){
                return ServiceResult::fail(
                    'La pieza no existe',
                    404,
                );
            }
            $allowed = ['servi_id', 'user_id', 'model', 'brand', 'price', 'note'];
            $data = array_intersect_key($data, array_flip($allowed));
            $sparePart = $this->sparePartsDAO->update($id, $data);
            return ServiceResult::success(
                $sparePart,
                'Pieza de repuesto actualzada satisfactoriamente',
                201
            );
        } catch (\Throwable $th){
            return ServiceResult::fail(
                false,
                500,
            );
        }
    }

    public function delete($id)
    {
        try {
            $this->sparePartsDAO->deleteSparePart($id);
            return new ServiceResult(
                true,
                200,
                'Pieza de repuesto eliminada satisfactoriamente'
            );
        } catch (\Throwable $th){
            return new ServiceResult(
                false,
                500,
                'ERROR'
            );
        }
    }
    public function sparePartNotificate(int $service_id, bool $notificate,bool $notificate_client ,array $spare_parts): ServiceResult
    {
        try {
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
                $service = $this->serviService->getServiceWithProductClientFileReason($service_id);
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
            
            return new ServiceResult(
                true,
                200,
                'Repuestos agregados satisfactoriamente',
            );
        } catch (e) {
            return new ServiceResult(
                false,
                500,
                'ERROR'
            );
        }
    }
}
