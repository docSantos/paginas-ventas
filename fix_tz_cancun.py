import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the previous block with the new block
old_block = """  // Get today's date in local timezone for the date pickers
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;"""

new_block = """  // Get today's date pinned to the property's timezone (America/Cancun)
  const getTodayCancun = (): string => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Cancun',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date()); // Outputs YYYY-MM-DD reliably
  };
  
  const minLlegada = getTodayCancun();"""

content = content.replace(old_block, new_block)

# Update the min= attributes
content = content.replace("min={localToday}", "min={minLlegada}")
content = content.replace("min={fechaEntrada || localToday}", "min={fechaEntrada || minLlegada}")

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
