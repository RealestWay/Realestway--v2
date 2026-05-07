import { useState, useEffect, useCallback } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
  address: string;
}

const CACHE_KEY = 'realestway_user_location';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    if (typeof window === 'undefined') return;

    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
          setLocation(parsed.data);
          return;
        }
      } catch (e) {
        // invalid cache, ignore
      }
    }

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode using Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          if (!response.ok) throw new Error('Failed to fetch address details');
          
          const data = await response.json();
          const addressObj = data.address || {};
          
          const city = addressObj.city || addressObj.town || addressObj.village || addressObj.county || '';
          const state = addressObj.state || '';
          const address = data.display_name || '';

          const locData: UserLocation = {
            lat: latitude,
            lng: longitude,
            city,
            state,
            address,
          };

          setLocation(locData);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: locData, timestamp: Date.now() })
          );
        } catch (err: any) {
          setError('Failed to pinpoint your exact address.');
          // Even if reverse geocoding fails, we can still use lat/lng
          const fallbackLoc = { lat: latitude, lng: longitude, city: '', state: '', address: '' };
          setLocation(fallbackLoc);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Location permission denied or unavailable.');
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Optionally auto-request on mount if already granted, but it's usually better to tie this to a user action
  // or a subtle prompt so we don't annoy them.
  // Actually, the user specifically said: "do this first, get user location auth or not...".
  // Let's attempt to auto-request on mount. If the browser already has permission, it succeeds silently.
  // If not, it will prompt. We only prompt if there's no cache.
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { location, loading, error, requestLocation };
}
