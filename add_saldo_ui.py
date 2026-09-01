import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

calc_logic = """
  const handlePagarComision = async () => {
    try {
      setIsSubmitting(true)
      await registrarPagoComisionTabla(modalComision.id, Number(modalComision.pago))
      setModalComision({ isOpen: false, id: '', saldo: 0, pago: '' })
    } catch (e) {
      alert("Error al pagar comisión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAplicarSaldoAFavor = async () => {
    try {
      setIsSubmitting(true)
      await aplicarSaldoAFavorComision(modalComision.id, Number(modalComision.pago))
      setModalComision({ isOpen: false, id: '', saldo: 0, pago: '' })
    } catch (e) {
      alert("Error al aplicar saldo a favor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const saldoAFavor = comisiones?.filter(c => c.estado_pago === 'cancelada_con_saldo_a_favor')
    .reduce((acc, c) => acc + Number(c.monto_pagado), 0) || 0;
  
  const totalComisionPendiente = comisiones?.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial')
    .reduce((acc, c) => acc + (Number(c.monto_comision) - Number(c.monto_pagado)), 0) || 0;

  const totalNetoATransferir = Math.max(0, totalComisionPendiente - saldoAFavor);
"""

content = re.sub(
    r"const handlePagarComision = async \(\) => \{.*?setIsSubmitting\(false\)\n    \}\n  \}",
    calc_logic,
    content,
    flags=re.DOTALL
)

# Insert the summary UI
summary_ui = """
      {activeTab === 'comisiones' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-purple-100 bg-purple-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <BadgeDollarSign className="w-4 h-4 text-purple-600" />
                  Comisión Pendiente (Reservas Activas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatPrice(totalComisionPendiente)}</div>
              </CardContent>
            </Card>

            <Card className="border-green-100 bg-green-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Saldo a Favor (Cancelaciones)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-{formatPrice(saldoAFavor)}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 bg-blue-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  Total Neto a Transferir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{formatPrice(totalNetoATransferir)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
"""

content = content.replace("{activeTab === 'comisiones' && (\n        <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden\">", summary_ui)

# Modal changes
modal_ui = """
            <div className="flex flex-col gap-2 pt-2">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                onClick={handlePagarComision}
                isLoading={isSubmitting}
                disabled={!modalComision.pago || Number(modalComision.pago) <= 0 || Number(modalComision.pago) > modalComision.saldo}
              >
                Confirmar Transferencia
              </Button>
              {saldoAFavor > 0 && (
                <Button 
                  variant="outline"
                  className="w-full border-green-600 text-green-700 hover:bg-green-50" 
                  onClick={handleAplicarSaldoAFavor}
                  isLoading={isSubmitting}
                  disabled={!modalComision.pago || Number(modalComision.pago) <= 0 || Number(modalComision.pago) > modalComision.saldo || Number(modalComision.pago) > saldoAFavor}
                >
                  Aplicar Saldo a Favor ({formatPrice(saldoAFavor)} Disp.)
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
"""

content = re.sub(
    r"<Button\s+className=\"w-full bg-purple-600 hover:bg-purple-700 text-white\"\s+onClick=\{handlePagarComision\}.*?</Button>\s*</div>\s*</DialogContent>",
    modal_ui,
    content,
    flags=re.DOTALL
)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
