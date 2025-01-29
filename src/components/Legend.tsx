import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];

interface LegendProps {
  categoryIcons: Record<string, string>;
  selectedCategories: Set<string>;
  toggleCategory: (category: string) => void;
  selectedRoutes: Set<string>;
  toggleRoute: (routeId: string) => void;
  handleReset: () => void;
  baseMaps: Record<string, { url: string; attribution: string }>;
  selectedBaseMap: string;
  setSelectedBaseMap: (baseMap: string) => void;
  clearPOIs: () => void;
  clearRoutes: () => void;
  showMoedaId: boolean;
  setShowMoedaId: (show: boolean) => void;
  isMobile: boolean;
  categories: Category[];
}

interface CategoryGroupState {
  'ponto-interesse': boolean;
  'embaixador': boolean;
}

export default function Legend({
  categoryIcons,
  selectedCategories,
  toggleCategory,
  selectedRoutes,
  toggleRoute,
  handleReset,
  baseMaps,
  selectedBaseMap,
  setSelectedBaseMap,
  clearPOIs,
  clearRoutes,
  showMoedaId,
  setShowMoedaId,
  isMobile,
  categories
}: LegendProps) {
  const [expandedGroups, setExpandedGroups] = useState<CategoryGroupState>({
    'ponto-interesse': true,
    'embaixador': true
  });

  const toggleGroup = (group: keyof CategoryGroupState) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const categoryGroups = {
    'ponto-interesse': categories.filter(cat => cat.group_type === 'ponto-interesse'),
    'embaixador': categories.filter(cat => cat.group_type === 'embaixador')
  };

  const renderCategoryGroup = (
    title: string,
    categoryGroup: Category[],
    groupKey: keyof CategoryGroupState
  ) => (
    <div key={`group-${groupKey}`} className="mb-3">
      <button
        onClick={() => toggleGroup(groupKey)}
        className="flex items-center justify-between w-full p-2 bg-gray-50 rounded-lg 
          hover:bg-gray-100 transition-colors"
      >
        <span className="text-xs font-medium text-gray-800">{title}</span>
        {expandedGroups[groupKey] ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
      </button>
      {expandedGroups[groupKey] && (
        <div className="mt-2 space-y-1 pl-1.5">
          {categoryGroup.map(category => (
            <div
              key={`category-${category.id}`}
              onClick={() => toggleCategory(category.id)}
              className={`
                flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
                ${selectedCategories.has(category.id)
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}
              `}
            >
              <img src={category.icon_url} alt={category.name} className="w-4 h-4" />
              <span className="text-xs font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-3 p-3 ${isMobile ? 'pb-20' : ''}`}>
      {/* Base Maps */}
      <div className="mb-3">
        <h4 className="text-xs font-bold text-gray-800 mb-2">Tipo de Mapa</h4>
        <div className="grid grid-cols-3 gap-1">
          {Object.entries(baseMaps).map(([key, _]) => (
            <button
              key={`basemap-${key}`}
              onClick={() => setSelectedBaseMap(key)}
              className={`
                px-2 py-1.5 text-xs rounded-lg transition-all font-medium
                ${selectedBaseMap === key
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-gray-800">Categorias</h4>
          <div className="flex items-center gap-1.5">
            {selectedCategories.size > 0 && (
              <button
                onClick={clearPOIs}
                className="text-[10px] font-medium text-red-500 hover:text-red-700 transition-colors 
                  px-1.5 py-0.5 rounded hover:bg-red-50"
              >
                Limpar
              </button>
            )}
            <button
              onClick={handleReset}
              className="text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors
                px-1.5 py-0.5 rounded hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
        {renderCategoryGroup('Ponto de Interesse', categoryGroups['ponto-interesse'], 'ponto-interesse')}
        {renderCategoryGroup('Embaixador', categoryGroups['embaixador'], 'embaixador')}
      </div>
    </div>
  );
}