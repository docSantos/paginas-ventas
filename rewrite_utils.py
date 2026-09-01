import re

with open('src/lib/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we import COUNTRIES
if "import { COUNTRIES }" not in content:
    content = "import { COUNTRIES } from '@/lib/countries'\n" + content

# 1. Update formatPhone
idx_start = content.find("export function formatPhone(value: string, lada: string): string {")
# find matching brace for formatPhone
def find_matching_brace(text, start):
    brace_count = 0
    in_function = False
    for i in range(start, len(text)):
        if text[i] == '{':
            brace_count += 1
            in_function = True
        elif text[i] == '}':
            brace_count -= 1
        
        if in_function and brace_count == 0:
            return i
    return -1

idx_end = find_matching_brace(content, idx_start)
if idx_start != -1 and idx_end != -1:
    new_format_phone = """export function formatPhone(value: string, lada: string): string {
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
}"""
    content = content[:idx_start] + new_format_phone + content[idx_end+1:]

# 2. Update formatPhoneNumber and add formatPhoneWithFlag
idx_start2 = content.find("export function formatPhoneNumber(phone: string | null | undefined): string {")
idx_end2 = find_matching_brace(content, idx_start2)
if idx_start2 != -1 and idx_end2 != -1:
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
    content = content[:idx_start2] + new_helper + content[idx_end2+1:]

with open('src/lib/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
