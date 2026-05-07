import api from './api';
import { PropertyRequest } from '../types/propertyRequest';

export const requestService = {
  getRequests: async (params?: { category?: string; house_type?: string; city?: string; state?: string; page?: number }) => {
    const response = await api.get('/property-requests', { params });
    return response.data;
  },

  submitRequest: async (data: Partial<PropertyRequest>) => {
    const response = await api.post('/property-requests', data);
    return response.data;
  },

  getAdminRequests: async (page: number = 1) => {
    const response = await api.get(`/admin/property-requests?page=${page}`);
    return response.data;
  },

  deleteRequest: async (id: number) => {
    const response = await api.delete(`/admin/property-requests/${id}`);
    return response.data;
  }
};
