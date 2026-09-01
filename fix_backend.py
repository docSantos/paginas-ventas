import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. registrarPagoComisionTabla
pago_comision_val = """export async function registrarPagoComisionTabla(comisionId: string, montoAbono: number, metodo: string = 'transferencia') {
  if (!montoAbono || isNaN(Number(montoAbono)) || Number(montoAbono) <= 0) {
    throw new Error('El monto ingresado debe ser un número positivo mayor a cero.')
  }"""
content = content.replace("export async function registrarPagoComisionTabla(comisionId: string, montoAbono: number, metodo: string = 'transferencia') {", pago_comision_val)

comision_overpayment = """  const saldo = Number(comision.monto_comision) - Number(comision.monto_pagado)
  if (montoAbono > saldo) {
    throw new Error('El abono no puede exceder el saldo pendiente de ' + saldo)
  }
  const nuevoMontoPagado"""
content = content.replace("  const nuevoMontoPagado", comision_overpayment)


# 2. registrarAbono
abono_val = """export async function registrarAbono(
  reservaId: string, 
  monto: number, 
  metodo: string, 
  moneda: string, 
  tc: number, 
  notas: string = ''
) {
  if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
    throw new Error('El monto ingresado debe ser un número positivo mayor a cero.')
  }"""
content = content.replace("""export async function registrarAbono(
  reservaId: string, 
  monto: number, 
  metodo: string, 
  moneda: string, 
  tc: number, 
  notas: string = ''
) {""", abono_val)


with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
