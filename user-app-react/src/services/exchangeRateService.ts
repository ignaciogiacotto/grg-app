import api from "./api";

export interface ExchangeRate {
  rate: number;
}

const API_ENDPOINT = "/api/exchange-rates";

export const getExchangeRate = async (
  countryCode: string
): Promise<ExchangeRate> => {
  const response = await api.get(`${API_ENDPOINT}/${countryCode}`);
  return response.data;
};
