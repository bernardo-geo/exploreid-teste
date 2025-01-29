import { POIType } from '../types';
import { supabase } from '../../lib/supabase';

let categoryGroupTypes: Record<string, string> = {};

// Load category group types
const loadCategoryGroupTypes = async () => {
  const { data } = await supabase
    .from('categories')
    .select('id, group_type');
  
  if (data) {
    categoryGroupTypes = data.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: cat.group_type
    }), {});
  }
};

// Initialize the cache
loadCategoryGroupTypes();

export const getPOIType = (categoryId: string): POIType => {
  const groupType = categoryGroupTypes[categoryId];
  return groupType === 'embaixador' ? 'embaixador' : 'ponto-interesse';
};