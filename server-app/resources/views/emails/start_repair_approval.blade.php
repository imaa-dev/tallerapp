<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Aprobación de inicio de reparación</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background-color:#f5f5f5; padding:20px; margin:0;">

<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table width="600" cellpadding="20" cellspacing="0" style="background-color:#ffffff; border-radius:6px;">

                <!-- Encabezado -->
                <tr>
                    <td style="background-color:#3b82f6; color:#ffffff; text-align:center; border-radius:6px 6px 0 0;">
                        <h2 style="margin:0;">🛠 Aprobación de inicio de reparación</h2>
                    </td>
                </tr>

                <!-- Contenido -->
                <tr>
                    <td>
                        <p>Estimado/a <strong>{{ $service->client->name }}</strong>,</p>

                        <p>
                            Su producto <strong>{{ $service->product?->name ?? 'servicio' }}</strong> ha sido
                            recibido en {{ $service->organization?->name ?? 'nuestro taller' }} y estamos listos
                            para comenzar la revisión y reparación.
                        </p>

                        <p>
                            Para iniciar necesitamos su aprobación. Al aprobar, el servicio pasará a la etapa de
                            <strong>diagnóstico</strong>.
                        </p>

                        <hr>

                        <h3>📋 Detalles del servicio</h3>
                        <p>
                            <strong>Cliente:</strong> {{ $service->client->name }}<br>
                            <strong>Producto:</strong> {{ $service->product?->name }} {{ $service->product?->brand }} {{ $service->product?->model }}<br>
                            <strong>N° de servicio:</strong> {{ $service->id }}<br>
                            <strong>Fecha de ingreso:</strong> {{ optional($service->date_entry)->format('d/m/Y') ?? $service->created_at->format('d/m/Y') }}
                        </p>

                        <hr>

                        <p style="text-align:center; margin-top:30px;">
                            <a href="{{ $link }}" style="display:inline-block; background-color:#10b981; color:#ffffff; padding:14px 30px; text-decoration:none; border-radius:6px; font-weight:bold;">
                                Aprobar inicio de reparación
                            </a>
                        </p>

                        <p style="margin-top:30px; text-align:center; font-size:12px; color:#777;">
                            Si no puede ver el botón, copie y pegue este enlace en su navegador:<br>
                            <a href="{{ $link }}" style="color:#3b82f6;">{{ $link }}</a>
                        </p>

                        <p style="margin-top:30px;">
                            Saludos cordiales,<br>
                            <strong>{{ $service->organization?->name ?? config('app.name') }}</strong>
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="text-align:center; font-size:12px; color:#777;">
                        © {{ date('Y') }} {{ $service->organization?->name ?? config('app.name') }}. Todos los derechos reservados.
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
