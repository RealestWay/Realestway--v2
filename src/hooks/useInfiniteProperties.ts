import { useInfiniteQuery } from '@tanstack/react-query';
import ApiService from '../services/api';

export function useInfiniteProperties(searchParamsString: string, options: { enabled?: boolean, initialData?: any } = {}) {
  return useInfiniteQuery({
    queryKey: ['properties', searchParamsString],
    queryFn: async ({ pageParam = 1 }) => {
      const response: any = await ApiService.properties.getAll(`${searchParamsString}&page=${pageParam}&limit=20`);
      return {
        data: response.data || [],
        nextPage: response.data?.length === 20 ? pageParam + 1 : undefined,
        total: response.total || response.data?.length || 0,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: options.enabled !== false,
    initialData: options.initialData,
  });
}
