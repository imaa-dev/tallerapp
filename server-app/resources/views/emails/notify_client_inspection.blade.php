<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Servicio en inspección</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background-color:#f5f5f5; padding:20px;">

<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table width="600" cellpadding="20" cellspacing="0" style="background-color:#ffffff; border-radius:6px;">

                <!-- Encabezado -->
                <tr>
                    <td style="background-color:#ffc107; color:#000000; text-align:center; border-radius:6px 6px 0 0;">
                        <h2 style="margin:0;">🔍 Servicio en inspección</h2>
                    </td>
                </tr>

                <!-- Contenido -->
                <tr>
                    <td>
                        <p>Estimado/a <strong>{{ $service->client->name }}</strong>,</p>

                        <p>
                            Le informamos que su servicio de reparación ha ingresado a la etapa de
                            <strong>inspección</strong>.
                        </p>

                        <p>
                            En esta fase realizamos la revisión técnica del equipo para determinar
                            el diagnóstico y los pasos a seguir.
                        </p>

                        <hr>

                        <!-- Datos del cliente -->
                        <h3>👤 Datos del cliente</h3>
                        <p>
                            <strong>Nombre:</strong> {{ $service->client->name }}<br>
                            <strong>Email:</strong> {{ $service->client->email }}<br>
                            <strong>Teléfono:</strong> {{ $service->client->phone }}
                        </p>

                        <hr>

                        <!-- Datos del servicio -->
                        <h3>🛠 Detalles del servicio</h3>
                        <p>
                            <strong>N° de servicio:</strong> {{ $service->id }}<br>
                            <strong>Estado actual:</strong> Inspección<br>
                            <strong>Fecha de ingreso:</strong> {{ $service->created_at->format('d/m/Y') }}
                        </p>

                        <hr>

                        <p>
                            Una vez finalizada la inspección, nos comunicaremos con usted para
                            informarle el diagnóstico y presupuesto correspondiente.
                        </p>

                        <p style="margin-top:30px;">
                            Saludos cordiales,<br>
                            <strong>{{ config('app.name') }}</strong>
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="text-align:center; font-size:12px; color:#777;">
                        © {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
