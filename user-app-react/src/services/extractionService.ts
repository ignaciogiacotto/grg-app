import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/extractions`;

export type ExtractionStatus = "Pendiente" | "Disponible" | "Avisado" | "Completado";

export interface IExtraction {
  _id: string;
  amount: number;
  clientNumber: string;
  type: "Western Union" | "Debit/MP";
  status: ExtractionStatus;
  isArchived: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getExtractions = async (): Promise<IExtraction[]> => {
  const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createExtraction = async (data: {
  amount: number;
  clientNumber: string;
  type: "Western Union" | "Debit/MP";
}): Promise<IExtraction> => {
  const token = getAuthToken();
  const response = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateExtraction = async (
  id: string,
  updates: {
    status?: ExtractionStatus;
    isArchived?: boolean;
    description?: string;
    type?: "Western Union" | "Debit/MP";
  }
): Promise<IExtraction> => {
  const token = getAuthToken();
  const response = await axios.patch(`${API_URL}/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const archiveAllCompleted = async (): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.delete(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
