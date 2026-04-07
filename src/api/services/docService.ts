import apiClient from "../client";

const API_URL = '/document';


export const documentApi = {
    
    getDocuments: async (carId: number) => {
        const response = await apiClient.get(`${API_URL}/documents/${carId}`);
        return response.data;
    },

};