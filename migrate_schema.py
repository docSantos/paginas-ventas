import re
import glob

# 1. Update database.ts to rename "public:" to "hospedaje:" and add empty "central:"
with open('src/types/database.ts', 'r', encoding='utf-8') as f:
    db_types = f.read()

# Replace public: with hospedaje:
db_types = re.sub(r'\bpublic: \{', 'hospedaje: {', db_types, count=1)

# Add central
db_types = re.sub(r'hospedaje: \{', 'central: {\n    Tables: {\n      transacciones_comisiones: {\n        Row: {\n          id: string\n          created_at: string\n          tenant_id: string\n          origen_modulo: string\n          referencia_id: string\n          concepto: string | null\n          monto_total: number\n          porcentaje_comision: number\n          monto_comision: number\n          estado: string\n        }\n        Insert: any\n        Update: any\n      }\n    }\n  },\n  hospedaje: {', db_types, count=1)

with open('src/types/database.ts', 'w', encoding='utf-8') as f:
    f.write(db_types)


# 2. Update .from( calls in .ts and .tsx files
files = glob.glob('src/**/*.ts', recursive=True) + glob.glob('src/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace .from( with .schema('hospedaje').from( 
    # but ONLY if it's not already schema('hospedaje').from(
    # and ONLY for tables that belong to hospedaje.
    # The user said "Actualiza todas las consultas existentes".
    
    # Let's do a safe replacement of `.from(` ignoring those preceded by `.schema(`
    new_content = re.sub(r'(?<!\.schema\(\'hospedaje\'\))\.from\(', ".schema('hospedaje').from(", content)
    
    if content != new_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
