import api from "./api";

interface LoginResponse {
  token: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post(`/login`, { username, password });
  return response.data;
};

export const refreshToken = async (token: string): Promise<LoginResponse> => {
  const response = await api.post(
    `/users/refresh-token`,
    {}
  );
  return response.data;
};
