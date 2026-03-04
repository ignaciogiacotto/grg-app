import api from "./api";

export interface ICierreKiosco {
  _id: string;
  date: string;
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

const API_ENDPOINT = "/api/cierre-kiosco";

export const getCierresKiosco = async () => {
  const response = await api.get(API_ENDPOINT);
  return response.data;
};

export const getCierreKioscoById = async (id: string) => {
  const response = await api.get(`${API_ENDPOINT}/${id}`);
  return response.data;
};

export const createCierreKiosco = async (cierre: ICierreKiosco) => {
  const response = await api.post(API_ENDPOINT, cierre);
  return response.data;
};

export const updateCierreKiosco = async (id: string, cierre: ICierreKiosco) => {
  const response = await api.put(`${API_ENDPOINT}/${id}`, cierre);
  return response.data;
};

export const deleteCierreKiosco = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINT}/${id}`);
  return response.data;
};
