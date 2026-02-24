import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/reports`;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export interface DailyProfit {
  date: string;
  kioscoProfit: number;
  pfProfit: number;
}

export const getDailyProfitReport = async (
  period: "day" | "week" | "month" | "year" | "range",
  year?: number,
  month?: number,
  week?: number,
  date?: string,
  startDate?: string,
  endDate?: string
): Promise<DailyProfit[]> => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/daily-profit`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/envelope-summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/kiosco-profit-by-category`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      startDate,
      endDate,
    },
  });
  return response.data;
};
