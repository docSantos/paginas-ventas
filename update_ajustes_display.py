import re

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update import
content = content.replace(
    "import { formatPhone, isPhoneValid } from '@/lib/utils'",
    "import { formatPhone, isPhoneValid, formatPhoneWithFlag } from '@/lib/utils'"
)

# 2. Remove `getPhoneDisplay` function entirely
# We find the `const getPhoneDisplay` block
import_match = re.search(r"const getPhoneDisplay = \([\s\S]*?\}\s*\}\s*return `\+\$\{phone\}`\s*\}", content)
if import_match:
    content = content[:import_match.start()] + content[import_match.end():]

# 3. Replace usages of getPhoneDisplay
content = content.replace("getPhoneDisplay(", "formatPhoneWithFlag(")

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
