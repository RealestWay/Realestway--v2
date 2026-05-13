import { useQuery } from '@tanstack/react-query';
import ApiService from '../services/api';

export function useHomeData(initialData?: any) {
  return useQuery({
    queryKey: ['home_data'],
    queryFn: async () => {
      const response: any = await ApiService.properties.getHome();
      return response;
    },
    initialData,
  });
}

export function useCities(initialData?: any[]) {
  return useQuery({
    queryKey: ['available_cities'],
    queryFn: async () => {
      const response: any = await ApiService.properties.getCities();
      if (response && response.data) {
        return response.data.map((c: any, i: number) => ({
          name: c.name,
          count: c.count,
          emoji: ['🏙️', '🏛️', '⚓', '🏘️', '🌆', '🌿'][i % 6],
        }));
      }
      return [];
    },
    initialData,
  });
}
