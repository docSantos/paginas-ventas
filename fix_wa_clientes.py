import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if "buildWaUrl" not in content:
    content = content.replace("import { formatPrice, formatDateEs, formatPhoneWithFlag } from '@/lib/utils'",
                              "import { formatPrice, formatDateEs, formatPhoneWithFlag, buildWaUrl, formatPhoneWithFlagObj } from '@/lib/utils'")

# Replace display formatting in list
content = content.replace("formatPhoneWithFlag(cliente.telefono)", "formatPhoneWithFlagObj((cliente as any).codigo_pais, cliente.telefono)")

# Replace WA link builder
wa_block_old = r"""let waLink = '#'
              if \(numeroLimpiado\) \{
                const code = numeroLimpiado\.length === 10 \? '52' : '' 
                waLink = `https://wa\.me/\$\{numeroLimpiado\.startsWith\('52'\) \? numeroLimpiado : code \+ numeroLimpiado\}`
              \}"""

wa_block_new = """let waLink = '#'
              if (cliente.telefono) {
                waLink = buildWaUrl((cliente as any).codigo_pais, cliente.telefono);
              }"""

content = re.sub(wa_block_old, wa_block_new, content)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
