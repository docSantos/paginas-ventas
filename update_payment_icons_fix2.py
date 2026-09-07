import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    r"{m === \'Transferencia\' ? <ArrowRightLeft className=\"w-4 h-4 mr-2 inline\" /> : <Banknote className=\"w-4 h-4 mr-2 inline\" />} {m}",
    '{m === \'Transferencia\' ? <ArrowRightLeft className="w-4 h-4 mr-2 inline" /> : <Banknote className="w-4 h-4 mr-2 inline" />} {m}'
)

# wait, the above line in python `'{m === \'Transferencia\'}'` string literal evaluates to `{m === 'Transferencia'}`.
# But I probably matched `r"{m === \'Transferencia\' ...}"` and replaced it with `'{m === \\'Transferencia\\' ...}'` previously!
# Let me just replace the exact literal string.
