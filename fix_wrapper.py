import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'\{\!isCerrada && \(\s*(<div className="flex flex-wrap gap-2 mt-1 pt-2 border-t">.*?</div>)\s*\)\}',
    r'\1',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'(<button\s*onClick=\{\(\) => handleWhatsAppAndAdvance\(s\)\}.*?</button>)',
    r'{!isCerrada && (\1)}',
    content,
    flags=re.DOTALL
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
