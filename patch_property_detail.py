import os
import re

filepath = 'src/components/casasgaby/PropertyDetailClient.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Constants
constants_code = """
const MOCK_CONTACTOS = [
  { nombre: 'Carlos Mendoza Trejo', telefono: '9982148392', email: 'carlos.mendoza.tr@gmail.com' },
  { nombre: 'Sofía Valenzuela Rios', telefono: '9988451203', email: 'sofia.valenzuela.r@outlook.com' },
  { nombre: 'Mateo Albarrán Lugo', telefono: '9981729481', email: 'mateo.albarran91@gmail.com' },
  { nombre: 'Mariana Garza Peña', telefono: '9983910245', email: 'mariana.garzap@yahoo.com' },
  { nombre: 'Alejandro Ruiz Canto', telefono: '9985029384', email: 'alex.ruiz.canto@gmail.com' },
  { nombre: 'Valentina Domínguez Gil', telefono: '9986348190', email: 'valentina.dominguez@hotmail.com' },
  { nombre: 'Diego Paredes Solís', telefono: '9987410923', email: 'diego.paredes.s@gmail.com' },
  { nombre: 'Camila Navarrete Pech', telefono: '9989523817', email: 'cami.navarrete@outlook.com' },
  { nombre: 'Emiliano Estrada Cruz', telefono: '9984182903', email: 'emiliano.estrada.c@gmail.com' },
  { nombre: 'Natalia Barahona Rosado', telefono: '9981639402', email: 'natalia.barahona@yahoo.com' }
];

const MOCK_FECHAS = [
  { entrada: '2026-10-04', salida: '2026-10-11' },
  { entrada: '2026-10-11', salida: '2026-10-18' },
  { entrada: '2026-10-18', salida: '2026-10-25' },
  { entrada: '2026-10-25', salida: '2026-11-01' },
  { entrada: '2026-11-01', salida: '2026-11-08' }
];
"""

if "MOCK_CONTACTOS" not in content:
    # Insert right after imports
    content = content.replace("const AMENIDAD_ICONS", constants_code + "\nconst AMENIDAD_ICONS")

# 2. Hooks and Functions
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

if "siguienteContactoPrueba" not in content:
    # Insert at the beginning of the component
    content = content.replace("export function PropertyDetailClient({ propiedad, isDemo, reservas = [], adminPhone, servicios = [] }: PropertyDetailClientProps) {", 
                              "export function PropertyDetailClient({ propiedad, isDemo, reservas = [], adminPhone, servicios = [] }: PropertyDetailClientProps) {\n" + functions_code)

# 3. Buttons in the UI
buttons_code = """
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={siguienteContactoPrueba} className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold px-2 py-1 rounded border border-amber-300">🎲 Contacto</button>
            <button type="button" onClick={siguienteFechasPrueba} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded border border-blue-300">📅 Fechas</button>
          </div>
"""

if "🎲 Contacto" not in content:
    # Replace the paragraph block
    target = '<p className="text-sm text-gray-600 mb-4">\n            Ingresa tus datos para enviarle los detalles a Casas Gaby por WhatsApp.\n          </p>'
    replacement = target + buttons_code
    if target in content:
        content = content.replace(target, replacement)
    else:
        # Just put it under DialogContent
        target2 = '<DialogContent>'
        content = content.replace(target2, target2 + buttons_code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch complete")
