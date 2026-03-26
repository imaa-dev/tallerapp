<?php

namespace App\DAO;

use App\DTO\CreateServiceDTO;
use App\Models\Servi;
use Illuminate\Database\Eloquent\Collection;
use PhpParser\Node\Expr\Cast\Object_;

class ServicesDAO
{

    public function create(array $data) : Servi
    {
        return Servi::create($data);
    }

    public function destroy(int $id)
    {
        return Servi::destroy($id);
    }

    public function getServiceById(int $id): Servi
    {
        return Servi::findOrFail($id);
    }

    public function goBackService(Servi $serviceToGoBack): Servi
    {

        $serviceToGoBack->save();
        return $serviceToGoBack;
    }

    public function getCountTypeService(int $id)
    {
        $serviceRecepcionado = Servi::where('organization_id', $id)->where('status_id', 1)->count();
        $serviceDiagnosticado = Servi::where('organization_id', $id)->where('status_id', 2)->count();
        $serviceAR = Servi::where('organization_id', $id)->where('status_id', 3)->count();
        $serviceER = Servi::where('organization_id', $id)->where('status_id', 4)->count();
        $serviceReparado = Servi::where('organization_id', $id)->where('status_id', 5)->count();
        $serviceEntregado = Servi::where('organization_id', $id)->where('status_id', 6)->count();
        $serviceIncidencia = Servi::where('organization_id', $id)->where('status_id', 7)->count();
        return [
            'serviceRecepcionado' => $serviceRecepcionado,
            'serviceDiagnosticado' => $serviceDiagnosticado,
            'serviceAR' => $serviceAR,
            'serviceER' => $serviceER,
            'serviceReparado' => $serviceReparado,
            'serviceEntregado' => $serviceEntregado,
            'serviceIncidencia' => $serviceIncidencia
       ];
    }

    public function getServicesFilterForStatusWithProductClientFileReason($statusId, $organizationId): Collection
    {
        return Servi::where('organization_id', $organizationId)
            ->where('status_id', $statusId)
            ->with('file')
            ->with('product')
            ->with('client')
            ->with('reasons')
            ->with('diagnosis')
            ->get();
    }

    public function getServiceWithProductClientFileReasonDiagnosis($serviceId) : Servi
    {
        return Servi::where('id', $serviceId)
            ->with('file')
            ->with('product')
            ->with('client')
            ->with('reasons')
            ->with('diagnosis')
            ->with('organization')
            ->first();
    }
    public function getServiceReceipt($serviceId): Servi
    {
        return Servi::where('id', $serviceId)
            ->with('organization')
            ->with('file')
            ->with('product')
            ->with('client')
            ->with('reasons')
            ->with('diagnosis')
            ->with('spareparts')
            ->first();
    }

    public function updateService(Servi $servi, array $data): ?Servi
    {
        $servi->update([
            'user_id' => $data['user_id'],
            'product_id' => $data['product_id'],
            'date_entry' => $data['date_entry']
        ]);

        return $servi;
    }

    public function updateStatusService(Servi $servi, int $status_id): Servi
    {
        $servi->update([
            'status_id' => $status_id
        ]);
        return $servi;
    }

    public function finalRepairUpdate(Servi $service, int $status_id, float $repair_price, string $final_note): Servi
    {

        $service->update([
            'status_id' => $status_id,
            'repair_price' => $repair_price,
            'final_note' => $final_note
        ]);

        return $service;
    }
}
