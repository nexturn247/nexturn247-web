#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from datetime import datetime
from flask import Flask, request, jsonify
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Archivo donde se guardarán los turnos
TURNOS_FILE = 'turnos.json'

def cargar_turnos():
    """Carga los turnos existentes desde el archivo JSON"""
    if os.path.exists(TURNOS_FILE):
        try:
            with open(TURNOS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            logger.warning(f"Error al leer {TURNOS_FILE}, creando archivo nuevo")
            return []
    return []

def guardar_turnos(turnos):
    """Guarda la lista de turnos en el archivo JSON"""
    try:
        with open(TURNOS_FILE, 'w', encoding='utf-8') as f:
            json.dump(turnos, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        logger.error(f"Error al guardar turnos: {e}")
        return False

def validar_datos_turno(data):
    """Valida que los datos del turno sean correctos"""
    campos_requeridos = ['nombre', 'diagnostico', 'dia', 'horario']
    
    for campo in campos_requeridos:
        if campo not in data or not data[campo]:
            return False, f"Campo requerido faltante: {campo}"
    
    return True, "Datos válidos"

@app.route('/webhook/turno', methods=['POST'])
def recibir_turno():
    """Endpoint para recibir datos del turno desde Integrately"""
    try:
        # Obtener datos del webhook
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No se recibieron datos',
                'status': 'error'
            }), 400
        
        logger.info(f"Datos recibidos: {data}")
        
        # Validar datos
        es_valido, mensaje = validar_datos_turno(data)
        if not es_valido:
            return jsonify({
                'error': mensaje,
                'status': 'error'
            }), 400
        
        # Cargar turnos existentes
        turnos = cargar_turnos()
        
        # Crear nuevo turno con timestamp
        nuevo_turno = {
            'id': len(turnos) + 1,
            'nombre': data['nombre'].strip(),
            'diagnostico': data['diagnostico'].strip(),
            'dia': data['dia'].strip(),
            'horario': data['horario'].strip(),
            'fecha_registro': datetime.now().isoformat(),
            'estado': 'pendiente'
        }
        
        # Agregar campos adicionales si existen
        campos_opcionales = ['telefono', 'email', 'notas', 'edad']
        for campo in campos_opcionales:
            if campo in data and data[campo]:
                nuevo_turno[campo] = data[campo].strip()
        
        # Agregar el nuevo turno a la lista
        turnos.append(nuevo_turno)
        
        # Guardar en archivo
        if guardar_turnos(turnos):
            logger.info(f"Turno guardado exitosamente: {nuevo_turno['nombre']} - {nuevo_turno['dia']} {nuevo_turno['horario']}")
            
            return jsonify({
                'message': 'Turno guardado exitosamente',
                'status': 'success',
                'turno_id': nuevo_turno['id'],
                'total_turnos': len(turnos)
            }), 200
        else:
            return jsonify({
                'error': 'Error al guardar el turno',
                'status': 'error'
            }), 500
            
    except Exception as e:
        logger.error(f"Error procesando webhook: {e}")
        return jsonify({
            'error': f'Error interno del servidor: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/turnos', methods=['GET'])
def listar_turnos():
    """Endpoint para listar todos los turnos (opcional para debugging)"""
    try:
        turnos = cargar_turnos()
        return jsonify({
            'turnos': turnos,
            'total': len(turnos),
            'status': 'success'
        }), 200
    except Exception as e:
        return jsonify({
            'error': f'Error al obtener turnos: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de salud para verificar que el servidor funciona"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'webhook-turnos'
    }), 200

if __name__ == '__main__':
    # Crear archivo de turnos vacío si no existe
    if not os.path.exists(TURNOS_FILE):
        guardar_turnos([])
        logger.info(f"Archivo {TURNOS_FILE} creado")
    
    # Ejecutar servidor
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)