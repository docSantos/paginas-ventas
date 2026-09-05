import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the map syntax error
old_end = """                    <CheckCircle className="w-4 h-4 mr-2" /> Aprobar y Cobrar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>"""

new_end = """                    <CheckCircle className="w-4 h-4 mr-2" /> Aprobar y Cobrar
                  </Button>
                </div>
              </div>
            )
          })
          )}
        </div>"""

content = content.replace(old_end, new_end)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
