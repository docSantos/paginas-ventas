import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Current month card
old_current_card = """            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="pt-4">
                <div className="text-sm text-red-600 font-medium mb-1">Mes Actual</div>
                <div className="text-xl font-bold text-red-700">{formatPrice(metrics.totalCurrent)}</div>
              </CardContent>
            </Card>"""

new_current_card = """            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="pt-4">
                <div className="text-sm text-red-600 font-medium mb-1">Mes Actual</div>
                <div className="text-xl font-bold text-red-700">{formatPrice(metrics.totalCurrent)}</div>
                <div className="text-xs font-medium text-red-500/80 mt-1">{metrics.freeNightsCurrent} noches libres restantes</div>
              </CardContent>
            </Card>"""

# Future months card
old_future_card = """            <Card className="border-gray-200">
              <CardContent className="pt-4">
                <div className="text-sm text-gray-500 mb-1">Meses Siguientes</div>
                <div className="text-xl font-bold text-gray-800">{formatPrice(metrics.totalFuture)}</div>
              </CardContent>
            </Card>"""

new_future_card = """            <Card className="border-gray-200">
              <CardContent className="pt-4">
                <div className="text-sm text-gray-500 mb-1">Meses Siguientes</div>
                <div className="text-xl font-bold text-gray-800">{formatPrice(metrics.totalFuture)}</div>
                <div className="text-xs text-gray-400 mt-1">{metrics.freeNightsFuture} noches por reservar</div>
              </CardContent>
            </Card>"""

content = content.replace(old_current_card, new_current_card)
content = content.replace(old_future_card, new_future_card)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
