// src/components/falvolt/OrderCoffeeSection.tsx
'use client';

import React, { useState, useId } from 'react';
import Image from 'next/image';
import {
  FALVOLT_PRODUCTS,
  GRIND_OPTIONS,
  FALVOLT_CONFIG,
} from '@/data/falvoltData';
import {
  CoffeeProduct,
  CoffeePresentation,
  GrindOption,
  DeliveryMethod,
} from '@/types/falvolt';
import {
  ShoppingBag,
  Coffee,
  CheckCircle2,
  Plus,
  Minus,
  MessageCircle,
  Truck,
  Store,
  MapPin,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';

interface OrderCoffeeSectionProps {
  selectedProductId?: string;
}

export function OrderCoffeeSection({ selectedProductId }: OrderCoffeeSectionProps) {
  // Estado del producto seleccionado
  const initialProduct =
    FALVOLT_PRODUCTS.find((p) => p.id === selectedProductId) ||
    FALVOLT_PRODUCTS[0];

  const [product, setProduct] = useState<CoffeeProduct>(initialProduct);
  const [presentation, setPresentation] = useState<CoffeePresentation>(
    initialProduct.presentations[0]
  );
  const [grind, setGrind] = useState<GrindOption>(GRIND_OPTIONS[1]); // Molido medio por defecto
  const [quantity, setQuantity] = useState<number>(1);

  // Datos del cliente
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('local_tapachula');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showValidation, setShowValidation] = useState<boolean>(false);
  const [orderSent, setOrderSent] = useState<boolean>(false);

  // Al cambiar de producto, sincronizar presentación
  const handleProductChange = (newProduct: CoffeeProduct) => {
    setProduct(newProduct);
    setPresentation(newProduct.presentations[0]);
  };

  // Cálculo de totales
  const unitPrice = presentation.price;
  const totalPrice = unitPrice * quantity;

  // Generación del mensaje formal para WhatsApp
  const generateWhatsAppMessage = () => {
    const deliveryMethodLabels: Record<DeliveryMethod, string> = {
      pickup: '🏪 Recoger en punto físico (Tapachula)',
      local_tapachula: '🛵 Entrega a domicilio local (Tapachula)',
      shipping_mx: '📦 Envío nacional por paquetería (México)',
    };

    let msg = `☕ *PEDIDO DE CAFÉ FAL-VOLT* 🏔️\n`;
    msg += `--------------------------------------\n`;
    msg += `*Cliente:* ${customerName.trim()}\n`;
    msg += `*Teléfono:* ${customerPhone.trim()}\n`;
    msg += `*Entrega:* ${deliveryMethodLabels[deliveryMethod]}\n`;
    if (deliveryMethod !== 'pickup' && address.trim()) {
      msg += `*Dirección:* ${address.trim()}\n`;
    }
    msg += `\n*Detalle del Café:*\n`;
    msg += `• *Variedad:* ${product.name}\n`;
    msg += `• *Presentación:* ${presentation.label} (${presentation.weightGrams}g)\n`;
    msg += `• *Molienda:* ${grind.name}\n`;
    msg += `• *Cantidad:* ${quantity} unidad(es)\n`;
    msg += `• *Precio unitario:* $${unitPrice} MXN\n`;
    msg += `• *TOTAL ESTIMADO:* $${totalPrice} MXN\n`;

    if (notes.trim()) {
      msg += `\n*Notas / Especificaciones:* ${notes.trim()}\n`;
    }

    msg += `--------------------------------------\n`;
    msg += `¡Hola! Acabo de armar mi pedido en la página de Fal-Volt y deseo confirmarlo.`;

    return encodeURIComponent(msg);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setShowValidation(true);
      return;
    }

    if (deliveryMethod !== 'pickup' && !address.trim()) {
      setShowValidation(true);
      return;
    }

    const whatsappUrl = `${FALVOLT_CONFIG.whatsappBaseUrl}?text=${generateWhatsAppMessage()}`;
    setOrderSent(true);

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <section id="comprar-cafe" className="px-4 py-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-1">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
          <span>Cotizador y Pedido Online</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
          Comprar Café Fal-Volt
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Personaliza tu café de especialidad a tu medida y recíbelo en Tapachula o en cualquier parte de México.
        </p>
      </div>

      {orderSent ? (
        /* Pantalla de Confirmación de Pedido */
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-emerald-950">
              ¡Pedido Preparado con Éxito!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-sm mx-auto">
              Se ha generado tu solicitud de café por WhatsApp. Si tu aplicación no abrió automáticamente, pulsa el botón de abajo:
            </p>
          </div>

          {/* Resumen rápido */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 text-left text-xs space-y-1.5 max-w-md mx-auto">
            <div className="flex justify-between font-bold text-stone-800 border-b border-stone-100 pb-1.5">
              <span>{product.name}</span>
              <span className="text-amber-700">${totalPrice} MXN</span>
            </div>
            <div className="text-stone-600">
              <span className="font-medium text-stone-700">Presentación:</span> {presentation.label} ({quantity} {quantity === 1 ? 'bolsa' : 'bolsas'})
            </div>
            <div className="text-stone-600">
              <span className="font-medium text-stone-700">Molienda:</span> {grind.name}
            </div>
            <div className="text-stone-600">
              <span className="font-medium text-stone-700">Para:</span> {customerName} ({customerPhone})
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <a
              href={`${FALVOLT_CONFIG.whatsappBaseUrl}?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Abrir WhatsApp Ahora</span>
            </a>
            <button
              onClick={() => setOrderSent(false)}
              className="px-4 py-2 rounded-2xl bg-white border border-stone-200 text-stone-700 font-medium text-xs hover:bg-stone-50 transition-colors"
            >
              Hacer otro pedido
            </button>
          </div>
        </div>
      ) : (
        /* Formulario Interactivo de Configuración de Café */
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {/* PASO 1: SELECCIONAR VARIEDAD */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Selecciona la Variedad
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {FALVOLT_PRODUCTS.map((p) => {
                const isSelected = p.id === product.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProductChange(p)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                          {p.roast}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-700" />
                        )}
                      </div>
                      <div className="font-serif font-bold text-sm text-stone-900 leading-snug">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-stone-500 line-clamp-2">
                        {p.tagline}
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-stone-200/50 text-[11px] font-semibold text-amber-800">
                      Desde ${p.presentations[0].price} MXN
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 2: TAMAÑO / PRESENTACIÓN */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Tamaño de Presentación
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {product.presentations.map((pres) => {
                const isSelected = pres.id === presentation.id;
                return (
                  <button
                    key={pres.id}
                    type="button"
                    onClick={() => setPresentation(pres)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    {pres.badge && (
                      <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-amber-700 text-white text-[9px] font-bold">
                        {pres.badge}
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-stone-900">
                        {pres.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-amber-700" />
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-serif font-bold text-lg text-amber-800">
                        ${pres.price}
                      </span>
                      <span className="text-[11px] text-stone-500">MXN</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 3: TIPO DE MOLIENDA */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Tipo de Molienda
                </h3>
              </div>
              <span className="text-[11px] text-amber-700 font-medium">
                Sin costo extra
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GRIND_OPTIONS.map((g) => {
                const isSelected = g.id === grind.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGrind(g)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-stone-900">
                        {g.name}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                      ) : (
                        <Coffee className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                      {g.description}
                    </p>
                    <div className="mt-1.5 inline-block text-[10px] text-amber-800/90 font-medium bg-amber-100/50 px-2 py-0.5 rounded">
                      Ideal: {g.idealFor}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 4: CANTIDAD Y PRECIO */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Cantidad
                </h3>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-3 bg-stone-100 p-1 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  aria-label="Disminuir cantidad"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-xl bg-white text-stone-700 flex items-center justify-center disabled:opacity-40 shadow-xs hover:bg-stone-50 active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-stone-900 text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar cantidad"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center shadow-xs hover:bg-amber-800 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Wholesale Banner if 4+ */}
            {quantity >= 4 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  ¿Interesado en mayoreo para cafetería o restaurante? Pregúntanos por nuestro precio especial por caja o costal.
                </span>
              </div>
            )}

            {/* Desglose de Subtotal */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-sm">
              <span className="text-stone-500 font-medium">Subtotal estimado:</span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif font-bold text-2xl text-stone-900">
                  ${totalPrice}
                </span>
                <span className="text-xs text-stone-500">MXN</span>
              </div>
            </div>
          </div>

          {/* PASO 5: DATOS DEL CLIENTE Y ENVÍO */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Datos de Entrega y Contacto
              </h3>
            </div>

            {/* Selector de Método de Entrega */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'local_tapachula' as DeliveryMethod,
                  label: 'Entrega en Tapachula',
                  sub: 'A domicilio',
                  icon: Truck,
                },
                {
                  id: 'pickup' as DeliveryMethod,
                  label: 'Recoger en Tienda',
                  sub: 'Tapachula Centro',
                  icon: Store,
                },
                {
                  id: 'shipping_mx' as DeliveryMethod,
                  label: 'Envío Nacional',
                  sub: 'A todo México',
                  icon: MapPin,
                },
              ].map((method) => {
                const isSelected = deliveryMethod === method.id;
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setDeliveryMethod(method.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-amber-700' : 'text-stone-400'}`} />
                    <div className="font-bold text-xs leading-tight">{method.label}</div>
                    <div className="text-[10px] text-stone-500">{method.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Campos de Entrada */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Roberto Ordóñez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Número de Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ej. 962 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                />
              </div>

              {deliveryMethod !== 'pickup' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dirección de Entrega *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, colonia, código postal y ciudad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notas adicionales (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Es para regalo, requiero factura, tostado reciente..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                />
              </div>

              {showValidation && (!customerName || !customerPhone || (deliveryMethod !== 'pickup' && !address)) && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Por favor completa tu nombre, teléfono y dirección para generar el pedido.</span>
                </div>
              )}
            </div>

            {/* BOTÓN PRINCIPAL DE PEDIDO WHATSAPP */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Confirmar Pedido por WhatsApp • ${totalPrice} MXN</span>
              </button>
              <p className="text-[11px] text-stone-500 text-center mt-2">
                Te responderemos al instante con los datos de pago (transferencia, tarjeta o pago contra entrega en Tapachula).
              </p>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
