import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/notes`;

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getNotes = async () => {
  const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createNote = async (note: any) => {
  const token = getAuthToken();
  const response = await axios.post(API_URL, note, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateNote = async (id: string, note: any) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/${id}`, note, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteNote = async (id: string) => {
  const token = getAuthToken();
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const markAsRead = async (id: string) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUnreadCount = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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