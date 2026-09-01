import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the inner Cancelar Reserva button.
old_btn = r"""<Button\s*variant="outline"\s*size="sm"\s*className="text-red-600 border-red-200 hover:bg-red-50 ml-auto"\s*onClick=\{async \(\) => \{\s*if \(confirm\('¿Estás seguro de cancelar esta reserva\? Las fechas se liberarán.'\)\) \{\s*const res = await cancelarReserva\(r.id\)\s*if \(res && !res.success\) \{\s*alert\("Error al cancelar: " \+ res.error\)\s*\}\s*\}\s*\}\}\s*>\s*Cancelar Reserva\s*</Button>"""

# Using literal replacement because regex with spaces might be slightly off.
# Let's find it by substring.
idx = content.find("confirm('")
if idx == -1:
    idx = content.find("confirm('")
if idx == -1:
    idx = content.find("if (confirm")

if idx != -1:
    start_btn = content.rfind("<Button", 0, idx)
    end_btn = content.find("</Button>", idx) + len("</Button>")
    
    new_btn = """<Button 
                                variant="outline" size="sm" 
                                className="text-red-600 border-red-200 hover:bg-red-50 ml-auto"
                                onClick={() => {
                                  const totalAbonado = (r as any).transacciones?.filter((t:any) => t.tipo === 'ingreso').reduce((sum:number, t:any) => sum + Number(t.monto), 0) || Number(r.monto_apartado) || 0;
                                  const hasUsd = (r as any).transacciones?.some((t:any) => t.moneda === 'USD');
                                  
                                  setCancelData({ 
                                    willRefund: false, 
                                    amount: totalAbonado.toString(), 
                                    currency: hasUsd ? 'USD' : 'MXN', 
                                    method: 'transferencia', 
                                    note: 'Reembolso por cancelación anticipada' 
                                  });
                                  setCancelModal({ open: true, reserva: r });
                                }}
                              >
                                Cancelar Reserva
                              </Button>"""
    
    content = content[:start_btn] + new_btn + content[end_btn:]
    with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
        
