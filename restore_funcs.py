import re

with open('actions_head.ts', 'r', encoding='utf-16') as f:
    head_content = f.read()

def extract_function(name):
    start_idx = head_content.find(f"export async function {name}")
    if start_idx == -1:
        return None
    
    brace_count = 0
    in_function = False
    
    for i in range(start_idx, len(head_content)):
        if head_content[i] == '{':
            brace_count += 1
            in_function = True
        elif head_content[i] == '}':
            brace_count -= 1
        
        if in_function and brace_count == 0:
            return head_content[start_idx:i+1]
            
    return None

funcs_to_restore = [
    "eliminarAjusteReserva",
    "crearServicio",
    "actualizarServicio",
    "eliminarServicio",
    "fusionarClientes",
    "actualizarCliente"
]

with open('src/app/casasgaby/admin/actions.ts', 'a', encoding='utf-8') as f:
    for name in funcs_to_restore:
        func_code = extract_function(name)
        if func_code:
            with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as current_f:
                if f"export async function {name}" not in current_f.read():
                    f.write("\n\n" + func_code)
                    print(f"Restored {name}")

