// src/lib/pricing.ts

export interface StayTotal {
  nights: number;
  total: number;
  monthlyNights: number;
  weeklyNights: number;
  dailyNights: number;
  breakdown: string;
  anticipo: number;
}

export function calculateStayTotal(
  nights: number,
  precioNoche: number,
  precioSemana?: number | null,
  precioMes?: number | null
): StayTotal {
  let remainingNights = nights;
  let total = 0;
  let monthlyNights = 0;
  let weeklyNights = 0;
  let dailyNights = 0;

  // Tarifa mensual (adaptativa para meses calendario)
  // Si la estancia es entre 28 y 31 noches, se considera exactamente 1 mes.
  // Para estancias más largas, calculamos cuántos bloques "mensuales" (aproximados a 30 días) hay.
  if (precioMes && remainingNights >= 28) {
    // Calculamos meses considerando que 28-31 días es 1 mes. 
    // Usamos Math.round para que 28, 29, 30, 31 se redondeen a 1 mes (30). 
    // 58-61 se redondean a 2 meses, etc.
    let months = 1;
    if (remainingNights >= 32) {
      months = Math.floor(remainingNights / 30);
    }
    
    // Calculamos cuántas noches "cubre" este pago mensual para restarlas
    // Si es 1 mes exacto (28-31 noches) y no hay más noches, cubre todo.
    let coveredNights = months * 30;
    if (months === 1 && remainingNights >= 28 && remainingNights <= 31) {
      coveredNights = remainingNights;
    } else if (remainingNights >= months * 30 && remainingNights <= months * 30 + 1) {
      // Si son e.g. 61 noches, son 2 meses exactos sin días extra
      coveredNights = remainingNights;
    } else if (remainingNights >= months * 30 - 2 && remainingNights < months * 30) {
      // Si son e.g. 58 noches, son 2 meses exactos
      coveredNights = remainingNights;
    }

    monthlyNights = coveredNights;
    total += months * precioMes;
    remainingNights -= coveredNights;
  }

  // Tarifa semanal (cada 7 noches)
  if (precioSemana && remainingNights >= 7) {
    const weeks = Math.floor(remainingNights / 7);
    weeklyNights = weeks * 7;
    total += weeks * precioSemana;
    remainingNights -= weeklyNights;
  }

  // Tarifa diaria para noches restantes
  if (remainingNights > 0) {
    dailyNights = remainingNights;
    total += dailyNights * precioNoche;
  }

  // Prevención: Si por alguna razón la suma de tarifas promocionales es más cara 
  // que cobrar todas las noches individuales, usamos la tarifa normal.
  const strictDailyTotal = nights * precioNoche;
  if (strictDailyTotal < total) {
    return {
      nights,
      total: strictDailyTotal,
      monthlyNights: 0,
      weeklyNights: 0,
      dailyNights: nights,
      breakdown: `${nights} noche(s)`,
      anticipo: strictDailyTotal * 0.50,
    };
  }

  // Construir desglose legible
  const breakdownParts = [];
  if (monthlyNights > 0) {
    // Para visualización, estimamos los meses dividiendo entre 30 y redondeando.
    // 28, 29, 30, 31 noches -> 1 mes.
    const displayMonths = Math.round(monthlyNights / 30) || 1;
    breakdownParts.push(`${displayMonths} mes(es)`);
  }
  if (weeklyNights > 0) breakdownParts.push(`${weeklyNights / 7} semana(s)`);
  if (dailyNights > 0) breakdownParts.push(`${dailyNights} noche(s)`);

  return {
    nights,
    total,
    monthlyNights,
    weeklyNights,
    dailyNights,
    breakdown: breakdownParts.join(' + '),
    anticipo: total * 0.50, // 50% anticipo requerido
  };
}
