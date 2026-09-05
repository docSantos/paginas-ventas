import re

with open('src/components/casasgaby/PropertyCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "interface PropertyCardProps {\n  propiedad: Propiedad\n}",
    "interface PropertyCardProps {\n  propiedad: Propiedad\n  hasExtraServices?: boolean\n}"
)

content = content.replace(
    "export function PropertyCard({ propiedad }: PropertyCardProps) {",
    "export function PropertyCard({ propiedad, hasExtraServices = false }: PropertyCardProps) {"
)

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

content = content.replace(
    """          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-teal-600 text-white shadow-sm">
              {formatPrice(propiedad.precio_por_noche)}/noche
            </Badge>
          </div>""",
    badge_html
)
content = content.replace("aǧn", "aún")

with open('src/components/casasgaby/PropertyCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
