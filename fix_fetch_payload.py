import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify if serviciosExtraPayload is built
if "const serviciosExtraPayload" in content:
    # Use regex to replace the JSON.stringify body safely
    pattern = r"monto_apartado:\s*cotizacion\.anticipo\s*\n\s*\})"
    replacement = "monto_apartado: cotizacion.anticipo,\n            servicios_extra: serviciosExtraPayload\n          })"
    
    if "servicios_extra: serviciosExtraPayload" not in content:
        content = re.sub(pattern, replacement, content)
        
        # Add a console log just before the fetch!
        if "console.log('PAYLOAD A ENVIAR'" not in content:
            fetch_pattern = r"await fetch\('/api/solicitudes'"
            fetch_replacement = "console.log('PAYLOAD A ENVIAR:', {\n          propiedad_id: propiedad.id,\n          titulo_propiedad: propiedad.titulo,\n          nombre_cliente: formData.nombre,\n          telefono: `${lada}${formData.telefono.replace(/\\D/g, '')}`,\n          email: formData.correo,\n          fecha_entrada: fechaEntrada,\n          fecha_salida: fechaSalida,\n          num_huespedes: huespedes,\n          noches: cotizacion.noches,\n          costo_total: cotizacion.total,\n          monto_apartado: cotizacion.anticipo,\n          servicios_extra: serviciosExtraPayload\n        });\n\n        await fetch('/api/solicitudes'"
            content = re.sub(fetch_pattern, fetch_replacement, content)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
