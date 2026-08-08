<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Diagnóstico del servicio</title>
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
        .images {
            margin-top: 10px;
        }
        .images img {
            width: 150px;
            border: 1px solid #ccc;
            margin: 0 5px 5px 0;
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

<h2>Motivo de ingreso</h2>
<table>
    <tr>
        <th>Detalle</th>
        <td>{{ $issue->issue }}</td>
    </tr>
</table>

<h2>Diagnóstico</h2>
<table>
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

@if ($servi->file && $servi->file->count() > 0)
    <h2>Imágenes</h2>
    <div class="images">
        @foreach ($servi->file as $file)
            <img src="{{ public_path('storage/' . $file->path) }}" width="150">
        @endforeach
    </div>
@endif

<div class="footer">
    Documento generado el {{ now()->format('d/m/Y H:i') }}
</div>

</body>
</html>
