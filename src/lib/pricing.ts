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

  // Tarifa mensual (cada 30 noches)
  if (precioMes && remainingNights >= 30) {
    const months = Math.floor(remainingNights / 30);
    monthlyNights = months * 30;
    total += months * precioMes;
    remainingNights -= monthlyNights;
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
  if (monthlyNights > 0) breakdownParts.push(`${monthlyNights / 30} mes(es)`);
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
