import re

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if "PhoneInputField" not in content:
    content = content.replace("import { Input } from '@/components/ui/input'", "import { Input } from '@/components/ui/input'\nimport PhoneInputField from '@/components/PhoneInputField'")

# Update logic
old_logic = r"const addNumber = async \(\) => \{[\s\S]*?if \(!isPhoneValid\(nuevoNumero, lada\)\) return\s*const cleanNumber = nuevoNumero\.replace\(/\\D/g, ''\)\s*const fullNumber = `\$\{lada\}\$\{cleanNumber\}`"
new_logic = r"""const addNumber = async () => {
    const rawNumber = nuevoNumero.replace(/\D/g, '')
    if (rawNumber.length < 10) return
    const fullNumber = rawNumber"""
content = re.sub(old_logic, lambda m: new_logic, content)

# Remove lada state
content = re.sub(r"const \[lada, setLada\] = useState\('52'\)\s*", "", content)

# Replace the flex input block
old_flex = r"<div className=\"flex\">[\s\S]*?<Input[\s\S]*?value=\{nuevoNumero\}[\s\S]*?/>\s*</div>"
new_flex = r"<PhoneInputField value={nuevoNumero} onChange={setNuevoNumero} />"
content = re.sub(old_flex, lambda m: new_flex, content)

# Update disabled condition
old_btn = r"<Button onClick=\{addNumber\} disabled=\{!isPhoneValid\(nuevoNumero, lada\) \|\| saving\} className=\"shrink-0 w-full sm:w-auto\">"
new_btn = r'<Button onClick={addNumber} disabled={nuevoNumero.replace(/\D/g, "").length < 10 || saving} className="shrink-0 w-full sm:w-auto">'
content = re.sub(old_btn, lambda m: new_btn, content)

# Update error message condition
old_err = r"\{nuevoNumero\.length > 0 && !isPhoneValid\(nuevoNumero, lada\) && \([\s\S]*?\}\)"
new_err = r"""{nuevoNumero.length > 0 && nuevoNumero.replace(/\D/g, '').length < 10 && (
              <p className="text-xs text-red-500 mt-2">Ingresa un número válido (mínimo 10 dígitos)</p>
            )}"""
content = re.sub(old_err, lambda m: new_err, content)

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
