import { useMemo } from 'react';
import { Database } from '../types/supabase';

type POI = Database['public']['Tables']['points_of_interest']['Row'] | Database['public']['Tables']['ambassadors']['Row'];

// Calculate distance between two points using Haversine formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function useNearbyPOIs(currentPOI: POI, allPOIs: POI[], radius: number = 10) {
  return useMemo(() => {
    return allPOIs
      .filter(poi => 
        // Exclude current POI
        poi.id !== currentPOI.id &&
        // Calculate distance and filter by radius
        getDistance(
          currentPOI.latitude,
          currentPOI.longitude,
          poi.latitude,
          poi.longitude
        ) <= radius
      )
      .map(poi => ({
        ...poi,
        distance: getDistance(
          currentPOI.latitude,
          currentPOI.longitude,
          poi.latitude,
          poi.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3); // Get top 3 nearest POIs
  }, [currentPOI, allPOIs, radius]);
}