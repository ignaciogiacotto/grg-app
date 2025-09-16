import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/tags`;

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

const tagService = {
    getTags,
    createTag,
};

export default tagService;
