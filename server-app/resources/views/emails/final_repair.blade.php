<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reparación finalizada</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background-color:#f5f5f5; padding:20px; margin:0;">

<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table width="600" cellpadding="20" cellspacing="0" style="background-color:#ffffff; border-radius:6px;">

                <!-- Encabezado -->
                <tr>
                    <td style="background-color:#10b981; color:#ffffff; text-align:center; border-radius:6px 6px 0 0;">
                        <h2 style="margin:0;">🔧 Reparación finalizada</h2>
                    </td>
                </tr>

                <!-- Contenido -->
                <tr>
                    <td>
                        <p>Estimado/a <strong>{{ $service->client->name }}</strong>,</p>

                        <p>
                            Su <strong>{{ $service->product?->name ?? 'servicio' }}</strong> ha sido reparado
                            satisfactoriamente en <strong>{{ $service->organization?->name ?? 'nuestro taller' }}</strong>.
                        </p>

                        <p>
                            Puede ver el detalle completo de la reparación, incluyendo los trabajos realizados,
                            repuestos utilizados y el costo total.
                        </p>

                        <hr>

                        <h3>📋 Detalles del servicio</h3>
                        <p>
                            <strong>Cliente:</strong> {{ $service->client->name }}<br>
                            <strong>Producto:</strong> {{ $service->product?->name }} {{ $service->product?->brand }} {{ $service->product?->model }}<br>
                            <strong>N° de servicio:</strong> {{ $service->id }}
                        </p>

                        <hr>

                        <p style="text-align:center; margin-top:30px;">
                            <a href="{{ $link }}" style="display:inline-block; background-color:#10b981; color:#ffffff; padding:14px 30px; text-decoration:none; border-radius:6px; font-weight:bold;">
                                Ver detalle de reparación
                            </a>
                        </p>

                        <p style="margin-top:30px; text-align:center; font-size:12px; color:#777;">
                            Si no puede ver el botón, copie y pegue este enlace en su navegador:<br>
                            <a href="{{ $link }}" style="color:#10b981;">{{ $link }}</a>
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
