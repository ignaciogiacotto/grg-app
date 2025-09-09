import axios from "axios";

const API_URL = "http://localhost:4000/api/cierre-pf";

// Define the interface for the Cierre PF data
export interface ICierrePf {
  western: number;
  mp: number;
  liga: number;
  santander: number;
  giros: number;
  uala: number;
  naranjaX: number;
  nsaAgencia: number;
  brubank: number;
  direcTv: number;
  extracciones: number;
  recargas: number;
  cantTotalFacturas: number;
  descFacturas: number;
  totalGanancia: number;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getCierresPf = async () => {
  const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCierrePfById = async (id: string) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createCierrePf = async (cierre: ICierrePf) => {
  const token = getAuthToken();
  const response = await axios.post(API_URL, cierre, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCierrePf = async (id: string, cierre: ICierrePf) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/${id}`, cierre, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteCierrePf = async (id: string) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};