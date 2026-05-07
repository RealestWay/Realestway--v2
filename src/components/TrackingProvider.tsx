'use client';

import { useEffect } from 'react';

export default function TrackingProvider() {
  useEffect(() => {
    try {
      const storageKey = 'realestway_anon_id';
      let anonId = localStorage.getItem(storageKey);
      
      if (!anonId) {
        // Use crypto.randomUUID if available (modern browsers), otherwise fallback to alphanumeric random string
        anonId = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : 'anon_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
          
        localStorage.setItem(storageKey, anonId);
        console.log('[Tracking] New anonymous session initiated:', anonId);
      }
    } catch (err) {
      console.warn('Anonymous tracking disabled or localStorage unavailable', err);
    }
  }, []);

  // Renders nothing visible
  return null;
}
