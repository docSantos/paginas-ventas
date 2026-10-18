// src/lib/mrrobottoThemes.ts
import { ProductoRobotica, TutorialModulo } from "@/types/mrrobotto";

export interface ProductCategoryTheme {
  tipo: "kits" | "stl" | "otros";
  label: string;
  bgHex: string;
  bgHoverHex: string;
  borderHex: string;
  imageBgHex: string;
  cardBg: string;
  cardBorder: string;
  badge: string;
  accentText: string;
  imageWrapper: string;
  divider: string;
}

export function getProductCategoryTheme(producto: ProductoRobotica): ProductCategoryTheme {
  const cat = (producto.categoria || "").toLowerCase();
  const esKit =
    cat.includes("kit") ||
    cat.includes("robótica") ||
    cat.includes("robotica") ||
    cat.includes("brazo") ||
    cat.includes("otto") ||
    cat.includes("escualo");

  const esStl =
    producto.esDigital === true ||
    cat.includes("3d") ||
    cat.includes("stl") ||
    cat.includes("impresión") ||
    cat.includes("impresion");

  if (esKit) {
    return {
      tipo: "kits",
      label: "Kit de Robótica",
      // Color pastel rosa/cálido distintivo y visible (Rose 100/200)
      bgHex: "#FFE4E8",
      bgHoverHex: "#FED7DE",
      borderHex: "#FDA4AF",
      imageBgHex: "#FFF1F2",
      cardBg: "bg-[#FFE4E8] hover:bg-[#FED7DE]",
      cardBorder: "border-[#FDA4AF] hover:border-[#FB7185]",
      badge: "bg-white text-rose-800 border-rose-300 shadow-2xs font-bold",
      accentText: "text-rose-700",
      imageWrapper: "bg-[#FFF1F2] border-rose-200",
      divider: "border-[#FECDD3]"
    };
  }

  if (esStl) {
    return {
      tipo: "stl",
      label: "Archivo 3D (.STL)",
      // Color pastel lavanda/índigo digital distintivo y visible (Violet 100/200)
      bgHex: "#EDE9FE",
      bgHoverHex: "#DDD6FE",
      borderHex: "#C7D2FE",
      imageBgHex: "#F5F3FF",
      cardBg: "bg-[#EDE9FE] hover:bg-[#DDD6FE]",
      cardBorder: "border-[#C7D2FE] hover:border-[#818CF8]",
      badge: "bg-white text-indigo-800 border-indigo-300 shadow-2xs font-bold",
      accentText: "text-indigo-700",
      imageWrapper: "bg-[#F5F3FF] border-indigo-200",
      divider: "border-[#C7D2FE]"
    };
  }

  // Componentes & Módulos (Electrónica, sensores, ESP32, prototipado)
  return {
    tipo: "otros",
    label: "Componente Maker",
    // Color pastel menta/teal tecnológico distintivo y visible (Teal 100/200)
    bgHex: "#CCFBF1",
    bgHoverHex: "#99F6E4",
    borderHex: "#5EEAD4",
    imageBgHex: "#F0FDFA",
    cardBg: "bg-[#CCFBF1] hover:bg-[#99F6E4]",
    cardBorder: "border-[#5EEAD4] hover:border-[#2DD4BF]",
    badge: "bg-white text-teal-800 border-teal-300 shadow-2xs font-bold",
    accentText: "text-teal-700",
    imageWrapper: "bg-[#F0FDFA] border-teal-200",
    divider: "border-[#99F6E4]"
  };
}

export interface TutorialCategoryTheme {
  tipo: "sensores" | "displays" | "motores" | "comunicacion" | "robotica" | "otros";
  label: string;
  bgHex: string;
  borderHex: string;
  badge: string;
  accentText: string;
  divider: string;
}

export function getTutorialCategoryTheme(tutorial: TutorialModulo): TutorialCategoryTheme {
  const cat = (tutorial.categoria || "").toLowerCase();

  if (cat.includes("sensor")) {
    return {
      tipo: "sensores",
      label: "Sensores",
      bgHex: "#E0F7FA", // Cian pastel claro fresco
      borderHex: "#A5F3FC",
      badge: "bg-white text-cyan-800 border-cyan-300 font-bold",
      accentText: "text-cyan-700",
      divider: "border-cyan-200"
    };
  }

  if (cat.includes("display")) {
    return {
      tipo: "displays",
      label: "Displays",
      bgHex: "#E0F2FE", // Azul cielo / sky pastel claro
      borderHex: "#BAE6FD",
      badge: "bg-white text-sky-800 border-sky-300 font-bold",
      accentText: "text-sky-700",
      divider: "border-sky-200"
    };
  }

  if (cat.includes("motor") || cat.includes("actuador")) {
    return {
      tipo: "motores",
      label: "Motores & Actuadores",
      bgHex: "#FEF3C7", // Ámbar / cálido pastel suave
      borderHex: "#FDE68A",
      badge: "bg-white text-amber-900 border-amber-300 font-bold",
      accentText: "text-amber-800",
      divider: "border-amber-200"
    };
  }

  if (cat.includes("comunicación") || cat.includes("comunicacion") || cat.includes("wifi") || cat.includes("iot")) {
    return {
      tipo: "comunicacion",
      label: "Comunicación & IoT",
      bgHex: "#D1FAE5", // Esmeralda / menta pastel suave
      borderHex: "#A7F3D0",
      badge: "bg-white text-emerald-900 border-emerald-300 font-bold",
      accentText: "text-emerald-700",
      divider: "border-emerald-200"
    };
  }

  if (cat.includes("kit") || cat.includes("robótica") || cat.includes("robotica") || cat.includes("brazo")) {
    return {
      tipo: "robotica",
      label: "Robótica Práctica",
      bgHex: "#FFE4E8", // Rosa cálido pastel suave
      borderHex: "#FDA4AF",
      badge: "bg-white text-rose-800 border-rose-300 font-bold",
      accentText: "text-rose-700",
      divider: "border-rose-200"
    };
  }

  return {
    tipo: "otros",
    label: "Electrónica Maker",
    bgHex: "#F1F5F9",
    borderHex: "#CBD5E1",
    badge: "bg-white text-slate-800 border-slate-300 font-bold",
    accentText: "text-slate-800",
    divider: "border-slate-200"
  };
}
