import api from "./api";

// Interface for BoletaEspecial in CierrePf
export interface IBoletaEspecialCierre {
  name: string;
  quantity: number;
  value: number;
}

// Interface for CierrePf
export interface ICierrePf {
  _id?: string;
  date?: string;
  boletasEspeciales: IBoletaEspecialCierre[];
  cantidadTotalBoletas: number;
  recargas: number;
  recargasSubtotal: number;
  westernUnionQuantity?: number;
  totalGanancia: number;
}

// Interface for BoletaEspecial from DB
export interface IBoletaEspecialDB {
  _id: string;
  name: string;
  value: number;
  order?: number;
}

const API_ENDPOINT = "/api/cierre-pf";

// CierrePf services
const getCierresPf = async () => {
  const response = await api.get(API_ENDPOINT);
  return response.data;
};

const getCierrePfById = async (id: string) => {
  const response = await api.get(`${API_ENDPOINT}/${id}`);
  return response.data;
};

const createCierrePf = async (cierre: ICierrePf) => {
  const response = await api.post(API_ENDPOINT, cierre);
  return response.data;
};

const updateCierrePf = async (id: string, cierre: ICierrePf) => {
  const response = await api.put(`${API_ENDPOINT}/${id}`, cierre);
  return response.data;
};

const deleteCierrePf = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINT}/${id}`);
  return response.data;
};

// BoletaEspecial services
const BOLETAS_API_ENDPOINT = `${API_ENDPOINT}/boletas`;

const getBoletasEspeciales = async (): Promise<IBoletaEspecialDB[]> => {
  const response = await api.get(BOLETAS_API_ENDPOINT);
  return response.data;
};

const createBoletaEspecial = async (boleta: {
  name: string;
  value: number;
  order?: number;
}): Promise<IBoletaEspecialDB> => {
  const response = await api.post(BOLETAS_API_ENDPOINT, boleta);
  return response.data;
};

const updateBoletaEspecial = async (
  id: string,
  boleta: { name: string; value: number; order?: number }
): Promise<IBoletaEspecialDB> => {
  const response = await api.put(`${BOLETAS_API_ENDPOINT}/${id}`, boleta);
  return response.data;
};

const deleteBoletaEspecial = async (id: string) => {
  await api.delete(`${BOLETAS_API_ENDPOINT}/${id}`);
};

const cierrePfService = {
  getCierresPf,
  getCierrePfById,
  createCierrePf,
  updateCierrePf,
  deleteCierrePf,
  getBoletasEspeciales,
  createBoletaEspecial,
  updateBoletaEspecial,
  deleteBoletaEspecial,
};

export default cierrePfService;
