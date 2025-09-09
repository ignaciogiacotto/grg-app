import axios from "axios";

const API_URL = "http://localhost:4000/api/providers";

export interface IProvider {
  _id: string;
  day: string;
  providers: string[];
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getProviders = async (): Promise<IProvider[]> => {
  const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createProvider = async (day: string): Promise<IProvider> => {
  const token = getAuthToken();
  const response = await axios.post(
    API_URL,
    { day },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateProvider = async (
  day: string,
  providers: string[]
): Promise<IProvider> => {
  const token = getAuthToken();
  const response = await axios.put(
    `${API_URL}/${day}`,
    { providers },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};