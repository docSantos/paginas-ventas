import re

for filename in ['src/components/casasgaby/admin/ReservasClient.tsx', 'src/components/casasgaby/admin/ClientesClient.tsx']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Rename the function
    content = content.replace("formatPhoneNumber", "formatPhoneWithFlag")

    # The character might be 📞 or some unicode escape. We can just use a regex to match any character before it.
    # e.g., `>📞 {formatPhoneWithFlag(` -> `>{formatPhoneWithFlag(`
    content = re.sub(r">.*?(?:📞|Y\"z|\uD83D\uDCDE)\s*\{formatPhoneWithFlag", ">{formatPhoneWithFlag", content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
