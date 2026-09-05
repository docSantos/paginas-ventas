import re

# 1. FIX PAGE FETCH
with open('src/app/casasgaby/propiedad/[id]/page.tsx', 'r', encoding='utf-8') as f:
    page_content = f.read()

# Replace the query in page.tsx
old_query = """          // 4. Fetch servicios extra
          const { data: psData, error: psError } = await db
            .from('propiedad_servicios')
            .select(`
              servicio_id,
              catalogo_servicios (*)
            `)
            .eq('propiedad_id', id)
            .eq('disponible', true)"""

new_query = """          // 4. Fetch servicios extra
          const { data: psData, error: psError } = await db
            .from('propiedad_servicios')
            .select('id, servicio_id, catalogo_servicios(*)')
            .eq('propiedad_id', id)
            .eq('disponible', true)"""

page_content = page_content.replace(old_query, new_query)

with open('src/app/casasgaby/propiedad/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_content)


# 2. FIX PROPERTY DETAIL CLIENT
with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    client_content = f.read()

# Add console.log if missing
if "console.log('Servicios recibidos en cliente'" not in client_content:
    client_content = client_content.replace(
        "adminPhone, servicios = [] }: PropertyDetailClientProps) {",
        "adminPhone, servicios = [] }: PropertyDetailClientProps) {\n  console.log('Servicios recibidos en cliente:', servicios);"
    )

# Fix cotizacion useMemo to include extrasTotal!
old_cotizacion_block = r"const { total, breakdown, anticipo } = calculateStayTotal\([\s\S]*?\)\s*return \{ noches, total, breakdown, anticipo \}"

new_cotizacion_block = """let extrasTotal = 0;
    Object.keys(selectedExtras).forEach(servId => {
      const serv = servicios.find((s: any) => s.id === servId);
      const val = selectedExtras[servId];
      if (serv && val && val.activo) {
        if (serv.tipo_tarifa === 'por_dia') {
          extrasTotal += Number(serv.precio_base) * (val.qty || 1);
        } else if (serv.tipo_tarifa === 'por_trayecto') {
          let count = 0;
          if (val.ida) count++;
          if (val.vuelta) count++;
          extrasTotal += Number(serv.precio_base) * count;
        } else {
          extrasTotal += Number(serv.precio_base);
        }
      }
    });

    const { total, breakdown, anticipo } = calculateStayTotal(
      noches, 
      propiedad.precio_por_noche, 
      propiedad.precio_por_semana || undefined, 
      propiedad.precio_por_mes || undefined
    )

    const finalTotal = total + extrasTotal;
    const finalAnticipo = finalTotal / 2;

    return { noches, total: finalTotal, breakdown, anticipo: finalAnticipo, extrasTotal }"""

if "extrasTotal = 0;" not in client_content:
    client_content = re.sub(old_cotizacion_block, new_cotizacion_block, client_content)

# We must also ensure the dependency array of useMemo includes `selectedExtras, servicios`!
old_deps = r"\}, \[fechaEntrada, fechaSalida, propiedad\.precio_por_noche, propiedad\.precio_por_semana, propiedad\.precio_por_mes, reservas\]\)"
new_deps = "}, [fechaEntrada, fechaSalida, propiedad.precio_por_noche, propiedad.precio_por_semana, propiedad.precio_por_mes, reservas, selectedExtras, servicios])"
client_content = re.sub(old_deps, new_deps, client_content)


# And make sure `{servicios && servicios.length > 0 && (` is exactly below the guests!
# It is! The user also requested: "Si tipo_tarifa viene nulo o no coincide con 'por_dia' ni 'por_trayecto', debe hacer fallback al comportamiento estándar (checkbox fijo con su precio_base)."
# In the current code: `{serv.tipo_tarifa !== 'por_trayecto' && ( <input type="checkbox" ...` which works for both 'por_dia' and 'fijo' and null.
# 'por_dia' has subcontrols, and 'fijo' doesn't.
# If it is 'por_dia', it renders `<div className="ml-7 flex items-center justify-between gap-3...`. If null/fijo, it doesn't. That handles fallback perfectly.

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(client_content)
