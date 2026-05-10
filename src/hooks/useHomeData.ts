import { useQuery } from '@tanstack/react-query';
import ApiService from '../services/api';

export function useHomeData() {
  return useQuery({
    queryKey: ['home_data'],
    queryFn: async () => {
      const response: any = await ApiService.properties.getHome();
      return response;
    },
    // The data is saved to localStorage via PersistQueryClientProvider
    // but we can also set initialData from localStorage if we want it to be synchronous
    // however, PersistQueryClientProvider handles this more elegantly.
  });
}

export function useCities() {
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
  });
}
