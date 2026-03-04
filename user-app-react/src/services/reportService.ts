import api from "./api";

export interface DailyProfit {
  date: string;
  kioscoProfit: number;
  pfProfit: number;
}

const API_ENDPOINT = "/api/reports";

export const getDailyProfitReport = async (
  period: "day" | "week" | "month" | "year" | "range",
  year?: number,
  month?: number,
  week?: number,
  date?: string,
  startDate?: string,
  endDate?: string
): Promise<DailyProfit[]> => {
  const response = await api.get(`${API_ENDPOINT}/daily-profit`, {
    params: {
      period,
      year,
      month,
      week,
      date,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export interface EnvelopeSummary {
  cigarettes: number;
  recharges: number;
  grg: number;
}

export const getEnvelopeSummary = async (): Promise<EnvelopeSummary> => {
  const response = await api.get(`${API_ENDPOINT}/envelope-summary`);
  return response.data;
};

export interface KioscoProfitByCategory {
  facturaB: number;
  remitos: number;
  cyber: number;
  cargasVirtuales: number;
}

export const getKioscoProfitByCategoryReport = async (
  startDate: string,
  endDate: string
): Promise<KioscoProfitByCategory> => {
  const response = await api.get(`${API_ENDPOINT}/kiosco-profit-by-category`, {
    params: {
      startDate,
      endDate,
    },
  });
  return response.data;
};
