import re

with open('src/lib/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we import COUNTRIES
if "import { COUNTRIES }" not in content:
    content = "import { COUNTRIES } from '@/lib/countries'\n" + content

# Update `formatPhoneNumber` to `formatPhoneWithFlag` and also fix `formatPhoneNumber` for backwards compatibility
old_format_phone_number = r"export function formatPhoneNumber\(phone: string \| null \| undefined\): string \{[\s\S]*?return phone;\s*\}"

new_helper = """export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const raw = phone.replace(/\\D/g, '');
  if (!raw) return phone;
  const sorted = [...COUNTRIES].filter(c => c.code !== 'separator').sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (raw.startsWith(c.code)) {
      return `+${c.code} ${formatPhone(raw.substring(c.code.length), c.code)}`;
    }
  }
  return `+${raw}`;
}

export function formatPhoneWithFlag(phone: string | null | undefined): string {
  if (!phone) return '';
  const raw = phone.replace(/\\D/g, '');
  if (!raw) return phone;
  const sorted = [...COUNTRIES].filter(c => c.code !== 'separator').sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (raw.startsWith(c.code)) {
      return `${c.flag} +${c.code} ${formatPhone(raw.substring(c.code.length), c.code)}`;
    }
  }
  return `+${raw}`;
}"""

# Just replacing the `export function formatPhoneNumber...` entirely
content = re.sub(r"export function formatPhoneNumber\(phone: string \| null \| undefined\): string \{[\s\S]*?\}", lambda m: new_helper, content)

with open('src/lib/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
