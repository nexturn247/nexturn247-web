import sqlite3

conn = sqlite3.connect('mi_base_de_datos.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
)
''')

cursor.execute("INSERT INTO usuarios (nombre, email) VALUES ('Matias', 'matias@email.com')")
cursor.execute("INSERT INTO usuarios (nombre, email) VALUES ('Juan', 'juan@email.com')")
cursor.execute("INSERT INTO usuarios (nombre, email) VALUES ('Ana', 'ana@email.com')")

conn.commit()
conn.close()

print("✅ Base de datos creada exitosamente con datos de prueba")