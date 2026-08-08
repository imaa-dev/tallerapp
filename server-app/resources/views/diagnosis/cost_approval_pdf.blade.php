<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Aprobación de costos</title>
    <style>
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 40px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #222;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header .logo {
            font-size: 20px;
            font-weight: bold;
        }
        .header .info {
            text-align: right;
            font-size: 11px;
        }
        h2 {
            margin-top: 30px;
            font-size: 15px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table th, table td {
            border: 1px solid #ccc;
            padding: 8px;
        }
        table th {
            background: #f2f2f2;
            text-align: left;
        }
        .totales {
            width: 40%;
            float: right;
            margin-top: 10px;
        }
        .totales td {
            text-align: right;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            text-align: center;
            font-size: 10px;
            color: #777;
        }
    </style>
</head>
<body>

<div class="header">
    <div class="logo">
        {{ $servi->organization?->name }}
    </div>
    <div class="info">
        {{ $servi->organization?->description }}
    </div>
</div>

<h2>Datos del Cliente</h2>
<table>
    <tr>
        <th>Nombre</th>
        <td>{{ $servi->client?->name }}</td>
    </tr>
    <tr>
        <th>Producto</th>
        <td>{{ $servi->product?->name }}</td>
    </tr>
    @if ($servi->product?->brand)
        <tr>
            <th>Marca</th>
            <td>{{ $servi->product->brand }}</td>
        </tr>
    @endif
    @if ($servi->product?->model)
        <tr>
            <th>Modelo</th>
            <td>{{ $servi->product->model }}</td>
        </tr>
    @endif
    <tr>
        <th>Fecha de ingreso</th>
        <td>{{ \Illuminate\Support\Carbon::parse($servi->date_entry)->format('d/m/Y') }}</td>
    </tr>
</table>

<h2>Diagnóstico</h2>
@forelse($issues->where('attend', true) as $issue)
    <table>
        <tr>
            <th>Motivo</th>
            <td>{{ $issue->issue }}</td>
        </tr>
        <tr>
            <th>Descripción</th>
            <td>{{ $issue->diagnosis }}</td>
        </tr>
        @if ($issue->repair_time)
            <tr>
                <th>Tiempo estimado de reparación</th>
                <td>{{ $issue->repair_time }}</td>
            </tr>
        @endif
        @if ($issue->cost !== null && $issue->cost !== '')
            <tr>
                <th>Costo del diagnóstico</th>
                <td>${{ number_format((float) $issue->cost, 0, ',', '.') }}</td>
            </tr>
        @endif
    </table>
@empty
    <p>No hay diagnósticos registrados.</p>
@endforelse

@php
    $totalDiagnosis = $issues->sum('cost');
@endphp

@if ($spare_parts && $spare_parts->count() > 0)
    <h2>Repuestos</h2>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Nota</th>
                <th>Precio</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($spare_parts as $index => $spare)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $spare->brand }}</td>
                    <td>{{ $spare->model }}</td>
                    <td>{{ $spare->note }}</td>
                    <td>${{ number_format($spare->price, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    @php
        $totalSpareParts = $spare_parts->sum('price');
    @endphp
@endif

<h2>Total a aprobar</h2>
<table class="totales">
    <tr>
        <th>Total diagnósticos</th>
        <td>${{ number_format($totalDiagnosis, 0, ',', '.') }}</td>
    </tr>
    @if (($spare_parts ?? null) && $spare_parts->count() > 0)
        <tr>
            <th>Total repuestos</th>
            <td>${{ number_format($totalSpareParts, 0, ',', '.') }}</td>
        </tr>
    @endif
    <tr>
        <th>Total</th>
        <td><strong>${{ number_format($total, 0, ',', '.') }}</strong></td>
    </tr>
</table>

<div class="footer">
    Documento generado el {{ now()->format('d/m/Y H:i') }}
</div>

</body>
</html>
