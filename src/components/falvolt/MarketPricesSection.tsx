// src/components/falvolt/MarketPricesSection.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TWO_YEARS_MONTHLY_PRICE_HISTORY,
  MONTHLY_PRICE_HISTORY,
  WEEKLY_PRICE_HISTORY,
  SEASONAL_STAGES_TABLE,
  SOURCING_STRATEGY,
  DEFAULT_SIMULATOR_PARAMS,
  OFFICIAL_MONITORING_LINKS,
} from '@/data/coffeeMarketData';
import {
  CoffeePriceHistoryPoint,
  SeasonalStage,
  SeasonStatusType,
} from '@/types/falvolt';
import {
  TrendingUp,
  Calendar,
  Layers,
  Calculator,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Info,
  DollarSign,
  Warehouse,
  Flame,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';

export function MarketPricesSection() {
  // Estado para la gráfica (2 Años Mensuales como vista inicial por defecto)
  const [timeframe, setTimeframe] = useState<'two_years' | 'one_year' | 'weekly'>('two_years');
  const [metric, setMetric] = useState<'ny' | 'pergamino' | 'quintal'>('ny');
  const [hoveredPoint, setHoveredPoint] = useState<CoffeePriceHistoryPoint | null>(null);

  // Estado del Simulador en Vivo para el Administrador
  const [simParams, setSimParams] = useState(DEFAULT_SIMULATOR_PARAMS);

  // Datos activos para la gráfica
  const activeData = useMemo(() => {
    if (timeframe === 'two_years') return TWO_YEARS_MONTHLY_PRICE_HISTORY;
    if (timeframe === 'one_year') return MONTHLY_PRICE_HISTORY;
    return WEEKLY_PRICE_HISTORY;
  }, [timeframe]);

  // Cálculo de min y max para escalar el SVG dinámicamente
  const getMetricValue = (point: CoffeePriceHistoryPoint): number => {
    switch (metric) {
      case 'ny':
        return point.nyCentsLb;
      case 'pergamino':
        return point.mxnPerKgPergamino;
      case 'quintal':
        return point.mxnPerQuintalPergamino;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'ny':
        return '¢ USD / libra (Bolsa NY)';
      case 'pergamino':
        return '$ MXN / kg Pergamino';
      case 'quintal':
        return '$ MXN / Quintal (57.5 kg)';
    }
  };

  const values = activeData.map(getMetricValue);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.15 || 10;
  const domainMin = Math.floor(minVal - padding);
  const domainMax = Math.ceil(maxVal + padding);

  // Dimensiones del gráfico SVG
  const svgWidth = 600;
  const svgHeight = 220;
  const margin = { top: 20, right: 20, bottom: 35, left: 45 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  // Puntos calculados para el Path SVG
  const points = useMemo(() => {
    return activeData.map((d, i) => {
      const x = margin.left + (i / (activeData.length - 1)) * chartWidth;
      const val = getMetricValue(d);
      const y =
        margin.top +
        chartHeight -
        ((val - domainMin) / (domainMax - domainMin)) * chartHeight;
      return { x, y, data: d, val };
    });
  }, [activeData, metric, domainMin, domainMax]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const bottomY = margin.top + chartHeight;
    return `${pathD} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [pathD, points, margin.top, chartHeight]);

  // Cálculos en tiempo real del Simulador de Precios
  const simulationResults = useMemo(() => {
    // 1 libra = 0.453592 kg -> 1 kg = 2.20462 libras
    // nyPriceCentsLb en dólares: nyPriceCentsLb / 100
    const nyPriceUsdPerLb = simParams.nyPriceCentsLb / 100;
    
    // Costo base por libra en USD sumando el diferencial de altura
    // El diferencial suele cotizarse en centavos de USD/lb o USD/quintal.
    const diffPerLb = simParams.qualityDifferentialUsd / 100;
    const totalUsdPerLb = nyPriceUsdPerLb + diffPerLb;

    // Costo por kg en café Oro Verde (exportación / trillado) en MXN
    const costPerKgOroMxn = totalUsdPerLb * 2.20462 * simParams.usdMxnRate;

    // 1 Quintal de pergamino (57.5 kg) rinde aprox 46 kg de café oro (factor 0.80 aprox)
    const costPerQuintalPergaminoMxn = costPerKgOroMxn * 46;
    const costPerKgPergaminoMxn = costPerQuintalPergaminoMxn / 57.5;

    // Costo por kg de café tostado considerando la merma térmica (roastWeightLossPct)
    // Si la merma es 18%, 1 kg de café oro produce 0.82 kg tostado.
    const roastedYieldFactor = (100 - simParams.roastWeightLossPct) / 100;
    const costPerKgTostadoMxn = costPerKgOroMxn / roastedYieldFactor;

    return {
      costPerKgOroMxn: Math.round(costPerKgOroMxn * 10) / 10,
      costPerQuintalPergaminoMxn: Math.round(costPerQuintalPergaminoMxn),
      costPerKgPergaminoMxn: Math.round(costPerKgPergaminoMxn * 10) / 10,
      costPerKgTostadoMxn: Math.round(costPerKgTostadoMxn * 10) / 10,
    };
  }, [simParams]);

  // Helper de badges para el calendario estacional
  const getBadgeStyle = (status: SeasonStatusType) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'caution':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'warning':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/30';
      case 'danger':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/30';
    }
  };

  const getStatusIcon = (status: SeasonStatusType) => {
    switch (status) {
      case 'optimal':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'caution':
        return <Info className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />;
      case 'danger':
        return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Barra superior de retorno a Café Fal-Volt */}
      <div className="flex items-center justify-between">
        <Link
          href="/falvoltcafe"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:text-amber-800 hover:border-amber-300 shadow-2xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-700" />
          <span>Volver a Café Fal-Volt</span>
        </Link>

        <span className="text-[11px] font-medium text-stone-400">
          Sierra de Tapachula, Chiapas
        </span>
      </div>

      {/* Encabezado Principal */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          <span>Inteligencia de Mercado y Abastecimiento</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
          Monitor de Precios de Café Chiapas
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Herramienta de análisis estacional, cotizaciones históricas y simulador de costos para compras estratégicas en la Sierra de Tapachula.
        </p>
      </div>

      {/* KPI Ticker Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">
            Bolsa NY (Arábica)
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif font-bold text-lg text-stone-900">292.0</span>
            <span className="text-[10px] text-stone-500">¢/lb</span>
          </div>
          <span className="text-[10px] text-amber-700 font-medium">Contrato C (ICE)</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">
            Quintal Pergamino
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif font-bold text-lg text-amber-800">$5,750</span>
            <span className="text-[10px] text-stone-500">MXN</span>
          </div>
          <span className="text-[10px] text-stone-500">57.5 kg seco</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">
            Kg Pergamino
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif font-bold text-lg text-stone-900">$100.0</span>
            <span className="text-[10px] text-stone-500">MXN</span>
          </div>
          <span className="text-[10px] text-stone-500">10-12% humedad</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">
            Etapa de Cosecha
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif font-bold text-sm text-orange-700 leading-tight">
              Octubre
            </span>
          </div>
          <span className="text-[10px] text-orange-600 font-medium">Cortes Tempranos</span>
        </div>
      </div>

      {/* SECCIÓN 1: GRÁFICA DE HISTORIAL DE PRECIOS */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-700" />
              <span>Historial y Comportamiento de Precios</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {timeframe === 'two_years' && 'Historial mensual de los últimos 2 años (24 meses: Nov 2024 – Oct 2026)'}
              {timeframe === 'one_year' && 'Historial mensual del último año (13 meses)'}
              {timeframe === 'weekly' && 'Monitoreo táctico semanal reciente (Últimas 8 semanas)'}
            </p>
          </div>

          {/* Toggle 2 Años (Mensual) / 1 Año / Semanal */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs self-start sm:self-auto">
            <button
              onClick={() => {
                setTimeframe('two_years');
                setHoveredPoint(null);
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all ${
                timeframe === 'two_years'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="hidden xs:inline">2 Años (Mensual)</span>
              <span className="xs:hidden">2 Años</span>
            </button>
            <button
              onClick={() => {
                setTimeframe('one_year');
                setHoveredPoint(null);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                timeframe === 'one_year'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              1 Año
            </button>
            <button
              onClick={() => {
                setTimeframe('weekly');
                setHoveredPoint(null);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                timeframe === 'weekly'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semanal
            </button>
          </div>
        </div>

        {/* Selector de Métrica */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { id: 'ny' as const, label: 'Bolsa NY (¢/lb)' },
            { id: 'pergamino' as const, label: 'Kg Pergamino ($ MXN)' },
            { id: 'quintal' as const, label: 'Quintal ($ MXN)' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                metric === m.id
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Contenedor de la Gráfica SVG */}
        <div className="relative pt-2">
          {/* Tooltip flotante o tarjeta de detalle */}
          {hoveredPoint && (
            <div className="mb-2 p-2.5 rounded-xl bg-stone-900 text-white text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border border-stone-700 shadow-md">
              <div>
                <span className="font-bold text-amber-300">{hoveredPoint.period}</span>
                {hoveredPoint.seasonTag && (
                  <span className="ml-2 text-[10px] text-stone-300 bg-stone-800 px-1.5 py-0.5 rounded">
                    {hoveredPoint.seasonTag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-stone-300">
                  NY: <strong className="text-white">{hoveredPoint.nyCentsLb} ¢/lb</strong>
                </span>
                <span className="text-stone-300">
                  Pergamino:{' '}
                  <strong className="text-amber-400">
                    ${hoveredPoint.mxnPerKgPergamino} MXN/kg
                  </strong>
                </span>
              </div>
            </div>
          )}

          {/* Gráfico SVG Vectorial Puro */}
          <div className="w-full overflow-hidden bg-stone-50/60 rounded-2xl border border-stone-200/80 p-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible touch-none"
            >
              <defs>
                <linearGradient id="coffeeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Líneas de cuadrícula horizontal */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = margin.top + chartHeight * ratio;
                const val = domainMax - ratio * (domainMax - domainMin);
                return (
                  <g key={ratio}>
                    <line
                      x1={margin.left}
                      y1={y}
                      x2={svgWidth - margin.right}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={margin.left - 6}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#9ca3af"
                    >
                      {Math.round(val)}
                    </text>
                  </g>
                );
              })}

              {/* Área bajo la curva */}
              <path d={areaD} fill="url(#coffeeGradient)" />

              {/* Línea principal */}
              <path
                d={pathD}
                fill="none"
                stroke="#b45309"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Puntos interactivos */}
              {points.map((p, i) => {
                const isHovered = hoveredPoint?.period === p.data.period;
                const isPeak = p.data.period.includes('Enero 2026') || p.data.period.includes('Febrero 2026');

                return (
                  <g
                    key={i}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(p.data)}
                    onClick={() => setHoveredPoint(p.data)}
                  >
                    {/* Zona táctil invisible amplia */}
                    <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                    {/* Punto visible */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 5.5 : isPeak ? 4.5 : 3}
                      fill={isHovered ? '#78350f' : isPeak ? '#059669' : '#b45309'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Etiquetas del eje X (alternadas en vista de 2 años para no saturar) */}
                    {(timeframe !== 'two_years' || i % 2 === 0 || i === activeData.length - 1 || isHovered) && (
                      <text
                        x={p.x}
                        y={svgHeight - 8}
                        textAnchor="middle"
                        fontSize={timeframe === 'two_years' ? '7.5' : '8.5'}
                        fill={isHovered ? '#78350f' : '#6b7280'}
                        fontWeight={isHovered ? 'bold' : 'normal'}
                      >
                        {p.data.shortLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>Puntos verdes: Temporada óptima de compra (Enero - Febrero)</span>
            </div>
            <span>Unidad: {getMetricLabel()}</span>
          </div>

          {/* Explicación de Precios Locales en Chiapas */}
          <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 text-[11px]">
                ¿Se basa en precios locales de Chiapas?
              </h4>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                <strong>Sí, totalmente.</strong> Las métricas en pesos (<strong>$ MXN / kg Pergamino</strong> y <strong>$ MXN / Quintal</strong>) representan el precio real liquidado en centros de acopio y fincas de Tapachula y el Soconusco. En la región, el precio físico se rige por el Contrato C de Arábica en la Bolsa de Nueva York convertido al tipo de cambio USD/MXN, sumando el <strong>diferencial de calidad por estricta altura (+30 a +45 USD/qq para cafés de especialidad o Marago)</strong> y descontando los costos y mermas locales del beneficio.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: TABLA DE CICLO ESTACIONAL (PUNTO 2) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
              Calendario Estacional de Compra en Chiapas
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Comportamiento de la cosecha en la Sierra de Tapachula y recomendación para el comprador:
          </p>
        </div>

        {/* Tarjetas / Tabla responsiva */}
        <div className="space-y-3">
          {SEASONAL_STAGES_TABLE.map((stage) => {
            const badgeClass = getBadgeStyle(stage.statusType);
            const icon = getStatusIcon(stage.statusType);

            return (
              <div
                key={stage.id}
                className={`p-4 rounded-2xl border transition-all ${
                  stage.isCurrent
                    ? 'border-orange-500/60 bg-orange-50/40 ring-2 ring-orange-500/20'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-stone-900">
                      {stage.months}
                    </span>
                    {stage.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[9px] font-bold uppercase tracking-wider">
                        Mes Actual
                      </span>
                    )}
                  </div>

                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badgeClass}`}>
                    {icon}
                    <span>{stage.recommendation}</span>
                  </div>
                </div>

                <div className="pt-2.5 space-y-1 text-xs">
                  <div className="font-medium text-stone-800">
                    <span className="text-stone-500">Etapa en la región:</span> {stage.stageName}
                  </div>
                  <div className="text-stone-600 text-[11px] leading-relaxed">
                    {stage.details}
                  </div>
                  <div className="text-[10px] text-stone-400 font-medium pt-0.5">
                    Zona: {stage.zone}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 3: PÁNELES Y AVISOS DE ESTRATEGIA (PUNTO 3) */}
      <div className="space-y-4">
        {/* Encabezado Punto 3 */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
            3
          </span>
          <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
            Plan Estratégico y Simulador de Compras
          </h2>
        </div>

        {/* Panel A: Plan de Abastecimiento Estratégico */}
        <div className="bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-3xl p-5 border border-amber-800/40 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Warehouse className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base text-amber-100">
              Estrategia de Abastecimiento para Fal-Volt
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
              <span className="text-amber-400 font-bold block">
                Regla de Oro: Concentración Anual
              </span>
              <p className="text-stone-300 leading-snug">
                Adquirir el <strong>{SOURCING_STRATEGY.concentrationPct}</strong> de las compras anuales entre <strong>{SOURCING_STRATEGY.goldenMonths}</strong> para asegurar el menor costo del ciclo y grano fresco.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
              <span className="text-amber-400 font-bold block">
                Estado Físico del Grano
              </span>
              <p className="text-stone-300 leading-snug">
                Comprar en <strong>{SOURCING_STRATEGY.idealGrainType}</strong> con <strong>{SOURCING_STRATEGY.idealHumidityRange}</strong> de humedad. El pergamino protege los aromas y permite trillar sólo lo que se va a tostar mes a mes.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-900/30 border border-amber-600/30 text-xs text-amber-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Táctica de Compra:</strong> Monitorear la Bolsa de Nueva York (ICE KC). Si se presenta una corrección o dip temporal entre enero y febrero, es el momento idóneo para cerrar compras con caficultores de la Sierra de Tapachula.
            </p>
          </div>
        </div>

        {/* Panel B: Simulador en Vivo de Costos para el Administrador */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif font-bold text-base text-stone-900">
                Simulador de Costos en Tiempo Real
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSimParams(DEFAULT_SIMULATOR_PARAMS)}
              className="text-[11px] text-amber-700 hover:text-amber-900 font-medium"
            >
              Restablecer valores
            </button>
          </div>

          <p className="text-xs text-stone-500">
            Ajusta los parámetros de mercado para estimar los costos reales de compra y tostado en Tapachula:
          </p>

          {/* Controles deslizantes e inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Input 1: Bolsa NY */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-stone-700">Bolsa NY (¢/lb)</label>
                <span className="font-bold text-stone-900">{simParams.nyPriceCentsLb} ¢</span>
              </div>
              <input
                type="range"
                min="180"
                max="360"
                step="1"
                value={simParams.nyPriceCentsLb}
                onChange={(e) =>
                  setSimParams({ ...simParams, nyPriceCentsLb: Number(e.target.value) })
                }
                className="w-full accent-amber-700"
              />
            </div>

            {/* Input 2: Tipo de Cambio */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-stone-700">Dólar USD/MXN</label>
                <span className="font-bold text-stone-900">${simParams.usdMxnRate}</span>
              </div>
              <input
                type="range"
                min="17.0"
                max="22.0"
                step="0.1"
                value={simParams.usdMxnRate}
                onChange={(e) =>
                  setSimParams({ ...simParams, usdMxnRate: Number(e.target.value) })
                }
                className="w-full accent-amber-700"
              />
            </div>

            {/* Input 3: Diferencial Calidad / Altura */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-stone-700">Diferencial Altura (USD/qq)</label>
                <span className="font-bold text-stone-900">+${simParams.qualityDifferentialUsd}</span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                step="5"
                value={simParams.qualityDifferentialUsd}
                onChange={(e) =>
                  setSimParams({ ...simParams, qualityDifferentialUsd: Number(e.target.value) })
                }
                className="w-full accent-amber-700"
              />
            </div>

            {/* Input 4: Merma por Tostado */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-stone-700">Merma de Tueste (%)</label>
                <span className="font-bold text-stone-900">{simParams.roastWeightLossPct}%</span>
              </div>
              <input
                type="range"
                min="14"
                max="22"
                step="0.5"
                value={simParams.roastWeightLossPct}
                onChange={(e) =>
                  setSimParams({ ...simParams, roastWeightLossPct: Number(e.target.value) })
                }
                className="w-full accent-amber-700"
              />
            </div>
          </div>

          {/* Resultados Calculados en Tiempo Real */}
          <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
              <span className="text-[10px] text-amber-900 uppercase font-semibold block">
                Quintal Pergamino
              </span>
              <span className="font-serif font-bold text-base text-amber-800 block mt-0.5">
                ${simulationResults.costPerQuintalPergaminoMxn}
              </span>
              <span className="text-[9px] text-stone-500">57.5 kg seco</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-600 uppercase font-semibold block">
                Kg Pergamino
              </span>
              <span className="font-serif font-bold text-base text-stone-900 block mt-0.5">
                ${simulationResults.costPerKgPergaminoMxn}
              </span>
              <span className="text-[9px] text-stone-500">MXN / kg</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-600 uppercase font-semibold block">
                Kg Café Oro Verde
              </span>
              <span className="font-serif font-bold text-base text-stone-900 block mt-0.5">
                ${simulationResults.costPerKgOroMxn}
              </span>
              <span className="text-[9px] text-stone-500">Trillado</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-900 text-white border border-stone-800">
              <span className="text-[10px] text-amber-300 uppercase font-semibold block">
                Kg Tostado Final
              </span>
              <span className="font-serif font-bold text-base text-amber-400 block mt-0.5">
                ${simulationResults.costPerKgTostadoMxn}
              </span>
              <span className="text-[9px] text-stone-400">Listo empaque</span>
            </div>
          </div>
        </div>

        {/* Panel C: Enlaces Oficiales de Monitoreo Directo */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-amber-700" />
            <h3 className="font-serif font-bold text-base text-stone-900">
              Fuentes Oficiales para Monitorear Precios
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            Acceso directo a las bolsas y reportes gubernamentales de referencia para el café de Chiapas:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {OFFICIAL_MONITORING_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl border border-stone-200 hover:border-amber-600 hover:shadow-xs bg-stone-50/40 hover:bg-white transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-stone-900 group-hover:text-amber-700 transition-colors">
                      {link.title}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${link.color}`}>
                      {link.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    {link.description}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-amber-700 font-semibold inline-flex items-center gap-1 group-hover:underline">
                  <span>Abrir plataforma</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Barra inferior de retorno rápido */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/falvoltcafe"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-100 font-semibold text-xs shadow-xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-700" />
            <span>Volver al Inicio de Fal-Volt</span>
          </Link>

          <Link
            href="/falvoltcafe?tab=comprar"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ir a Comprar Café</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
