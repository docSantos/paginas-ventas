import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure to replace the inner fetch body!
pattern = r"(costo_total:\s*cotizacion\.total,\s*monto_apartado:\s*cotizacion\.anticipo)\s*\n\s*\})"
replacement = r"\1,\n            servicios_extra: serviciosExtraPayload\n          })"

content = re.sub(pattern, replacement, content)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
