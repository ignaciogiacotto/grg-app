import axios from "axios";

const API_URL = "http://localhost:4000/api/cierre-pf";

// Interface for BoletaEspecial in CierrePf
export interface IBoletaEspecialCierre {
  name: string;
  quantity: number;
  value: number;
}

// Interface for CierrePf
export interface ICierrePf {
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
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

// CierrePf services
const getCierresPf = async () => {
  const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getCierrePfById = async (id: string) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const createCierrePf = async (cierre: ICierrePf) => {
  const token = getAuthToken();
  const response = await axios.post(API_URL, cierre, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateCierrePf = async (id: string, cierre: ICierrePf) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/${id}`, cierre, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteCierrePf = async (id: string) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// BoletaEspecial services
const BOLETAS_API_URL = `${API_URL}/boletas`;

const getBoletasEspeciales = async (): Promise<IBoletaEspecialDB[]> => {
  const token = getAuthToken();
  const response = await axios.get(BOLETAS_API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const createBoletaEspecial = async (boleta: {
  name: string;
  value: number;
}): Promise<IBoletaEspecialDB> => {
  const token = getAuthToken();
  const response = await axios.post(BOLETAS_API_URL, boleta, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateBoletaEspecial = async (
  id: string,
  boleta: { name: string; value: number }
): Promise<IBoletaEspecialDB> => {
  const token = getAuthToken();
  const response = await axios.put(`${BOLETAS_API_URL}/${id}`, boleta, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteBoletaEspecial = async (id: string) => {
  const token = getAuthToken();
  await axios.delete(`${BOLETAS_API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
