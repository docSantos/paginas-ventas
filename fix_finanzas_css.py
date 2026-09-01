import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add formatLargePrice helper
if "const formatLargePrice" not in content:
    helper = """
  const formatLargePrice = (price: number) => {
    const formatted = formatPrice(price);
    return formatted.replace('\\xa0', ' ').replace('.00', '');
  }
"""
    # Insert it right after `export function FinanzasClient... {`
    content = re.sub(r'(export function FinanzasClient[^\{]+\{\n)', r'\1' + helper, content)

# 1. Update Grid
old_grid = '<div className="grid grid-cols-2 md:grid-cols-4 gap-4">'
new_grid = '<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">'
content = content.replace(old_grid, new_grid)

# 2. Update Cards content
# We will use regex to find the four cards and update their classes
# Meses Pasados
content = re.sub(
    r'<CardContent className="pt-4">\s*<div className="text-sm text-gray-500 mb-1">Meses Pasados</div>\s*<div className="text-xl font-bold text-gray-800">\{formatPrice\(metrics\.totalPast\)\}</div>',
    '<CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center min-w-0">\n                <div className="text-xs sm:text-sm text-gray-500 mb-1 truncate">Meses Pasados</div>\n                <div className="text-base sm:text-lg tracking-tight font-bold text-gray-800 truncate">{formatLargePrice(metrics.totalPast)}</div>',
    content
)

# Mes Actual
content = re.sub(
    r'<CardContent className="pt-4">\s*<div className="text-sm text-red-600 font-medium mb-1">Mes Actual</div>\s*<div className="text-xl font-bold text-red-700">\{formatPrice\(metrics\.totalCurrent\)\}</div>',
    '<CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center min-w-0">\n                <div className="text-xs sm:text-sm text-red-600 font-medium mb-1 truncate">Mes Actual</div>\n                <div className="text-base sm:text-lg tracking-tight font-bold text-red-700 truncate">{formatLargePrice(metrics.totalCurrent)}</div>',
    content
)

# Meses Siguientes
content = re.sub(
    r'<CardContent className="pt-4">\s*<div className="text-sm text-gray-500 mb-1">Meses Siguientes</div>\s*<div className="text-xl font-bold text-gray-800">\{formatPrice\(metrics\.totalFuture\)\}</div>',
    '<CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center min-w-0">\n                <div className="text-xs sm:text-sm text-gray-500 mb-1 truncate">Meses Siguientes</div>\n                <div className="text-base sm:text-lg tracking-tight font-bold text-gray-800 truncate">{formatLargePrice(metrics.totalFuture)}</div>',
    content
)

# Total del Año
content = re.sub(
    r'<CardContent className="pt-4">\s*<div className="text-sm text-gray-600 font-bold mb-1">Total del A[ñ]o</div>\s*<div className="text-xl font-black text-gray-900">\{formatPrice\(metrics\.totalYearLost\)\}</div>',
    '<CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center min-w-0">\n                <div className="text-xs sm:text-sm text-gray-600 font-bold mb-1 truncate">Total del Año</div>\n                <div className="text-base sm:text-lg tracking-tight font-black text-gray-900 truncate">{formatLargePrice(metrics.totalYearLost)}</div>',
    content
)

# Also ensure freeNights are truncate just in case
content = content.replace('className="text-xs text-red-500/80 font-medium mt-1"', 'className="text-[10px] sm:text-xs text-red-500/80 font-medium mt-1 truncate"')
content = content.replace('className="text-xs text-gray-400 font-medium mt-1"', 'className="text-[10px] sm:text-xs text-gray-400 font-medium mt-1 truncate"')

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
