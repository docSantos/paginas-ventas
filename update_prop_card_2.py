import re

with open('src/components/casasgaby/PropertyCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update signature
content = content.replace("hasExtraServices?: boolean", "serviciosExtra?: string[]")
content = content.replace("hasExtraServices = false", "serviciosExtra = []")

# Remove top right badge if we want, or keep it. The user said:
# "Justo arriba o debajo de la fila de amenidades ("WiFi", "Aire acondicionado", etc.), agregar una sección o línea destacada"
# I will remove the amber badge from the image corner, as we are displaying it below.
# Ah, I replaced the absolute right badge in the previous script. Let's find it and remove it.
badge_html = """          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <Badge variant="default" className="bg-teal-600 text-white shadow-sm">
              {formatPrice(propiedad.precio_por_noche)}/noche
            </Badge>
            {hasExtraServices && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 shadow-sm border border-amber-200">
                + Servicios extra
              </Badge>
            )}
          </div>"""
badge_html_new = """          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-teal-600 text-white shadow-sm">
              {formatPrice(propiedad.precio_por_noche)}/noche
            </Badge>
          </div>"""
content = content.replace(badge_html, badge_html_new)

# Add the new services layout
amenities_block = """          {amenidadesPreview.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {amenidadesPreview.map((a) => (
                <span key={a} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {getAmenidadIcon(a)} {a}
                </span>
              ))}
              {propiedad.amenidades.length > 3 && (
                <span className="text-xs text-gray-400 py-0.5">
                  +{propiedad.amenidades.length - 3} mǭs
                </span>
              )}
            </div>
          )}"""

extra_services_block = """          {serviciosExtra.length > 0 && (
            <div className="mt-3 bg-amber-50 rounded-lg p-2 border border-amber-100">
              <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide mb-1.5">
                Servicios adicionales disponibles:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {serviciosExtra.map((serv, i) => (
                  <span key={i} className="inline-flex items-center text-xs bg-white text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full shadow-sm">
                    ✨ {serv}
                  </span>
                ))}
              </div>
            </div>
          )}"""

# Replace 'mǭs' to fix encoding while we're at it, but maybe just string inject
content = content.replace(amenities_block, amenities_block + "\n" + extra_services_block)

content = content.replace("mǭs", "más")
content = content.replace("aǧn", "aún")

with open('src/components/casasgaby/PropertyCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
