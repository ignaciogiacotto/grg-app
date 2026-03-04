import api from "./api";

export interface IProvider {
  _id: string;
  day: string;
  providers: string[];
}

const API_ENDPOINT = "/api/providers";

export const getProviders = async (): Promise<IProvider[]> => {
  const response = await api.get(API_ENDPOINT);
  return response.data;
};

export const createProvider = async (day: string): Promise<IProvider> => {
  const response = await api.post(API_ENDPOINT, { day });
  return response.data;
};

export const updateProvider = async (
  day: string,
  providers: string[]
): Promise<IProvider> => {
  const response = await api.put(`${API_ENDPOINT}/${day}`, { providers });
  return response.data;
};
