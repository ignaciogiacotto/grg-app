
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/reports`;

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export interface DailyProfit {
  date: string;
  kioscoProfit: number;
  pfProfit: number;
}

export const getDailyProfitReport = async (period: 'week' | 'month' | 'year', year?: number, month?: number, week?: number): Promise<DailyProfit[]> => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/daily-profit`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      period,
      year,
      month,
      week
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
