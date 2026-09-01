import re

with open('src/lib/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

func_logic = """
export function formatStoredPhone(storedPhone: string): string {
  const clean = (storedPhone || '').replace(/\D/g, '');
  if (clean.startsWith('52') && clean.length > 2) {
    const digits = clean.substring(2);
    return `+52 ${digits.replace(/(\\d{3})(\\d{3})(\\d{4})/, '$1 $2 $3')}`;
  }
  if (clean.startsWith('1') && clean.length > 1 && clean.length <= 12) {
    const digits = clean.substring(1);
    return `+1 ${digits.replace(/(\\d{3})(\\d{3})(\\d{4})/, '$1 $2 $3')}`;
  }
  return `+${clean}`;
}
"""

content = content + "\n" + func_logic

with open('src/lib/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
