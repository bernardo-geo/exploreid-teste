// Most types are now managed through the Database type from Supabase
// Keeping only what's needed for legacy compatibility
export type POICategory = string;

export interface Route {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface RouteGroup {
  id: string;
  name: string;
  routes: Route[];
}

// Main POI interface is now handled by Database['public']['Tables']['points_of_interest']['Row']