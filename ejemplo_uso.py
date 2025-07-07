#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json

# URL de tu servidor (cambiar por la URL real)
WEBHOOK_URL = "http://localhost:5000/webhook/turno"

# Ejemplo de datos que enviará Integrately
ejemplo_turno = {
    "nombre": "Juan Pérez",
    "diagnostico": "Consulta general",
    "dia": "2025-01-15",
    "horario": "14:30",
    "telefono": "+541122334455",
    "email": "juan@email.com",
    "notas": "Primera consulta"
}

def probar_webhook():
    """Función para probar el webhook localmente"""
    try:
        response = requests.post(
            WEBHOOK_URL,
            json=ejemplo_turno,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Respuesta: {response.json()}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    probar_webhook()