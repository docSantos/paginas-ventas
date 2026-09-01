import re

with open('src/lib/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_format_phone = r"export function formatPhone\(value: string, lada: string\): string \{[\s\S]*?return digits\.slice\(0, 15\)\s*\}"

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

content = re.sub(old_format_phone, lambda m: new_format_phone, content)

with open('src/lib/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
