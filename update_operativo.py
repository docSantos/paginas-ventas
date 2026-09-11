import os
import re

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

conflict_logic = """
  const inHouseConflicts = Object.values(inHouse.reduce((acc: any, r: any) => {
    if (!acc[r.propiedad_id]) acc[r.propiedad_id] = [];
    acc[r.propiedad_id].push(r);
    return acc;
  }, {})).filter((arr: any) => arr.length > 1);
  
  const hasConflict = inHouseConflicts.length > 0;
"""

if "const hasConflict" not in content:
    # insert before const handleCheckIn
    content = content.replace("  const handleCheckIn", conflict_logic + "\n  const handleCheckIn")


conflict_banner = """
        <CardContent className="p-0">
          {hasConflict && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 mx-4 mt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800 font-semibold">
                  ⚠️ Conflicto de Ocupación: Se detectaron múltiples huéspedes registrados simultáneamente en la misma propiedad.
                </p>
              </div>
            </div>
          )}
"""

if "{hasConflict && (" not in content:
    content = content.replace('<CardContent className="p-0">', conflict_banner, 2)
    # The replace above will replace all, but we only want the second one (In-House section)
    # Actually wait. `CardContent className="p-0"` is used twice. Once in Arrivals, once in In-House.
    # Let's fix that.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

# We need to refine the banner injection
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Revert the naive replace
content = content.replace(conflict_banner, '<CardContent className="p-0">')

# Inject properly inside SECCIÓN 2: IN-HOUSE
target = """      {/* SECCIÓN 2: IN-HOUSE */}
      <Card className="border-indigo-100 bg-white">
        <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
          <CardTitle className="text-indigo-900 flex items-center gap-2 text-lg">
            <UserMinus className="w-5 h-5 text-indigo-600" />
            Huéspedes en Vivo (In-House)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">"""

replacement = target + """
          {hasConflict && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 mx-4 mt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800 font-semibold">
                  ⚠️ Conflicto de Ocupación: Se detectaron múltiples huéspedes registrados simultáneamente en la misma propiedad.
                </p>
              </div>
            </div>
          )}"""

content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated OperacionClient.tsx with conflict banner")
