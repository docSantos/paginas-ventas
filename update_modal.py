import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update State
old_state = r"const \[ajusteData, setAjusteData\] = useState\(\{ tipo: 'cargo', concepto: '', monto: '', porcentaje_comision: '0' \}\)"
new_state = r"const [ajusteData, setAjusteData] = useState({ tipo: 'catalogo', catalogoId: '', concepto: '', monto: '' })"
content = re.sub(old_state, new_state, content)

# 2. Update handleAgregarAjuste
old_handler = r"const handleAgregarAjuste = async \(\) => \{[\s\S]*?alert\(\"Error: \" \+ e\.message\);\s*\}\s*\}"
new_handler = """const handleAgregarAjuste = async () => {
    let conceptoFinal = ajusteData.concepto;
    let montoFinal = ajusteData.monto;
    let tipoReal: 'cargo' | 'descuento' = 'cargo';
    let esServicio = false;

    if (ajusteData.tipo === 'catalogo') {
      const s = servicios.find(x => x.id === ajusteData.catalogoId);
      if (!s) return alert('Selecciona un servicio');
      conceptoFinal = s.nombre + (ajusteData.concepto ? ` - ${ajusteData.concepto}` : '');
      esServicio = true;
    } else if (ajusteData.tipo === 'nuevo') {
      esServicio = true;
    } else if (ajusteData.tipo === 'descuento') {
      tipoReal = 'descuento';
    }

    if (!conceptoFinal || !montoFinal) return alert('Completa los campos obligatorios');

    try {
      await agregarAjusteReserva(
        ajusteModal.reservaId, 
        tipoReal, 
        conceptoFinal, 
        Number(montoFinal), 
        esServicio
      );
      setAjusteModal({ open: false, reservaId: '' });
      setAjusteData({ tipo: 'catalogo', catalogoId: '', concepto: '', monto: '' });
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }"""
content = re.sub(old_handler, new_handler, content)

# 3. Update the Modal JSX
old_modal = r"<DialogTitle>Agregar Ajuste / Cargo Extra / Descuento</DialogTitle>[\s\S]*?</DialogContent>\s*</Dialog>"
new_modal = """<DialogTitle>Agregar Ajuste / Cargo Extra / Descuento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-1">Tipo de Concepto</label>
              <select 
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={ajusteData.tipo}
                onChange={e => {
                  const val = e.target.value;
                  setAjusteData({ tipo: val, catalogoId: '', concepto: '', monto: '' });
                }}
              >
                <option value="catalogo">Servicio Adicional del Catálogo</option>
                <option value="nuevo">Servicio Nuevo / No Listado</option>
                <option value="cargo">Cargo Adicional (+)</option>
                <option value="descuento">Descuento (-)</option>
              </select>
            </div>

            {ajusteData.tipo === 'catalogo' && (
              <div>
                <label className="text-sm font-medium block mb-1">Selecciona el Servicio</label>
                <select 
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  value={ajusteData.catalogoId}
                  onChange={e => {
                    const id = e.target.value;
                    const serv = servicios.find(s => s.id === id);
                    setAjusteData({ ...ajusteData, catalogoId: id, monto: serv ? serv.precio_base.toString() : '' });
                  }}
                >
                  <option value="">-- Seleccionar --</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre} (+${s.precio_base})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className={ajusteData.tipo === 'catalogo' ? 'col-span-2' : 'col-span-1'}>
                <label className="text-sm font-medium block mb-1">
                  {ajusteData.tipo === 'catalogo' ? 'Notas / Cantidad (Opcional)' : (ajusteData.tipo === 'nuevo' ? 'Nombre del Servicio' : 'Concepto / Motivo')}
                </label>
                <Input 
                  placeholder={
                    ajusteData.tipo === 'catalogo' ? 'Ej. x2 días, para 3 personas...' : 
                    (ajusteData.tipo === 'descuento' ? 'Ej. Cortesía, Promoción...' : 'Ej. Mascota extra, Limpieza...')
                  } 
                  value={ajusteData.concepto} 
                  onChange={e => setAjusteData({ ...ajusteData, concepto: e.target.value })} 
                />
              </div>
              <div className={ajusteData.tipo === 'catalogo' ? 'col-span-2' : 'col-span-1'}>
                <label className="text-sm font-medium block mb-1">Monto (MXN)</label>
                <Input type="number" placeholder="0.00" value={ajusteData.monto} onChange={e => setAjusteData({ ...ajusteData, monto: e.target.value })} />
              </div>
            </div>

            {ajusteData.tipo === 'descuento' && (
              <p className="text-xs text-gray-500 italic mt-2">
                * Los descuentos solo ajustan el saldo a pagar del cliente y no alteran la comisión.
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setAjusteModal({ ...ajusteModal, open: false })}>Cancelar</Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleAgregarAjuste}>Agregar Ajuste</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>"""

content = re.sub(old_modal, new_modal, content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
