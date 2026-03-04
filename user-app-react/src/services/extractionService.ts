import api from "./api";

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

const API_ENDPOINT = "/api/extractions";

export const getExtractions = async (): Promise<IExtraction[]> => {
  const response = await api.get(API_ENDPOINT);
  return response.data;
};

export const createExtraction = async (data: {
  amount: number;
  clientNumber: string;
  type: "Western Union" | "Debit/MP";
}): Promise<IExtraction> => {
  const response = await api.post(API_ENDPOINT, data);
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
  const response = await api.patch(`${API_ENDPOINT}/${id}`, updates);
  return response.data;
};

export const archiveAllCompleted = async (): Promise<any> => {
  const response = await api.delete(API_ENDPOINT);
  return response.data;
};
