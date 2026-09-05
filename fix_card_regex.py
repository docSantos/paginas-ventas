import re

with open('src/components/casasgaby/PropertyCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update signature
content = re.sub(r'hasExtraServices\?:\s*boolean', 'serviciosExtra?: string[]', content)
content = re.sub(r'hasExtraServices\s*=\s*false', 'serviciosExtra = []', content)

# Remove the amber badge if it exists
badge_to_remove = r'\{\s*hasExtraServices\s*&&\s*\(\s*<Badge[^>]+>\s*\+\s*Servicios extra\s*</Badge>\s*\)\s*\}'
content = re.sub(badge_to_remove, '', content)

extra_services_block = """

          {serviciosExtra.length > 0 && (
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
          )}
"""

# Insert before CTA
cta_block = r'\{\/\*\s*CTA\s*\*\/\s*\}'
content = re.sub(cta_block, extra_services_block + '\n          {/* CTA */}', content)

content = content.replace("mǭs", "más")
content = content.replace("aǧn", "aún")

with open('src/components/casasgaby/PropertyCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
