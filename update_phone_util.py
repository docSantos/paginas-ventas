import re

with open('src/lib/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = r"export function formatStoredPhone\(storedPhone: string\): string \{.*?return `\+\$\{clean\}`;?\n\}"

new_func = """export function formatStoredPhone(storedPhone: string): string {
  if (!storedPhone) return '';
  const hasPlus = storedPhone.startsWith('+');
  let clean = storedPhone.replace(/\\D/g, '');
  
  if (clean.length === 0) return storedPhone;

  // Rule 1: Mexican prefix (+52 or 52) followed by 10 digits
  if (clean.startsWith('52') && clean.length === 12) {
    const digits = clean.substring(2);
    return `+52 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  
  // Rule 3: 10 digits without prefix
  if (clean.length === 10 && (!hasPlus || !clean.startsWith('52'))) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  }
  
  // Rule 2: Other international numbers
  if (hasPlus) {
    // try to separate country code heuristically if possible, or just leave + and group the rest
    // A simple way: find the first 1-3 digits as CC if it starts with 1-9? 
    // The user says "Para otros nmeros internacionales con prefijo (+XX): Agrupar en bloques de 3 o 4 dgitos"
    // So let's just group the whole clean string after adding +
    
    // Check if it's +1
    if (clean.startsWith('1') && clean.length === 11) {
      const digits = clean.substring(1);
      return `+1 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    
    // Otherwise, we don't know the exact country code length, let's just group the string in blocks of 3-4.
    // E.g. +34321065165165552 -> +34 321 065 165 ...
    // Let's assume the first 2 digits is CC for display, then blocks of 3? 
    // Or we just format the whole string in chunks:
    // chunk 1: 2 digits (prefix approx), then chunks of 3.
    const cc = clean.substring(0, 2);
    const rest = clean.substring(2);
    const chunks = rest.match(/.{1,3}/g) || [];
    return `+${cc} ${chunks.join(' ')}`;
  }

  // Fallback
  return storedPhone;
}"""

# Manual replacement since regex with newlines might fail
start_idx = content.find("export function formatStoredPhone(storedPhone: string): string {")
if start_idx != -1:
    end_idx = content.find("}", start_idx)
    # The function might have multiple returns and if statements, find the LAST } of the function.
    # It ends with `return `+${clean}`;\n}` normally.
    end_idx = content.find("return `+${clean}`", start_idx)
    if end_idx != -1:
        end_idx = content.find("}", end_idx) + 1
        content = content[:start_idx] + new_func + content[end_idx:]

with open('src/lib/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
