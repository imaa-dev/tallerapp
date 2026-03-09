<?php

namespace App\Http\Controllers;

use App\DTO\CreateServiceDTO;
use App\DTO\UpdateServiceDTO;
use App\Http\Requests\StoreServiceRequest;
use App\Models\Servi;
use App\Services\OrganizationService;
use App\Services\ProductService;
use App\Services\ServiService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiController extends Controller
{
    protected ServiService $serviService;
    protected OrganizationService $organizationService;
    protected ProductService $productService;
    protected UserService $userService;


    public function __construct(
        ServiService $serviService,
        OrganizationService $organizationService,
        ProductService $productService,
        UserService $userService
    )
    {
        $this->serviService = $serviService;
        $this->organizationService = $organizationService;
        $this->productService = $productService;
        $this->userService = $userService;
    }
    public function show(Request $request)
    {
        $countTypeService = [];
        $organization = $this->organizationService->getActive($request->user()->id);
        $notOrganization = true;
        if($organization !== null){
            $notOrganization = false;
            $countTypeService = $this->serviService->getCountTypeService($organization->id);
        }

        return Inertia::render('service/service', [
            'notOrganization' => $notOrganization,
            'countTypeService' => $countTypeService,
        ]);
    }


    public function listDiagnosis(Request $request){
        $result = $this->serviService->getTypeService($request->user()->id, 2);
        return Inertia::render('service/listService', [
            'services' => $result['servis'],
            'title' => 'Diagnostico',
            'statusColor' => 'bg-violet-400',
        ]);
    }

    public function listToSparePart(Request $request){
        $result = $this->serviService->getTypeService($request->user()->id, 3);
        return Inertia::render('service/listService', [
            'services' => $result['servis'],
            'title' => 'Aprovación de repuestos',
            'statusColor' => 'bg-orange-400'
        ]);
    }
    public function listRepair(Request $request)
    {
        $result = $this->serviService->getTypeService($request->user()->id, 4);
        return Inertia::render('service/listService', [
            'services' => $result['servis'],
            'title' => 'En Reparación',
            'statusColor' => 'bg-gray-400'
        ]);
    }
    public function listRepaired(Request $request){
        $result = $this->serviService->getTypeService($request->user()->id, 5);
        return Inertia::render('service/listService', [
            'services' => $result['servis'],
            'title' => 'Reparado',
            'statusColor' => 'bg-blue-400'
        ]);
    }
    public function listReception(Request $request)
    {
        $result = $this->serviService->getTypeService($request->user()->id, 1);
        return Inertia::render('service/listService', [
            'services' => $result['servis'],
            'title' => 'Recepcionando',
            'statusColor' => 'bg-blue-500'
        ]);
    }

    public function listdelivered(Request $request){
        $result = $this->serviService->getTypeService($request->user()->id, 6);
        return Inertia::render('service/listService', [
            'services' => $result['servis'],
            'title' => 'Entregado',
            'statusColor' => 'bg-green-400'
        ]);
    }
    public function listIncident(Request $request){
        $result = $this->serviService->getTypeService($request->user()->id, 7);
        return Inertia::render('service/listService', [
            'services' => $result['servis'],
            'title' => 'Incidencias',
            'statusColor' => 'bg-red-500'
        ]);
    }

    public function create(Request $request)
    {
        $organization = $this->organizationService->getActive($request->user()->id);
        $product = $this->productService->getByOrganization($organization->id);
        $client = $this->userService->listClients($request->user()->id);
        return Inertia::render('service/createServis', [
            'products' => $product,
            'clients' => $client,
        ]);
    }
    public function store(StoreServiceRequest $request)
    {
        $dto = new CreateServiceDTO($request);
        $files = $request->file('file');
        $userId = $request->user()->id;
        $reasonNotes = $request->reason_notes;
        $res = $this->serviService->create($dto, $files, $userId, $reasonNotes);
        session()->flash('message', $res->message);
        return redirect()->route('services.list.reception.view');
    }

    public function getUpdate(Request $request, Servi $servi)
    {
        $serviceFile = $this->serviService->getServiceWithProductClientFileReason($servi->id);
        $organization = $this->organizationService->getActive($request->user()->id);
        $products = $this->productService->getByOrganization($organization->id);
        $clients = $this->userService->listClients($request->user()->id);

        return Inertia::render('service/manageService', [
            'servi' => $serviceFile,
            'clients' => $clients,
            'products' => $products
        ]);
    }

    public function update(StoreServiceRequest $request){;
        $dto = new UpdateServiceDTO($request);
        $res = $this->serviService->update($dto);
        session()->flash('message', $res->message);
        return redirect()->route('services.list.reception.view');
    }

    public function delete(int $id){
        $res = $this->serviService->delete($id);
        return response()->json($res);
    }

    public function toRepaired(Request $request){
        $notify = $request->notification_client;
        $res = $this->serviService->updateStatusServiceNotifyRepair($request->service_id, 4, $notify );
        session()->flash('message', $res->message);
        return redirect()->route('services.list.repair.view');
    }

    public function repairService(Request $request){

        $service_id = $request->service_id;
        $repair_price = $request->repair_price;
        $final_note = $request->final_note;
        $res = $this->serviService->repairServiceNotifyClient($service_id, 5, $repair_price, $final_note);
        session()->flash('message', $res->message);
        return redirect()->route('services.list.repair.view');
    }

    public function toDiagnosis(Request $request){
        $notify = $request->notification_client;
        $res = $this->serviService->updateStatusServiceNotifyInspect($request->service_id, 2, $notify);
        session()->flash('message', $res->message);
        return redirect()->route('service.list.in.diagnosis.view');
    }

    public function toGoBack(Request $request){
        $res = $this->serviService->goBack($request->service_id, $request->status_service_id);
        session()->flash('message', $res->message);
        return redirect()->route('services.view');
    }
    public function toAproveSpareParts(Request $request){
        $res = $this->serviService->updateStatusService($request->id, 3);
        return response()->json($res);
    }
    public function toDelivered(Request $request){
        $res = $this->serviService->updateStatusService($request->service_id, 6);
        session()->flash('message', $res->message);
        return redirect()->route('services.list.delivered.view');
    }
    public function toIncident(Request $request){
        $res = $this->serviService->updateStatusService($request->service_id, 7);
        session()->flash('message', $res->message);
        return redirect()->route('services.list.incident.view');
    }
}
