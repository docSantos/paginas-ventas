import re

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the input block up to the button
old_input = r"<div className=\"flex w-full sm:max-w-\[280px\]\">[\s\S]*?</select>\s*<Input[\s\S]*?/>\s*</div>"
new_input = r"<div className=\"w-full sm:max-w-[280px]\"><PhoneInputField value={nuevoNumero} onChange={setNuevoNumero} /></div>"
content = re.sub(old_input, lambda m: new_input, content)

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
