import apiClient from "../client";

const API_URL = '/car';

export interface CarCredentials {
  brand: string;
  model: string;
  year: unknown;
  kilometers: unknown;
}

export const carApi = {

  register: async (credentials: CarCredentials) => {
    const response = await apiClient.post(`${API_URL}/add`, credentials);
    return response.data;
  },


};