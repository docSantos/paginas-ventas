// src/lib/textUtils.ts
// Utilidad de normalización de cadenas resistente a Mojibake y acentos (Regla de oro de Casas Gaby)

/**
 * Normaliza un texto eliminando diacríticos, acentos y espacios superfluos,
 * convirtiendo todo a minúsculas para búsquedas y comparaciones seguras.
 */
export function normalizarTexto(texto: string | null | undefined): string {
  if (!texto) return "";
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Comprueba si el texto objetivo contiene el término de búsqueda de forma insensible a acentos y mayúsculas.
 */
export function coincideBusqueda(textoObjetivo: string | null | undefined, terminoBusqueda: string): boolean {
  const normObjetivo = normalizarTexto(textoObjetivo);
  const normTermino = normalizarTexto(terminoBusqueda);
  if (!normTermino) return true;
  return normObjetivo.includes(normTermino);
}
