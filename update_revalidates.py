import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to add revalidatePath('/casasgaby/admin/clientes') to registrarAbono, etc.
# registrarAbono ends with revalidatePath('/casasgaby/admin/reservas')
# Let's just do a blanket addition for functions dealing with transacciones that don't have it.
def insert_revalidate(func_name, code):
    match = re.search(r"export async function " + func_name + r"[\s\S]*?revalidatePath\('/casasgaby/admin/reservas'\)", code)
    if match:
        end_idx = match.end()
        # check if it already has clientes right after
        if "revalidatePath('/casasgaby/admin/clientes')" not in code[end_idx:end_idx+50]:
            return code[:end_idx] + "\n  revalidatePath('/casasgaby/admin/clientes')" + code[end_idx:]
    return code

content = insert_revalidate('registrarAbono', content)
content = insert_revalidate('cancelarReserva', content)
content = insert_revalidate('cancelarReservaConReembolso', content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
