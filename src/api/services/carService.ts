import apiClient from "../client";

const API_URL = '/car';

export interface CarCredentials {
  brandId: number;
  modelId: number;
  year: number;
  kilometers: number;
}

export const carApi = {

  cars: async () => {
    const response = await apiClient.get(`${API_URL}/cars`);
    return response.data;
  },

  register: async (credentials: CarCredentials) => {
    const response = await apiClient.post(`${API_URL}/cars`, credentials);
    return response.data;
  },

  getBrands: async () => {
    const response = await apiClient.get(`${API_URL}/brands`);
    return response.data;
  },

  getModels: async (brand: number) => {
    const response = await apiClient.get(`${API_URL}/models/${brand}`);
    return response.data;
  }

};