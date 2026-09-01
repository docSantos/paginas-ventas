import sys

with open('src/lib/utils.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_formatPhone = False
in_formatPhoneNumber = False

for line in lines:
    if line.startswith('export function formatPhone(value: string, lada: string)'):
        in_formatPhone = True
        new_lines.append("""export function formatPhone(value: string, lada: string): string {
  const digits = value.replace(/\\D/g, '')
  if (lada === '52') {
    const limited = digits.slice(0, 10)
    if (limited.length <= 3) return limited
    if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
  }
  if (lada === '1') {
    const limited = digits.slice(0, 10)
    if (limited.length <= 3) return limited
    if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`
  }
  if (lada === '34') {
    const limited = digits.slice(0, 9)
    const groups = limited.match(/.{1,3}/g)?.join(' ') || limited
    return groups
  }
  
  // Generic grouping for other countries (e.g., 3-3-4)
  const limited = digits.slice(0, 15)
  return limited.match(/.{1,3}/g)?.join(' ') || limited
}
""")
    elif in_formatPhone:
        if line.startswith('}'):
            in_formatPhone = False
    elif line.startswith('export function formatPhoneNumber(phone: string | null | undefined)'):
        in_formatPhoneNumber = True
        new_lines.append("""export function formatPhoneNumber(phone: string | null | undefined): string {
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
}
""")
    elif in_formatPhoneNumber:
        if line.startswith('}'):
            in_formatPhoneNumber = False
    else:
        new_lines.append(line)

content = "".join(new_lines)
if "import { COUNTRIES }" not in content:
    content = "import { COUNTRIES } from '@/lib/countries'\n" + content

with open('src/lib/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
