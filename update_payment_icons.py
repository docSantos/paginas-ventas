import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the payment methods emojis line
# The line looks like: {m === 'Transferencia' ? '🏦' : '💵'} {m}
# Or with some weird characters. Let's just find the pattern.
content = re.sub(
    r'\{m === \'Transferencia\' \?.*?\} \{m\}',
    r'{m === \'Transferencia\' ? <ArrowRightLeft className="w-4 h-4 mr-2 inline" /> : <Banknote className="w-4 h-4 mr-2 inline" />} {m}',
    content
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
