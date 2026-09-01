import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix import
content = re.sub(r"DialogTitle,\s*DialogFooter", "DialogTitle", content)
content = re.sub(r"DialogTitle\s*,\s*DialogFooter", "DialogTitle", content)
content = content.replace("DialogFooter", "div") # since we just used a simple div replacement
content = content.replace("<div variant=\"outline\"", "<Button variant=\"outline\"")

# Let's just fix it completely by doing a clean regex replacement
content = content.replace("<DialogFooter>", "<div className=\"flex justify-end gap-2 pt-4 border-t mt-4\">")
content = content.replace("</DialogFooter>", "</div>")

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
