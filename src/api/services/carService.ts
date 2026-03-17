import apiClient from "../client";

const API_URL = '/car';

export interface CarCredentials {
  brand: string;
  model: string;
  year: number;
  kilometers: number;
}

export const carApi = {

  cars: async () => {
    const response = await apiClient.get(`${API_URL}/get`);
    return response.data;
  },

  register: async (credentials: CarCredentials) => {
    const response = await apiClient.post(`${API_URL}/add`, credentials);
    return response.data;
  },

  getBrands: async () => {
    const response = await apiClient.get(`${API_URL}/brand/get`);
    return response.data;
  }


};