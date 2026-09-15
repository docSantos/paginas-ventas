export interface PreciosPropiedad {
  precio_por_noche: number;
  precio_por_semana: number;
  precio_por_mes: number;
}

export interface ServicioExtra {
  id?: string;
  qty: number;
  precio_base: number;
  nombre?: string;
  tipo_tarifa?: string;
}

export interface StayTotal {
  nights: number;
  total: number;
  breakdown: string;
  anticipo: number;
}

/**
 * Calcula la tarifa base de hospedaje aplicando la regla de negocio de tarificación escalonada:
 * - < 7 días: precio_por_noche (topado a precio_por_semana)
 * - >= 7 días: prorrateo a partir de meses y semanas completas, y los días restantes 
 *   se calculan con la tarifa prorrateada semanal (precio_semana / 7).
 *
 * @param dias Número de noches de la estancia
 * @param precios Objeto con los precios de la propiedad
 * @returns Costo total del hospedaje (sin servicios extra)
 */
export function calcularTarifaHospedaje(dias: number, precios: PreciosPropiedad): number {
  if (dias <= 0) return 0;

  const precioNoche = Number(precios.precio_por_noche) || 0;
  const precioSemana = Number(precios.precio_por_semana) || 0;
  const precioMes = Number(precios.precio_por_mes) || 0;

  if (dias < 7) {
    const costoDiario = dias * precioNoche;
    // Tope semanal
    if (precioSemana > 0 && costoDiario > precioSemana) {
      return precioSemana;
    }
    return costoDiario;
  }

  // Estancias largas (>= 7 días)
  let costoTotal = 0;
  let diasRestantes = dias;

  // 1. Calcular meses completos (solo si hay precio por mes definido)
  if (precioMes > 0) {
    const meses = Math.floor(diasRestantes / 30);
    costoTotal += meses * precioMes;
    diasRestantes = diasRestantes % 30;
  }

  // 2. Calcular semanas completas del remanente
  let tarifaDiaProrrateada = 0;
  if (precioSemana > 0) {
    const semanas = Math.floor(diasRestantes / 7);
    costoTotal += semanas * precioSemana;
    diasRestantes = diasRestantes % 7;
    tarifaDiaProrrateada = precioSemana / 7;
  } else {
    // Fallback si no hay precio de semana
    tarifaDiaProrrateada = precioNoche;
  }

  // 3. Días sueltos sobrantes a tarifa prorrateada
  costoTotal += diasRestantes * tarifaDiaProrrateada;

  return Number(costoTotal.toFixed(2));
}

/**
 * Calcula el costo total de los servicios extra.
 *
 * @param servicios Array de servicios extra (JSONB)
 * @returns Costo total de los extras
 */
export function calcularCostoExtras(servicios: ServicioExtra[] | any): number {
  if (!servicios || !Array.isArray(servicios)) return 0;

  return servicios.reduce((total, servicio) => {
    const qty = Number(servicio.qty) || 0;
    const precioBase = Number(servicio.precio_base) || 0;
    return total + (qty * precioBase);
  }, 0);
}

// Mantenemos una versión adaptada de calculateStayTotal por retrocompatibilidad con el front antiguo si se usa
export function calculateStayTotal(
  nights: number,
  precioNoche: number,
  precioSemana?: number | null,
  precioMes?: number | null
): StayTotal {
  const precios = {
    precio_por_noche: precioNoche,
    precio_por_semana: precioSemana || 0,
    precio_por_mes: precioMes || 0
  };
  
  const total = calcularTarifaHospedaje(nights, precios);
  
  return {
    nights,
    total,
    breakdown: `${nights} noches escalonadas`,
    anticipo: total * 0.50
  };
}
