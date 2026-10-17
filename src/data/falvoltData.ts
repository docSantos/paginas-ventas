// src/data/falvoltData.ts
// Datos oficiales de Café FAL-VOLT de Chiapas (Sierra de Tapachula)
import { CoffeeProduct, GrindOption } from '@/types/falvolt';

export const FALVOLT_CONFIG = {
  name: 'Café FAL-VOLT',
  brandShort: 'FAL-VOLT',
  tagline: 'El pulso de la Sierra de Tapachula en cada taza',
  region: 'Sierra de Tapachula, Chiapas, México',
  altitude: '1,200 – 1,450 msnm',
  variety: 'Mezcla Selecta Marago-Árabe',
  roastProfile: 'Tostado Medio Artesanal',
  phone: '529624766726',
  phoneFormatted: '+52 962 476 6726',
  mapsUrl: 'https://maps.app.goo.gl/Th4aAnVgCvrZVyDe7',
  whatsappBaseUrl: 'https://wa.me/529624766726',
  address: 'Tapachula de Córdova y Ordóñez, Chiapas, México',
};

export const GRIND_OPTIONS: GrindOption[] = [
  {
    id: 'grano',
    name: 'En Grano Entero',
    description: 'Conserva al 100% sus aceites y aromas naturales hasta el momento de moler.',
    idealFor: 'Molinillo personal, amantes del ritual barista',
  },
  {
    id: 'medio',
    name: 'Molido Medio (Universal)',
    description: 'Punto de molienda equilibrado que extrae la acidez justa y el cuerpo sedoso.',
    idealFor: 'Cafetera de goteo, Chemex, V60, Kalita, cafetera americana',
  },
  {
    id: 'fino',
    name: 'Molido Fino',
    description: 'Extracción densa, cremosa y con notas intensas a chocolate amargo.',
    idealFor: 'Cafetera espresso, cafetera italiana (Moka)',
  },
  {
    id: 'grueso',
    name: 'Molido Grueso',
    description: 'Partículas de grano amplias que evitan amargor en extracciones prolongadas.',
    idealFor: 'Prensa Francesa, Cold Brew, infusiones frías',
  },
];

export const FALVOLT_PRODUCTS: CoffeeProduct[] = [
  {
    id: 'falvolt-marago-arabe',
    name: 'Café Fal-Volt Selección Oro',
    tagline: 'Mezcla Insignia Marago-Árabe de Altura',
    variety: 'Maragojipe & Typica Árabe',
    roast: 'Tostado Medio',
    altitude: '1,350 msnm (Sierra de Tapachula)',
    notes: ['Chocolate amargo', 'Notas cítricas dulces', 'Nuez tostada', 'Cuerpo sedoso'],
    description:
      'Nuestra mezcla estrella. Combina la vibrante acidez frutal y aroma limpio de la variedad Árabe con el cuerpo denso, notas chocolatosas y el grano gigante del Marago chiapaneco. Tostado en pequeños lotes para garantizar frescura inmediata.',
    image: '/falvolt/bolsa-dorada-250g.webp',
    additionalImages: [
      '/falvolt/bolsa-dorada-detalle.webp',
      '/falvolt/granos-tostados.webp',
      '/falvolt/bayas-cafe.webp',
    ],
    inStock: true,
    presentations: [
      { id: 'pres-250g', label: 'Bolsa 250 g', weightGrams: 250, price: 110, badge: 'Más vendido' },
      { id: 'pres-500g', label: 'Bolsa 500 g', weightGrams: 500, price: 210 },
      { id: 'pres-1000g', label: 'Bolsa 1 kg (Ahorro)', weightGrams: 1000, price: 390, badge: 'Mejor precio/g' },
    ],
  },
  {
    id: 'falvolt-tueste-intenso',
    name: 'Café Fal-Volt Tueste Profundo',
    tagline: 'Intensidad Robusta para Despertares Enérgicos',
    variety: '100% Arábica de Estricta Altura',
    roast: 'Tostado Intenso',
    altitude: '1,280 msnm',
    notes: ['Cacao oscuro 80%', 'Caramelo tostado', 'Especias cálidas', 'Baja acidez'],
    description:
      'Para paladares que prefieren una taza con presencia arrolladora y crema consistente. Ideal para bebidas a base de leche (latte, capuchino) o un espresso que despierta todos los sentidos con notas ahumadas dulces.',
    image: '/falvolt/bolsa-dorada-empaque.webp',
    additionalImages: [
      '/falvolt/granos-tostados.webp',
      '/falvolt/bolsa-dorada-250g.webp',
    ],
    inStock: true,
    presentations: [
      { id: 'pres-int-250g', label: 'Bolsa 250 g', weightGrams: 250, price: 115 },
      { id: 'pres-int-500g', label: 'Bolsa 500 g', weightGrams: 500, price: 220 },
      { id: 'pres-int-1000g', label: 'Bolsa 1 kg', weightGrams: 1000, price: 400, badge: 'Recomendado Cafeterías' },
    ],
  },
  {
    id: 'falvolt-pack-degustacion',
    name: 'Kit Barista & Coffee Lover',
    tagline: 'El Regalo Perfecto para Conocer Chiapas',
    variety: 'Dúo de Selección (Medio + Intenso)',
    roast: 'Edición Especial',
    altitude: 'Sierra de Tapachula',
    notes: ['Variedad de perfiles', 'Muestrario de origen', 'Guía de extracción'],
    description:
      'Incluye 2 bolsas de 250g (1 Selección Oro Tostado Medio + 1 Tueste Profundo) acompañadas de guía impresa con tiempos y temperaturas óptimas para prensa francesa, moka y filtrados.',
    image: '/falvolt/cafe-prensa-cafetera.webp',
    additionalImages: [
      '/falvolt/bolsa-dorada-250g.webp',
      '/falvolt/hero-tapachula.webp',
    ],
    inStock: true,
    presentations: [
      { id: 'pres-pack-500g', label: 'Pack 2x 250 g + Guía', weightGrams: 500, price: 240, badge: 'Edición Regalo' },
    ],
  },
];

