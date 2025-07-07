# Sistema de Webhook para Turnos

Este sistema recibe datos de turnos desde Integrately y los guarda automáticamente en un archivo JSON.

## Archivos incluidos

- `guardar_turno.py` - Script principal del webhook
- `requirements.txt` - Dependencias de Python
- `ejemplo_uso.py` - Script para probar el webhook
- `turnos.json` - Se crea automáticamente para guardar los turnos

## Instalación

1. Instalar dependencias:
```bash
pip install -r requirements.txt
```

2. Ejecutar el servidor:
```bash
python guardar_turno.py
```

## Configuración en Integrately

**URL del Webhook:** `http://tu-servidor.com/webhook/turno`
**Método:** POST
**Content-Type:** application/json

### Datos requeridos:
- `nombre` (string) - Nombre del paciente
- `diagnostico` (string) - Diagnóstico o motivo de consulta
- `dia` (string) - Fecha del turno (formato: YYYY-MM-DD)
- `horario` (string) - Hora del turno (formato: HH:MM)

### Datos opcionales:
- `telefono` (string) - Teléfono del paciente
- `email` (string) - Email del paciente
- `notas` (string) - Notas adicionales
- `edad` (string/number) - Edad del paciente

## Ejemplo de JSON que debe enviar Integrately:

```json
{
  "nombre": "Juan Pérez",
  "diagnostico": "Consulta general",
  "dia": "2025-01-15",
  "horario": "14:30",
  "telefono": "+541122334455",
  "email": "juan@email.com",
  "notas": "Primera consulta"
}
```

## Endpoints disponibles

- `POST /webhook/turno` - Recibe y guarda nuevos turnos
- `GET /turnos` - Lista todos los turnos guardados
- `GET /health` - Verifica el estado del servidor

## Estructura del archivo turnos.json

```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "diagnostico": "Consulta general",
    "dia": "2025-01-15",
    "horario": "14:30",
    "telefono": "+541122334455",
    "email": "juan@email.com",
    "notas": "Primera consulta",
    "fecha_registro": "2025-01-10T10:30:00.123456",
    "estado": "pendiente"
  }
]
```

## Despliegue en servidor

Para producción, usar gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 guardar_turno:app
```