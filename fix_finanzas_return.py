import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_ret = "return { totalPast, totalCurrent, totalFuture, totalYearLost, propertyRows, daysInView }"
new_ret = "return { totalPast, totalCurrent, totalFuture, totalYearLost, propertyRows, daysInView, freeNightsCurrent, freeNightsFuture }"

content = content.replace(old_ret, new_ret)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
