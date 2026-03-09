<?php

namespace App\Services;

use App\DAO\OrganizationDAO;
use App\DAO\ServicesDAO;
use App\DTO\CreateServiceDTO;
use App\DTO\ServiceResult;
use App\DTO\UpdateServiceDTO;
use App\Jobs\FinalReceipt;
use App\Jobs\InspectNotify;
use App\Jobs\RepairNotify;
use App\Models\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ServiService
{

    private ServicesDAO $servicesDAO;
    private OrganizationDAO $organizationDAO;
    private ReasonService $reasonService;

    private ServiceFilesService $serviceFilesService;

    public function __construct(
        ServicesDAO $serviceDAO,
        OrganizationDAO $organizationDAO,
        ReasonService $reasonService,
        ServiceFilesService $serviceFilesService
    )
    {
        $this->servicesDAO = $serviceDAO;
        $this->organizationDAO = $organizationDAO;
        $this->reasonService = $reasonService;
        $this->serviceFilesService = $serviceFilesService;
    }

    public function create(CreateServiceDTO $dto, ?array $files, int $userId, ?array $reasonNotes): ServiceResult
    {
        try {
            $servi_paths = [];

            if ($files) {
                foreach ($files as $file) {
                    $path = $file->store('servi/' . $userId, 'public');
                    $servi_paths[] = $path;
                }
            }
            $uuid = (string) Str::uuid();

            $servi = $this->servicesDAO->create([
                'uuid' => $uuid,
                'user_id' => $dto->user_id,
                'organization_id' => $dto->organization_id,
                'product_id' => $dto->product_id,
                'status_id' => $dto->status_id,
                'date_entry' => $dto->date_entry
            ]);

            if ($reasonNotes) {
                $this->reasonService->storeReasons($reasonNotes, $servi->id);
                }

            if (!empty($servi_paths)) {
                foreach ($servi_paths as $path) {
                    $servi->file()->create([
                        'path' => $path
                    ]);
                }
            }

            // generar consulta para obtener el file del service
            // llamar a service con su dao, ideal no dejar consultas en los services

            return new ServiceResult(
                 true,
                 201,
                'Servicio creado satisfactoriamente',
                $servi
            );

        } catch (\Throwable $th) {

            Log::error("Service Servi Catch Error: " . $th->getMessage());

            return new ServiceResult(
                false,
                 500,
                'Error al crear servicio'
            );
        }
    }

    public function update(UpdateServiceDTO $data): ServiceResult
    {
        try {

            $serviceUpdate = $this->servicesDAO->getServiceById($data->id);

            if(!$serviceUpdate){
                return new ServiceResult( false, 404, 'Servicio no encontrado' );
            }
            $this->servicesDAO->updateService($serviceUpdate ,[
                'id' => $data->id,
                'user_id' => $data->user_id,
                'product_id' => $data->product_id,
                'date_entry' => $data->date_entry,
            ]);

            return new ServiceResult(
                true,
                200,
                'Servicio actualizado satisfactoriamente'
                );

        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return new ServiceResult(
                false,
                500,
                'Error al actualizar datos'
            );
        }
    }

    public function delete(int $id): ServiceResult
    {
        try {
            $serviceDelete = $this->servicesDAO->getServiceWithProductClientFileReason($id);
            if(!$serviceDelete){
                return new ServiceResult(
                    false,
                    404,
                    'Servicio no encontrado'
                    );
            }

            if($serviceDelete->file){
                foreach ($serviceDelete->file as $file){
                    Storage::disk('public')->delete($file->path);
                }
            }
            $serviceDelete->delete();
            if($serviceDelete->file){
                foreach ($serviceDelete->file as $file){
                    $file->delete();
                }
            }
            if(!$serviceDelete){
                return new ServiceResult(
                    false,
                    500,
                    'No se pudo eliminar el registro'
                    );
            }
            return new ServiceResult(
                true,
                200,
                'Servicio eliminado satisfactoriamente'
                );
        } catch (\Throwable $th) {
            Log::error($th);
            return new ServiceResult(
                false,
                500,
                'Ocurrio un error'
                );
        }
    }


    public function getTypeService(int $userId, int $status_id){
        $organization = $this->organizationDAO->getActive($userId);
        $services = $this->servicesDAO->getServicesFilterForStatusWithProductClientFileReason($status_id, $organization->id);
        return  [
            'servis' => $services
        ];
    }
    public function goBack(int $id, int $status_id): ServiceResult
    {
        try {
            $serviceToGoBack = $this->servicesDAO->getServiceById($id);
            $serviceToGoBack->status_id = $status_id - 1;
            $this->servicesDAO->goBackService($serviceToGoBack);
            return new ServiceResult(
                true,
                200,
                'Servicio actualizado correctamente'
            );
        } catch (\Throwable $th){
            Log::error($th->getMessage());
            return new ServiceResult(
                false,
                500,
                'Ocurrio un error'
            );
        }
    }
    public function getServiceWithProductClientFileReason(int $serviceId)
    {
        return $this->servicesDAO->getServiceWithProductClientFileReason($serviceId);
    }
    public function getServiceWithProductClientFileReasonDiagnosis(int $serviceId)
    {
        return $this->servicesDAO->getServiceWithProductClientFileReasonDiagnosis($serviceId);
    }
    public function getById(int $id)
    {
        return $this->servicesDAO->getServiceById($id);
    }
    public function updateStatusService(int $service_id, int $statusId): ServiceResult
    {
        try {
            $serviceToRepaired = $this->servicesDAO->getServiceById($service_id);
            $this->servicesDAO->updateStatusService($serviceToRepaired, $statusId);

            return new ServiceResult(
                true,
                200,
                'Servicio actualizado satisfactoriamente'
            );
        } catch (\Throwable $throwable) {
            Log::error($throwable->getMessage());
            return new ServiceResult(
                false,
                500,
                'Error en el server'
            );
        }
    }
    public function updateStatusServiceNotifyInspect(int $service_id, int $statusId, bool $notification_client): ServiceResult
    {
        try {
            $serviceToRepaired = $this->servicesDAO->getServiceById($service_id);
            $this->servicesDAO->updateStatusService($serviceToRepaired, $statusId);
            $service = $this->servicesDAO->getServiceWithProductClientFileReason($service_id);
            if($notification_client){
                InspectNotify::dispatch($service);
            }
            return new ServiceResult(
                true,
                200,
                'Servicio actualizado satisfactoriamente'
            );
        } catch (\Throwable $throwable) {
            Log::error($throwable->getMessage());
            return new ServiceResult(
                false,
                500,
                'Error en el server'
            );
        }
    }
    public function updateStatusServiceNotifyRepair(int $service_id, int $statusId, bool $notification_client): ServiceResult
    {
        try {
            $serviceToRepaired = $this->servicesDAO->getServiceById($service_id);
            $this->servicesDAO->updateStatusService($serviceToRepaired, $statusId);
            $service = $this->servicesDAO->getServiceWithProductClientFileReason($notification_client);
            if($notification_client){
                RepairNotify::dispatch($service);
            }
            return new ServiceResult(
                true,
                200,
                'Servicio actualizado satisfactoriamente'
            );
        } catch (\Throwable $throwable) {
            Log::error($throwable->getMessage());
            return new ServiceResult(
                false,
                500,
                'Error en el server'
            );
        }
    }

    public function repairServiceNotifyClient(int $service_id, int $statusId, float $repair_price, string $final_note): ServiceResult
    {
        try {
            Log::error('REPAIR SERVI NOTIFY SERVICE');
            $service = $this->servicesDAO->getServiceById($service_id);
            $this->servicesDAO->finalRepairUpdate($service, $statusId, $repair_price, $final_note);
            $service_receipt = $this->servicesDAO->getServiceWithProductClientFileReason($service_id);
            FinalReceipt::dispatch($service_receipt);
            return new ServiceResult(
                true,
                200,
                'servicio reparado satisfactoriamente'
            );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return new ServiceResult(
                false,
                500,
                'Error en el server'
            );
        }
    }

    public function getByName($name)
    {

    }

    public function mediaTotal()
    {

    }

    public function mediaUnsatisfied()
    {

    }

    public function mediaSatisfied()
    {

    }

    public function mediaNotSatisfied()
    {

    }
    public function getCountTypeService($id)
    {
        return $this->servicesDAO->getCountTypeService($id);
    }
}
