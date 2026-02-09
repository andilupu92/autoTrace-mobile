import apiClient from "../client";

const API_URL = '/auth';

export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post(`${API_URL}/login`, {
    email,
    password,
  });
  
  return response.data;
};