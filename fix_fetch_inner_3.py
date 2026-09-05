with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "monto_apartado: cotizacion.anticipo" in line and "servicios_extra:" not in line:
        if i + 1 < len(lines) and "})" in lines[i+1]:
            # Found the exact spot
            lines[i] = line.replace("cotizacion.anticipo", "cotizacion.anticipo,")
            lines.insert(i+1, "            servicios_extra: serviciosExtraPayload\n")
            break

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
