import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Mes Actual Card
content = re.sub(
    r'(<div className="text-xl font-bold text-red-700">\{formatPrice\(metrics\.totalCurrent\)\}</div>)',
    r'\1\n                <p className="text-xs text-red-500/80 font-medium mt-1">{metrics.freeNightsCurrent} noches libres restantes</p>',
    content
)

# Replace Meses Siguientes Card
content = re.sub(
    r'(<div className="text-xl font-bold text-gray-800">\{formatPrice\(metrics\.totalFuture\)\}</div>)',
    r'\1\n                <p className="text-xs text-gray-400 font-medium mt-1">{metrics.freeNightsFuture} noches por reservar</p>',
    content
)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
