import re

with open('src/lib/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find("export function formatStoredPhone(storedPhone: string): string {")
if start_idx != -1:
    content = content[:start_idx]

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
    // Check if it's +1
    if (clean.startsWith('1') && clean.length === 11) {
      const digits = clean.substring(1);
      return `+1 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    
    // For other international numbers, we can assume a 2-digit CC for display then blocks of 3
    // Or we can just use the first match as prefix (most common are 1-3 chars).
    // Let's do 2 chars prefix if length > 6, then blocks of 3.
    const cc = clean.substring(0, 2);
    const rest = clean.substring(2);
    const chunks = rest.match(/.{1,3}/g) || [];
    return `+${cc} ${chunks.join(' ')}`;
  }

  // Fallback
  return storedPhone;
}
"""

with open('src/lib/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content + new_func)
