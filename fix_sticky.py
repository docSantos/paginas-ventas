import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the floating bar from its current location above `return (`
bad_bar_pattern = re.compile(r'\{\s*/\*\s*BARRA FLOTANTE.*?\n\s*\}\)\s*\}\s*return\s*\(', re.DOTALL)

# Let's see if we can match it and extract it safely.
# Actually, I'll just remove the whole block.
def remove_bad_bar(match):
    return "  return ("

content = bad_bar_pattern.sub(remove_bad_bar, content)

# 2. Add the NEW floating bar right before the final `</Dialog>\n    </div>\n  )\n}`
new_floating_bar = """

      {/* BARRA FLOTANTE DE ACCIÓN POR LOTE (POSICIONAMIENTO GLOBAL) */}
      {selectedComisiones.length > 0 && activeTab === 'comisiones' && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-sm font-medium flex items-center">
            <span className="bg-teal-500 text-white text-xs py-1 px-2.5 rounded-full mr-3 shadow-inner">{selectedComisiones.length}</span>
            <span className="hidden sm:inline">seleccionadas | Total:</span>
            <span className="sm:hidden">Total:</span>
            <span className="font-bold text-lg text-teal-400 ml-2">{formatPrice(localComisiones.filter(c => selectedComisiones.includes(c.id)).reduce((acc, c) => acc + (c.monto_comision - c.monto_pagado), 0))}</span>
          </div>
          <Button 
            className="bg-teal-500 hover:bg-teal-600 text-white border border-teal-400 shadow-md whitespace-nowrap"
            onClick={() => {
              const total = localComisiones.filter(c => selectedComisiones.includes(c.id)).reduce((acc, c) => acc + (c.monto_comision - c.monto_pagado), 0)
              setModalComision({
                isOpen: true,
                ids: selectedComisiones,
                saldo: total,
                pago: String(total)
              })
            }}
          >
            Liquidar
          </Button>
        </div>
      )}

    </div>
  )
}"""

# Target the end of the file
end_pattern = re.compile(r'\s*</div>\s*\)\s*\}\s*$', re.DOTALL)
content = end_pattern.sub(new_floating_bar, content)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
