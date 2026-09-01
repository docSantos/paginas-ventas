import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any <Input type="number" ... /> regardless of content
# A better way is just to replace `<Input type="number"` with `<Input type="number" min="0.01" step="any" onKeyDown={e => e.key === '-' && e.preventDefault()}`
# Wait, if step="0.01" is already there, it will duplicate step. But duplicate props in React will just override. To be safe:

def fix_input(match):
    tag = match.group(0)
    # Remove existing step="" if any
    tag = re.sub(r'\s+step="[^"]+"', '', tag)
    return tag + ' min="0.01" step="any" onKeyDown={e => e.key === \'-\' && e.preventDefault()}'

new_content = re.sub(r'<Input\s+type="number"', fix_input, content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
