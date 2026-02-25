import apiClient from "../client";

const API_URL = '/car';

export interface CarCredentials {
  brand: string;
  model: string;
  year: string;
  kilometers: string;
}

export const carApi = {

  register: async (credentials: CarCredentials) => {
    const response = await apiClient.post(`${API_URL}/register`, credentials);
    return response.data;
  },


};