// src/types/falvolt.ts
// Tipos TypeScript para Café FAL-VOLT

export type GrindTypeId = 'grano' | 'fino' | 'medio' | 'grueso';

export interface GrindOption {
  id: GrindTypeId;
  name: string;
  description: string;
  idealFor: string;
}

export interface CoffeePresentation {
  id: string;
  label: string;
  weightGrams: number;
  price: number;
  badge?: string;
}

export interface CoffeeProduct {
  id: string;
  name: string;
  tagline: string;
  variety: string;
  roast: 'Tostado Medio' | 'Tostado Intenso' | 'Edición Especial';
  altitude: string;
  notes: string[];
  description: string;
  image: string;
  additionalImages?: string[];
  presentations: CoffeePresentation[];
  inStock: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  presentation: CoffeePresentation;
  grind: GrindOption;
  quantity: number;
  subtotal: number;
}

export type DeliveryMethod = 'pickup' | 'local_tapachula' | 'shipping_mx';

export interface OrderFormState {
  customerName: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethod;
  address: string;
  notes: string;
}

// Tipos para el Módulo de Monitoreo de Precios y Mercado
export type SeasonStatusType = 'optimal' | 'warning' | 'danger' | 'caution';

export interface SeasonalStage {
  id: string;
  months: string;
  stageName: string;
  zone: string;
  recommendation: string;
  statusType: SeasonStatusType;
  details: string;
  isCurrent?: boolean;
}

export interface CoffeePriceHistoryPoint {
  period: string;
  shortLabel: string;
  nyCentsLb: number;
  mxnPerKgOro: number;
  mxnPerKgPergamino: number;
  mxnPerQuintalPergamino: number;
  seasonTag?: string;
}

export interface MarketSimulatorState {
  nyPriceCentsLb: number;
  usdMxnRate: number;
  qualityDifferentialUsd: number;
  roastWeightLossPct: number;
}
