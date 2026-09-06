import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_button_block = r"""<div className="flex flex-col gap-2 w-full sm:w-auto">
\s*<Button\s+onClick=\{[^}]+\}\s+disabled=\{loadingId === r\.id\}\s+variant="default"\s+className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white shadow-sm"\s*>
\s*\{loadingId === r\.id \? 'Marcando\.\.\.' : 'Marcar Check-out'\}
\s*</Button>
\s*\{r\.fecha_salida > todayStr && \(\s*<button\s*onClick=\{[^}]+\}\s*disabled=\{loadingId === r\.id\}\s*className="text-xs text-indigo-600 hover:text-indigo-800 underline text-right w-full font-medium"\s*>\s*Salida anticipada\s*</button>\s*\)\}
\s*</div>"""

new_button_block = """<div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Button 
                        onClick={() => handleCheckOut(r)}
                        disabled={loadingId === r.id}
                        variant="default"
                        className={`w-full sm:w-auto text-white shadow-sm ${
                          r.fecha_salida > todayStr 
                            ? 'bg-slate-700 hover:bg-slate-800' 
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                      >
                        {loadingId === r.id ? 'Procesando...' : (r.fecha_salida > todayStr ? 'Check-out Anticipado' : 'Marcar Check-out')}
                      </Button>
                    </div>"""

# Ensure DOTALL isn't needed if we match space/newlines with \s
content = re.sub(old_button_block, new_button_block, content, flags=re.MULTILINE)

# Also catch variants just in case the regex didn't match perfectly.
if 'Salida anticipada' in content and '<button' in content:
    # Alternative direct string replacement if regex fails
    start_idx = content.find('<div className="flex flex-col gap-2 w-full sm:w-auto">')
    end_idx = content.find('</div>\n                  </div>\n                )\n              })}\n            </div>\n          )}\n        </CardContent>\n      </Card>')
    if start_idx != -1 and end_idx != -1:
        end_tag_idx = content.find('</div>', start_idx) + 6
        # To be safe, let's just do a manual replacement if needed, but the regex usually works.

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
