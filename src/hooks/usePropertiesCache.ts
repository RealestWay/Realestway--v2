import { useState, useEffect, useRef, useCallback } from 'react';
import ApiService from '@/src/services/api';

const CACHE_KEY = 'realestway_properties_cache';

export function usePropertiesCache(searchParamsString: string) {
  // All properties currently visible to the user
  const [displayedProperties, setDisplayedProperties] = useState<any[]>([]);
  
  // Properties fetched in the background but not yet shown
  const [prefetchedProperties, setPrefetchedProperties] = useState<any[]>([]);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Track how many times we've auto-loaded via scroll
  const [autoScrollCount, setAutoScrollCount] = useState(0);

  // We need a ref to keep track of the current active search params to prevent race conditions
  const currentParamsRef = useRef(searchParamsString);

  // 1. Initial Load & Background Fetch
  useEffect(() => {
    currentParamsRef.current = searchParamsString;
    setPage(1);
    setHasMore(true);
    setAutoScrollCount(0);
    setPrefetchedProperties([]);
    
    // Attempt to load from cache immediately
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Only use cache if the search params match (e.g. empty search vs specific search)
        if (parsed.searchParamsString === searchParamsString && parsed.data.length > 0) {
          setDisplayedProperties(parsed.data);
          setLoading(false); // We have data, hide initial loader
        } else {
          setDisplayedProperties([]);
          setLoading(true);
        }
      } else {
        setDisplayedProperties([]);
        setLoading(true);
      }
    } catch (e) {
      setDisplayedProperties([]);
      setLoading(true);
    }

    // Fetch fresh page 1 in background
    let isMounted = true;
    const fetchFirstPage = async () => {
      try {
        const res: any = await ApiService.properties.getAll(`${searchParamsString}&page=1&limit=12`);
        if (!isMounted || currentParamsRef.current !== searchParamsString) return;
        
        const freshData = res.data || [];
        setDisplayedProperties(freshData);
        setHasMore(freshData.length === 12);
        
        // Cache the fresh first page
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          searchParamsString,
          data: freshData,
          timestamp: Date.now()
        }));

        // Immediately trigger prefetch for page 2 if there's more
        if (freshData.length === 12) {
          prefetchNextPage(2, searchParamsString);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFirstPage();

    return () => { isMounted = false; };
  }, [searchParamsString]);

  // Function to silently fetch the next page into the queue
  const prefetchNextPage = async (nextPageNum: number, paramsStr: string) => {
    try {
      const res: any = await ApiService.properties.getAll(`${paramsStr}&page=${nextPageNum}&limit=12`);
      if (currentParamsRef.current !== paramsStr) return;
      
      const nextBatch = res.data || [];
      setPrefetchedProperties(nextBatch);
      setHasMore(nextBatch.length === 12);
    } catch (err) {
      console.error('Failed to prefetch next page:', err);
    }
  };

  // Called when user hits bottom of list or clicks "See More"
  const loadNextBatch = useCallback((isManualClick: boolean = false) => {
    if (!hasMore && prefetchedProperties.length === 0) return;

    if (!isManualClick) {
      // It's an auto-scroll trigger
      if (autoScrollCount >= 2) {
        return; // Pause auto-scrolling, wait for manual click
      }
      setAutoScrollCount(prev => prev + 1);
    } else {
      // It's a manual click, reset auto scroll count so they get 2 more free scrolls
      setAutoScrollCount(0);
    }

    // Move prefetched properties to displayed
    if (prefetchedProperties.length > 0) {
      setDisplayedProperties(prev => [...prev, ...prefetchedProperties]);
      setPrefetchedProperties([]);
      
      const newPage = page + 1;
      setPage(newPage);
      
      // Trigger prefetch for the next page
      if (hasMore) {
        prefetchNextPage(newPage + 1, currentParamsRef.current);
      }
    } else if (hasMore) {
      // Fallback: If prefetch hasn't finished, fetch directly
      setLoading(true);
      const newPage = page + 1;
      ApiService.properties.getAll(`${currentParamsRef.current}&page=${newPage}&limit=12`)
        .then((res: any) => {
          if (currentParamsRef.current !== searchParamsString) return;
          const freshData = res.data || [];
          setDisplayedProperties(prev => [...prev, ...freshData]);
          setPage(newPage);
          setHasMore(freshData.length === 12);
          if (freshData.length === 12) {
            prefetchNextPage(newPage + 1, currentParamsRef.current);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [hasMore, prefetchedProperties, autoScrollCount, page, searchParamsString]);

  return {
    displayedProperties,
    loading,
    hasMore: hasMore || prefetchedProperties.length > 0,
    showSeeMoreButton: autoScrollCount >= 2 && (hasMore || prefetchedProperties.length > 0),
    loadNextBatch
  };
}
