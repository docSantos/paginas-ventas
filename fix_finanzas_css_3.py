import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

helper = """
const formatLargePrice = (price: number) => {
  const formatted = formatPrice(price);
  return formatted.replace('\\xa0', ' ').replace('.00', '');
}

"""

# Insert right after `export function FinanzasClient({ propiedades, reservas, pagos }: { propiedades: any[], reservas: any[], pagos: any[] }) {`
# Or just before `const [activeTab, setActiveTab]`
content = content.replace("const [activeTab, setActiveTab]", helper + "const [activeTab, setActiveTab]")

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
