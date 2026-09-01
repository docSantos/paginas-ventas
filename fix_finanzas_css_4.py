import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Meses Pasados
content = re.sub(
    r'<div className="text-xl font-bold text-gray-800">\{formatPrice\(metrics\.totalPast\)\}</div>',
    '<div className="text-base sm:text-lg tracking-tight font-bold text-gray-800 truncate">{formatLargePrice(metrics.totalPast)}</div>',
    content
)

# Replace Mes Actual
content = re.sub(
    r'<div className="text-xl font-bold text-red-700">\{formatPrice\(metrics\.totalCurrent\)\}</div>',
    '<div className="text-base sm:text-lg tracking-tight font-bold text-red-700 truncate">{formatLargePrice(metrics.totalCurrent)}</div>',
    content
)

# Replace Meses Siguientes
content = re.sub(
    r'<div className="text-xl font-bold text-gray-800">\{formatPrice\(metrics\.totalFuture\)\}</div>',
    '<div className="text-base sm:text-lg tracking-tight font-bold text-gray-800 truncate">{formatLargePrice(metrics.totalFuture)}</div>',
    content
)

# Replace Total del Año (just in case it was missed, though it seemed to work)
content = re.sub(
    r'<div className="text-xl font-black text-gray-900">\{formatPrice\(metrics\.totalYearLost\)\}</div>',
    '<div className="text-base sm:text-lg tracking-tight font-black text-gray-900 truncate">{formatLargePrice(metrics.totalYearLost)}</div>',
    content
)

# Update padding of the 4 cards (from pt-4 to p-2.5 sm:p-3.5)
# Note: we need to ONLY replace the ones in the Costo de Oportunidad section to be safe, 
# or all of them. The user said: "Ajusta el padding interno de las tarjetas a p-2.5 sm:p-3.5." for the Costo de oportunidad.
content = content.replace('<CardContent className="pt-4">', '<CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center min-w-0">')

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
