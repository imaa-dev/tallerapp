# Cambio de navegación — Servicios

Se reemplazó el Bottom Tab Navigator del módulo **Servicios** por esta estructura:

```text
Drawer
└── Servicios
    └── Stack
        ├── Estados del servicio (tabs superiores horizontales)
        │   ├── Recepción
        │   ├── Diagnóstico
        │   ├── Repuestos
        │   ├── Aprobación
        │   ├── En reparación
        │   ├── Reparados
        │   └── Entregados
        └── Crear servicio
```

## Cambios principales

- `src/app/(protected)/(servicios)/_layout.tsx` ahora usa `Stack`.
- El antiguo formulario `index.tsx` fue movido a `create.tsx`.
- `index.tsx` ahora redirige a `recepcionados` al entrar desde el Drawer.
- Se agregó `ServiceStatusTabs.tsx` para navegar horizontalmente entre estados.
- Se agregó `ServiceStatusScaffold.tsx` con el botón flotante `+`.
- El botón `+` abre `create.tsx` dentro del Stack.
- El formulario de creación tiene botón de regreso.
- Al crear correctamente un servicio, se actualizan los queries y se vuelve a Recepción.
- Se aumentó el padding inferior de las listas para que el FAB no tape la última tarjeta.

Las tabs de **Configuración** no fueron modificadas.
