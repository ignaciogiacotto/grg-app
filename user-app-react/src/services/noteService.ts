import api from "./api";

const API_ENDPOINT = "/api/notes";

export const getNotes = async () => {
  const response = await api.get(API_ENDPOINT);
  return response.data;
};

export const createNote = async (note: any) => {
  const response = await api.post(API_ENDPOINT, note);
  return response.data;
};

export const updateNote = async (id: string, note: any) => {
  const response = await api.put(`${API_ENDPOINT}/${id}`, note);
  return response.data;
};

export const deleteNote = async (id: string) => {
  await api.delete(`${API_ENDPOINT}/${id}`);
};

export const markAsRead = async (id: string) => {
  const response = await api.put(`${API_ENDPOINT}/${id}/read`, {});
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get(`${API_ENDPOINT}/unread-count`);
  return response.data.count;
};

const noteService = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  markAsRead,
  getUnreadCount,
};

export default noteService;
