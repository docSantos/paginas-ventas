import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the second stray body that remains after the new CrmPipeline closing }
# It starts with `const normalizedSolicitudes = solicitudes.map` (the old function body after the ']')
# and ends with the last `}` of the file.
# Strategy: find the index of the function closing, then trim anything after it.

# The new file should end at '}' after `</> ) }` of CrmPipeline.
# Everything after line ~724 (after function closing brace) is stale.
# Let's find and remove it.

marker = "\n}\n"
# Find last `}` which is CrmPipeline's closing brace
# Actually let's look for the second occurrence of "const normalizedSolicitudes"
idx = content.rfind("const normalizedSolicitudes = solicitudes.map(s => ({\n    ...s,\n    estado_crm: s.estado === 'Pendiente' ? 'nueva' : (s.estado || 'nueva')\n  }))")
if idx > 0:
    # Find the start of this stray block - go back to find \n\n before it
    start = content.rfind('\n\n', 0, idx)
    content = content[:start].rstrip() + '\n'
    print(f"Removed stale code from position {start}")
else:
    print("Pattern not found, searching for alternate...")
    # Try a simpler approach - just truncate at the 3rd function declaration
    idx2 = content.rfind("const [activeStage, setActiveStage] = useState('nueva')")
    if idx2 > 0:
        start = content.rfind('\n\n', 0, idx2)
        content = content[:start].rstrip() + '\n'
        print(f"Removed by activeStage at {idx2}")

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
