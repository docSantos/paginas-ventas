import os

filepath = 'src/components/casasgaby/admin/FinanzasCard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("export function FinanzasCard({ reserva: r }: { reserva: any }) {", "export function FinanzasCard({ reserva: r, onEditTarifa }: { reserva: any, onEditTarifa?: (id: string, current: number) => void }) {")

content = content.replace("Hospedaje base:", """Hospedaje base:
          {onEditTarifa && (
            <button onClick={() => onEditTarifa(r.id, tarifaBase)} className="text-gray-400 hover:text-teal-600">✏️</button>
          )}""")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated FinanzasCard props")
