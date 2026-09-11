import os
import re

filepath = 'src/components/casasgaby/PropertyDetailClient.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

functions_code = """
  const contactoIndexRef = useRef(0);
  const fechasIndexRef = useRef(0);

  const siguienteContactoPrueba = () => {
    const c = MOCK_CONTACTOS[contactoIndexRef.current];
    setFormData({ nombre: c.nombre, telefono: c.telefono, correo: c.email });
    contactoIndexRef.current = (contactoIndexRef.current + 1) % MOCK_CONTACTOS.length;
  };

  const siguienteFechasPrueba = () => {
    const f = MOCK_FECHAS[fechasIndexRef.current];
    setFechaEntrada(f.entrada);
    setFechaSalida(f.salida);
    fechasIndexRef.current = (fechasIndexRef.current + 1) % MOCK_FECHAS.length;
  };
"""

# Match the export function signature precisely
pattern = re.compile(r'(export function PropertyDetailClient\([^\)]+\)\s*\{)')
if 'const contactoIndexRef = useRef(0);' not in content:
    content = pattern.sub(r'\1\n' + functions_code, content, count=1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected functions")
