import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

script_patch = """  const router = useRouter()"""
new_script_patch = """  const router = useRouter()
  
  // Get today's date in local timezone for the date pickers
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
"""

content = content.replace(script_patch, new_script_patch)

# Replace the inline ISO string calls
content = content.replace("min={new Date().toISOString().split('T')[0]}", "min={localToday}")
content = content.replace("min={fechaEntrada || new Date().toISOString().split('T')[0]}", "min={fechaEntrada || localToday}")

# Wait, let's also check if there is an `addDays(new Date(), 1)` somewhere that is forcing tomorrow.
# The user said: "Si existía una regla forzada tipo addDays(new Date(), 1), elimínala"
# Let's see if that exists later, I'll run the regex just in case.

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
