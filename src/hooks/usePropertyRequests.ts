import { useQuery } from '@tanstack/react-query';
import ApiService from '../services/api';

export function usePropertyRequests(filters: { category?: string; house_type?: string; city?: string; state?: string; page?: number }) {
  const queryParams = new URLSearchParams();
  if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
  if (filters.house_type) queryParams.append('house_type', filters.house_type);
  if (filters.city) queryParams.append('city', filters.city);
  if (filters.state) queryParams.append('state', filters.state);
  if (filters.page) queryParams.append('page', filters.page.toString());

  const queryKey = ['property-requests', filters];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response: any = await ApiService.requests.getAll(queryParams.toString());
      return response;
    },
  });
}
