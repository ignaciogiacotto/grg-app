import api from "./api";

const API_ENDPOINT = "/api/tags";

export const getTags = async () => {
  const response = await api.get(API_ENDPOINT);
  return response.data;
};

export const createTag = async (tag: any) => {
  const response = await api.post(API_ENDPOINT, tag);
  return response.data;
};

export const deleteTag = async (id: string) => {
  await api.delete(`${API_ENDPOINT}/${id}`);
};

const tagService = {
  getTags,
  createTag,
  deleteTag,
};

export default tagService;
