import os
import re

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = "t.created_at ? format(parseISO(t.created_at), 'dd MMM yyyy HH:mm', { locale: es }) : 'Reciente'"
replacement = "(t.created_at || t.fecha) ? format(parseISO(t.created_at || t.fecha || new Date().toISOString()), 'dd MMM yyyy HH:mm', { locale: es }) : 'Reciente'"

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced second parseISO correctly")
else:
    print("Target not found")
