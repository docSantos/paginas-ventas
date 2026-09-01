import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the extra </div>
content = content.replace("          </div>\n        </DialogContent>\n      </Dialog>\n\n      {/* MODAL EDITAR TARIFA BASE */}", "        </DialogContent>\n      </Dialog>\n\n      {/* MODAL EDITAR TARIFA BASE */}")

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
