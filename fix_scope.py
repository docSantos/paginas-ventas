import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract the client logic
client_logic_pattern = r"(// --- FASE 5: Upsert en clientes \(CRM\) ---\s*let clienteId = null;[\s\S]*?update\(\{ estado: 'Aprobada' \}\)\s*\.eq\('id', solicitudId\))"
match = re.search(client_logic_pattern, content)
if not match:
    raise Exception("Client logic block not found!")
client_logic = match.group(1)

# Remove the client logic from the end
content = content.replace(client_logic, "")

# 2. Insert it before `const { data: reserva, error: errorRes } = await db\n      .from('reservas')`
reserva_insert_pattern = r"(const \{ data: reserva, error: errorRes \} = await db\s*\.from\('reservas'\)\s*\.insert)"

content = re.sub(reserva_insert_pattern, lambda m: client_logic + "\n\n  " + m.group(1), content, count=1)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
