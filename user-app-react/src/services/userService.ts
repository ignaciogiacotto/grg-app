import api from "./api";

export interface IUser {
  _id?: string;
  name: string;
  username: string;
  email: string;
  role: string;
  password?: string;
}

const API_ENDPOINT = "/users";

export const getUsers = async (page: number, pageSize: number = 5) => {
  const response = await api.get(`${API_ENDPOINT}?page=${page}&size=${pageSize}`);
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get(`${API_ENDPOINT}/${id}`);
  return response.data;
};

export const createUser = async (user: IUser) => {
  const response = await api.post(API_ENDPOINT, user);
  return response.data;
};

export const updateUser = async (id: string, user: IUser) => {
  const response = await api.put(`${API_ENDPOINT}/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINT}/${id}`);
  return response.data;
};
