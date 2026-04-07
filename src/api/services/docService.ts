import apiClient from "../client";

const API_URL = '/document';

export interface DocumentCredentials {
  documentCategoryId: number;
  expiryDate: Date;
}

export const documentApi = {

    getDocumentCategories: async () => {
        const response = await apiClient.get(`${API_URL}/documentCategories`);
        return response.data;
    },
    
    getDocuments: async (carId: number) => {
        const response = await apiClient.get(`${API_URL}/documents/${carId}`);
        return response.data;
    },
    
    register: async (credentials: DocumentCredentials, carId: number) => {
        const response = await apiClient.post(`${API_URL}/documents/${carId}`, { ...credentials });
        return response.data;
    },

    update: async (credentials: DocumentCredentials, carId: number, documentId: number) => {
        const response = await apiClient.put(`${API_URL}/documents/${carId}/${documentId}`, { ...credentials });
        return response.data;
    },
};