<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Informe de Reparación</title>
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
        .firma {
            margin-top: 60px;
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
        {{ $data->organization->name  }}
    </div>
    <div class="info">
        {{ $data->organization->description  }}
    </div>
</div>

<h2>Datos del Cliente</h2>
<table>
    <tr>
        <th>Nombre</th>
        <td>{{ $data->client->name }}</td>
    </tr>
    <tr>
        <th>Correo</th>
        <td>{{ $data->client->email }}</td>
    </tr>
    <tr>
        <th>Teléfono</th>
        <td>{{ $data->client->phone }}</td>
    </tr>
</table>

<h2> Servicio </h2>
<table>
    <tr>
        <th>id</th>
        <td> {{ $data->uuid  }} </td>
    </tr>
    <tr>
        <th>Fecha ingreso</th>
        <td>{{ $data->date_entry}}</td>
    </tr>
    <tr>
        <th>Precio</th>
        <td>{{ $data->repair_price }}</td>
    </tr>
    <tr>
        <th>Nota final técnico</th>
        <td>{{ $data->final_note }}</td>
    </tr>
</table>
<h2>Razones de ingreso servicio</h2>

<table>
    <thead>
    <tr>
        <th>#</th>
        <th>Motivo</th>
        <th>Atendido</th>
    </tr>
    </thead>
    <tbody>
    @forelse($data->reasons as $index => $reason)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $reason->reason_note }}</td>
            <td>{{ $reason->attend ? 'Sí' : 'No' }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="3">No hay motivos registrados</td>
        </tr>
    @endforelse
    </tbody>
</table>

<h2>Diagnóstico</h2>

<h2>Avances Realizados</h2>
<table>
    <thead>
    <tr>
        <th>Fecha</th>
        <th>Descripción</th>
        <th>Tiempo que tardo el diagnostico</th>
        <th>Precio diagnostico</th>
    </tr>
    </thead>
    <tbody>
    @forelse($data->diagnosis as $diagnos)
        <tr>
            <td>{{ $diagnos->created_at->format('d/m/Y') }}</td>
            <td>{{ $diagnos->diagnosis }}</td>
            <td>{{ $diagnos->repair_time }}</td>
            <td>{{ $diagnos->cost }}</td>

        </tr>
        @empty
            <tr>
                <td colspan="3">No hay diagnosticos registrados</td>
            </tr>
        @endforelse
    </tbody>
</table>
<h2> Recibo </h2>

<h2> imagenes  </h2>

@foreach($data->file as $file)
    <img src="{{ public_path('storage/' . $file->path) }}" width="250">
@endforeach

<div class="footer">
    Documento generado el {{ now()->format('d/m/Y H:i') }}
</div>

</body>
</html>
