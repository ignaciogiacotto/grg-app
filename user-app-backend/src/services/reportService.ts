import { CierreKiosco, ICierreKiosco } from "../models/cierreKioscoModel";
import CierrePf, { ICierrePf } from "../models/cierrePfModel";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  setYear,
  setMonth,
  getWeek,
  startOfDay,
  endOfDay,
} from "date-fns";

interface DailyProfit {
  date: string;
  kioscoProfit: number;
  pfProfit: number;
}

const getYearDateRange = (year: number) => {
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year}-12-31T23:59:59.999Z`);
  return { start, end };
};

const getMonthDateRange = (year: number, month: number) => {
  const start = new Date(`${year}-${String(month).padStart(2, "0")}-01T00:00:00.000Z`);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const end = new Date(`${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}T23:59:59.999Z`);
  return { start, end };
};

const getWeekDateRange = (year: number, week: number) => {
  // En el estándar ISO, la semana 1 es la que tiene el primer jueves del año.
  // Un truco fiable es empezar en el 4 de enero (que siempre es semana 1).
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7; // 1 (Lun) a 7 (Dom)
  
  // Retrocedemos al lunes de esa semana 1
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setUTCDate(jan4.getUTCDate() - (dayOfWeek - 1));
  
  // Sumamos las semanas necesarias
  const start = new Date(mondayWeek1);
  start.setUTCDate(mondayWeek1.getUTCDate() + (week - 1) * 7);
  start.setUTCHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);
  
  return { start, end };
};

export const getDailyProfit = async (
  period: string,
  year?: number,
  month?: number,
  week?: number,
  date?: string,
  startDate?: string,
  endDate?: string
): Promise<DailyProfit[]> => {
  let start, end;
  const currentYear = new Date().getFullYear();

  switch (period) {
    case "day":
      const dayStr = date || new Date().toISOString().split("T")[0];
      start = new Date(`${dayStr}T00:00:00.000Z`);
      end = new Date(`${dayStr}T23:59:59.999Z`);
      break;
    case "range":
      start = startDate ? new Date(`${startDate}T00:00:00.000Z`) : startOfDay(new Date());
      end = endDate ? new Date(`${endDate}T23:59:59.999Z`) : endOfDay(new Date());
      break;
    case "year":
      ({ start, end } = getYearDateRange(year || currentYear));
      break;
    case "month":
      ({ start, end } = getMonthDateRange(year || currentYear, month || (new Date().getMonth() + 1)));
      break;
    case "week":
      ({ start, end } = getWeekDateRange(year || currentYear, week || 1));
      break;
    default:
      ({ start, end } = getMonthDateRange(currentYear, new Date().getMonth() + 1));
  }

  const kioscoData = await CierreKiosco.find({
    date: {
      $gte: start,
      $lte: end,
    },
  });

  const pfData = await CierrePf.find({
    date: {
      $gte: start,
      $lte: end,
    },
  });

  const profitMap: Map<string, { kioscoProfit: number; pfProfit: number }> =
    new Map();

  kioscoData.forEach((cierre: ICierreKiosco) => {
    // Extraemos los componentes UTC para que coincida con la lógica de formatDate del frontend
    const d = cierre.date;
    const date = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    
    if (!profitMap.has(date)) {
      profitMap.set(date, { kioscoProfit: 0, pfProfit: 0 });
    }
    profitMap.get(date)!.kioscoProfit += cierre.totalCaja;
  });

  pfData.forEach((cierre: ICierrePf) => {
    const d = cierre.date;
    const date = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    
    if (!profitMap.has(date)) {
      profitMap.set(date, { kioscoProfit: 0, pfProfit: 0 });
    }
    profitMap.get(date)!.pfProfit += cierre.totalGanancia;
  });

  const result: DailyProfit[] = Array.from(profitMap.entries())
    .map(([date, profits]) => ({
      date,
      ...profits,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return result;
};

export const getKioscoProfitByCategory = async (
  startDate: string,
  endDate: string
) => {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T23:59:59.999Z`);

  const kioscoData = await CierreKiosco.find({
    date: {
      $gte: start,
      $lte: end,
    },
  });

  const initialProfit = {
    facturaB: 0,
    remitos: 0,
    cyber: 0,
    cargasVirtuales: 0,
  };

  const totalProfit = kioscoData.reduce((acc, cierre) => {
    acc.facturaB += cierre.fac1;
    acc.remitos += cierre.fac2;
    acc.cyber += cierre.cyber;
    acc.cargasVirtuales += cierre.cargVirt;
    return acc;
  }, initialProfit);

  return totalProfit;
};

export const getEnvelopeSummary = async () => {
  // Obtenemos la fecha actual en formato YYYY-MM-DD (hora local)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  // Creamos el rango UTC que corresponde a ese día
  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);

  const kioscoClosing = await CierreKiosco.findOne({
    date: {
      $gte: start,
      $lte: end,
    },
  }).sort({ date: -1 });

  if (!kioscoClosing) {
    return {
      cigarettes: 0,
      recharges: 0,
      grg: 0,
    };
  }

  return {
    cigarettes: kioscoClosing.totalCigarros,
    recharges: kioscoClosing.cargVirt * 10, // Mantengo la lógica existente, aunque puede requerir ajuste
    grg: kioscoClosing.totalCaja,
  };
};
