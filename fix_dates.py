import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the component definition to inject the localToday logic.
# Wait, I can just write a small helper function at the top or inside the component.
# Let's see what imports are there.

# I'll just write a replace logic.
script_patch = """
  // State for quote calculation
"""
new_script_patch = """
  // Get today's date in local timezone for the date pickers
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // State for quote calculation
"""

content = content.replace(script_patch, new_script_patch)

# Now replace the inline `new Date().toISOString().split('T')[0]` with `localToday`.
# Be careful to replace both occurrences for min=...
content = content.replace("min={new Date().toISOString().split('T')[0]}", "min={localToday}")
content = content.replace("min={fechaEntrada || new Date().toISOString().split('T')[0]}", "min={fechaEntrada || localToday}")

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
