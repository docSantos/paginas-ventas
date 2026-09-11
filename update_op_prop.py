import os

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("<FinanzasCard reserva={r} />", "<FinanzasCard reserva={r} onEditTarifa={(id, current) => setEditTarifaModal({ open: true, reservaId: id, currentBase: current })} />")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated OperacionClient FinanzasCard prop")
