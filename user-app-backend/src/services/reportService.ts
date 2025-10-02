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
  const date = setYear(new Date(), year);
  return { start: startOfYear(date), end: endOfYear(date) };
};

const getMonthDateRange = (year: number, month: number) => {
  let date = new Date();
  date = setYear(date, year);
  date = setMonth(date, month - 1); // month is 0-indexed in date-fns
  return { start: startOfMonth(date), end: endOfMonth(date) };
};

const getWeekDateRange = (year: number, week: number) => {
  let date = setYear(new Date(), year);
  const firstDayOfYear = startOfYear(date);
  const firstWeek = getWeek(firstDayOfYear);
  const day = firstDayOfYear.getDay();
  const diff = (week - firstWeek) * 7 - day + 1;
  date.setDate(firstDayOfYear.getDate() + diff);
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
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
      const day = date ? new Date(date) : new Date();
      start = startOfDay(day);
      end = endOfDay(day);
      break;
    case "range":
      if (startDate) {
        const [year, month, day] = startDate.split('-').map(Number);
        start = startOfDay(new Date(year, month - 1, day));
      } else {
        start = new Date();
      }
      if (endDate) {
        const [year, month, day] = endDate.split('-').map(Number);
        end = endOfDay(new Date(year, month - 1, day));
      } else {
        end = new Date();
      }
      break;
    case "year":
      ({ start, end } = getYearDateRange(year || currentYear));
      break;
    case "month":
      const currentMonth = new Date().getMonth() + 1;
      ({ start, end } = getMonthDateRange(
        year || currentYear,
        month || currentMonth
      ));
      break;
    case "week":
      const currentWeek = getWeek(new Date());
      ({ start, end } = getWeekDateRange(
        year || currentYear,
        week || currentWeek
      ));
      break;
    default:
      ({ start, end } = getMonthDateRange(
        currentYear,
        new Date().getMonth() + 1
      ));
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
    const date = cierre.date.toISOString().split("T")[0];
    if (!profitMap.has(date)) {
      profitMap.set(date, { kioscoProfit: 0, pfProfit: 0 });
    }
    profitMap.get(date)!.kioscoProfit += cierre.totalCaja;
  });

  pfData.forEach((cierre: ICierrePf) => {
    const date = cierre.date.toISOString().split("T")[0];
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
  const start = startOfDay(new Date(startDate));
  const end = endOfDay(new Date(endDate));

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
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const todayKioscoClosing = await CierreKiosco.findOne({
    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  }).sort({ date: -1 });

  if (!todayKioscoClosing) {
    return {
      cigarettes: 0,
      recharges: 0,
      grg: 0,
    };
  }

  return {
    cigarettes: todayKioscoClosing.totalCigarros,
    recharges: todayKioscoClosing.cargVirt * 10,
    grg: todayKioscoClosing.totalCaja,
  };
};
