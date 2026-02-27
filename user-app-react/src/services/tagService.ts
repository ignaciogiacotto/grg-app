import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/tags`;

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getTags = async () => {
  const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTag = async (tag: any) => {
  const token = getAuthToken();
  const response = await axios.post(API_URL, tag, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTag = async (id: string) => {
  const token = getAuthToken();
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const tagService = {
    getTags,
    createTag,
    deleteTag,
};

export default tagService;
