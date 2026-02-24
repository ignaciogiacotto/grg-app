import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/exchange-rates`;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export interface ExchangeRate {
  rate: number;
}

export const getExchangeRate = async (
  countryCode: string
): Promise<ExchangeRate> => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/${countryCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
