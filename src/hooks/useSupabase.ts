import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];
type POI = Database['public']['Tables']['points_of_interest']['Row'];
type Ambassador = Database['public']['Tables']['ambassadors']['Row'];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function usePOIs() {
  const [pois, setPOIs] = useState<(POI | Ambassador)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPOIs() {
      try {
        // Fetch both POIs and ambassadors in parallel
        const [poisResult, ambassadorsResult] = await Promise.all([
          supabase.from('points_of_interest').select('*'),
          supabase.from('ambassadors').select('*')
        ]);

        if (poisResult.error) throw poisResult.error;
        if (ambassadorsResult.error) throw ambassadorsResult.error;

        // Combine both arrays
        const allPOIs = [...(poisResult.data || []), ...(ambassadorsResult.data || [])];
        setPOIs(allPOIs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch POIs');
      } finally {
        setLoading(false);
      }
    }

    fetchPOIs();
  }, []);

  return { pois, loading, error };
}