import axios from "axios";

const API_URL = "http://localhost:4000/api/cierre-kiosco";

export interface ICierreKiosco {
  fac1: number;
  fac2: number;
  cyber: number;
  cargVirt: number;
  cigarros: {
    facturaB: { totalVenta: number; ganancia: number; costo?: number };
    remito: { totalVenta: number; ganancia: number; costo?: number };
  };
  totalCaja: number;
  totalCigarros: number;
  createdBy?: string;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getCierresKiosco = async () => {
  const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCierreKioscoById = async (id: string) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createCierreKiosco = async (cierre: ICierreKiosco) => {
  const token = getAuthToken();
  const response = await axios.post(API_URL, cierre, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCierreKiosco = async (id: string, cierre: ICierreKiosco) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/${id}`, cierre, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteCierreKiosco = async (id: string) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};