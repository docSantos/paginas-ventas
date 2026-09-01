import sys
import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Helper function to inject new recalculation logic
def rewrite_function(func_name, code):
    # Regex to capture from function start to the end of the block before revalidatePath
    pattern = r"export async function " + func_name + r"[\s\S]*?(?=revalidatePath\('/casasgaby/admin/reservas'\))"
    match = re.search(pattern, code)
    if not match:
        return code
    
    # We will just replace the whole body of the function because the logic is mostly the same
    # Wait, it's easier to just do string replacements. Let's do it manually.
    pass

# We will just rewrite the three functions completely
# 1. actualizarTarifaBase
# 2. agregarAjusteReserva
# 3. eliminarAjusteReserva

# Let's extract the exact bodies using regex and replace them.