export const VALUE_PROPOSITIONS = [
  {
    id: 'origen',
    title: 'Calidad de Origen',
    subtitle: 'Sierra de Tapachula, Chiapas',
    description:
      'Granos cultivados bajo sombra y cosechados a mano cereza por cereza en las faldas fértiles de la Sierra de Chiapas.',
    image: '/falvolt/bayas-cafe.webp',
    iconName: 'Mountain',
  },
  {
    id: 'tostado',
    title: 'Tostado Maestro Artesanal',
    subtitle: 'Curva de temperatura cuidada',
    description:
      'Desarrollo térmico preciso que preserva la dulzura natural del café evitando sabores amargos quemados o astringencias.',
    image: '/falvolt/granos-tostados.webp',
    iconName: 'Flame',
  },
  {
    id: 'mezcla',
    title: 'Marago-Árabe Auténtico',
    subtitle: 'La grandeza del grano elefante',
    description:
      'El Marago aporta densidad, textura aceitosa y crema inigualable; mientras el Árabe fino aporta fragancia floral y notas cítricas.',
    image: '/falvolt/bolsa-dorada-detalle.webp',
    iconName: 'Sparkles',
  },
  {
    id: 'mayoreo',
    title: 'Menudeo & Mayoreo',
    subtitle: 'Para tu hogar o tu cafetería',
    description:
      'Surtimos desde bolsas individuales de 250g para consumo personal hasta costales y empaques de mayoreo para cafeterías y restaurantes.',
    image: '/falvolt/bolsa-dorada-empaque.webp',
    iconName: 'Store',
  },
];

export const PREPARATION_TIPS = [
  {
    method: 'Cafetera Italiana (Moka)',
    ratio: '1:10 (15g de café por 150ml de agua)',
    grind: 'Molido Fino',
    tip: 'Usa agua ya caliente en la base y fuego bajo para evitar quemar el café.',
  },
  {
    method: 'Prensa Francesa',
    ratio: '1:15 (20g de café por 300ml de agua)',
    grind: 'Molido Grueso',
    tip: 'Infusiona durante 4 minutos antes de bajar el émbolo suavemente sin presionar al fondo.',
  },
  {
    method: 'Cafetera de Filtro (Drip)',
    ratio: '1:16 (30g de café por 500ml de agua)',
    grind: 'Molido Medio',
    tip: 'Moja el filtro de papel con agua caliente antes de agregar el café para eliminar sabor a celulosa.',
  },
];
