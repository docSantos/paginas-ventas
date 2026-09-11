import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "const comisionBaseCalculada =" in line and "tasaBase" in line:
        if i > 800: # We are in eliminarAjusteReserva
            # Inject rule fetch if not present
            found_fetch = False
            for j in range(i-10, i):
                if j >= 0 and "reglas_comisiones" in lines[j]:
                    found_fetch = True
                    break
            
            if not found_fetch:
                fetch_code = "    const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_base').eq('modulo', 'hospedaje').eq('activo', true).maybeSingle();\n    const tasaBase = regla ? Number(regla.porcentaje_base) / 100 : 0.025;\n"
                lines.insert(i, fetch_code)
                break

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Fixed missing tasaBase")
