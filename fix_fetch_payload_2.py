with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

find_body = """            costo_total: cotizacion.total,
            monto_apartado: cotizacion.anticipo
          })"""
replace_body = """            costo_total: cotizacion.total,
            monto_apartado: cotizacion.anticipo,
            servicios_extra: serviciosExtraPayload
          })"""

if replace_body not in content:
    content = content.replace(find_body, replace_body)

fetch_find = "await fetch('/api/solicitudes'"
fetch_replace = """console.log('PAYLOAD A ENVIAR:', {
          propiedad_id: propiedad.id,
          titulo_propiedad: propiedad.titulo,
          nombre_cliente: formData.nombre,
          telefono: `${lada}${formData.telefono.replace(/\\D/g, '')}`,
          email: formData.correo,
          fecha_entrada: fechaEntrada,
          fecha_salida: fechaSalida,
          num_huespedes: huespedes,
          noches: cotizacion.noches,
          costo_total: cotizacion.total,
          monto_apartado: cotizacion.anticipo,
          servicios_extra: serviciosExtraPayload
        });
        await fetch('/api/solicitudes'"""

if "PAYLOAD A ENVIAR" not in content:
    content = content.replace(fetch_find, fetch_replace)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
