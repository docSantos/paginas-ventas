import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const allPagos = validReservas.flatMap((r: any) => {", "const allPagos = [...(c.transacciones || []), ...validReservas.flatMap((r: any) => {")
# Wait, let's just do it carefully.
content = content.replace(
    "const allPagos = validReservas.flatMap((r: any) => {",
    "const allPagos = [...(c.transacciones || []), ...validReservas.flatMap((r: any) => {"
)
# Close the bracket
content = content.replace(
    "      return pagos;\n    });",
    "      return pagos;\n    })];"
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
