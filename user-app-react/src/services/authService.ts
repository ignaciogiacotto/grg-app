import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

interface LoginResponse {
  token: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};