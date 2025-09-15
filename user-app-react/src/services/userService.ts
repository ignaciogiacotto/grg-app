import axios from "axios";

const API_URL = "http://localhost:4000/users";

export interface IUser {
  _id?: string;
  name: string;
  username: string;
  email: string;
  role: string;
  password?: string;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getUsers = async (page: number, pageSize: number = 5) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}?page=${page}&size=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserById = async (id: string) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createUser = async (user: IUser) => {
  const token = getAuthToken();
  const response = await axios.post(API_URL, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUser = async (id: string, user: IUser) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/${id}`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};