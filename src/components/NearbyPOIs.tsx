import { type FC } from 'react';
import { Database } from '../types/supabase';
import { useCategories } from '../hooks/useSupabase';

type POI = Database['public']['Tables']['points_of_interest']['Row'] | Database['public']['Tables']['ambassadors']['Row'];

interface NearbyPOIProps {
  poi: POI & { distance: number };
  onClick: (poi: POI) => void;
  isSelected: boolean;
}

const NearbyPOI: FC<NearbyPOIProps> = ({ poi, onClick, isSelected }) => {
  const { categories } = useCategories();
  const category = categories.find(cat => cat.id === poi.category_id);
  
  return (
    <button
      onClick={() => onClick(poi)}
      className={`nearby-poi flex items-start gap-3 p-2 rounded-lg transition-all w-full
        ${isSelected 
          ? 'bg-blue-50 border border-blue-200 selected' 
          : 'hover:bg-gray-50 border border-transparent'}`}
    >
      {poi.image_url ? (
        <img
          src={poi.image_url}
          alt={poi.name}
          className={`nearby-poi-image w-16 h-16 object-cover rounded-lg flex-shrink-0`}
        />
      ) : (
        <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0
          ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <img
            src={category?.icon_url}
            alt={category?.name}
            className={`nearby-poi-icon w-8 h-8 object-contain
              ${isSelected ? 'opacity-70' : 'opacity-50'}`}
          />
        </div>
      )}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-1.5 mb-1">
          <img
            src={category?.icon_url}
            alt={category?.name}
            className={`nearby-poi-icon w-4 h-4 object-contain`}
          />
          <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-blue-600'}`}>
            {category?.name}
          </span>
        </div>
        <h4 className={`text-sm font-medium mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
          {poi.name}
        </h4>
        <p className="text-xs text-gray-500">
          {poi.distance < 1 
            ? `${Math.round(poi.distance * 1000)}m de distância`
            : `${poi.distance.toFixed(1)}km de distância`}
        </p>
      </div>
    </button>
  );
};

interface NearbyPOIsProps {
  pois: (POI & { distance: number })[];
  onPOIClick: (poi: POI) => void;
  selectedPOI: POI;
}

const NearbyPOIs: FC<NearbyPOIsProps> = ({ pois, onPOIClick, selectedPOI }) => {
  if (pois.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Locais próximos que podes gostar
      </h3>
      <div className="space-y-2">
        {pois.map(poi => (
          <NearbyPOI
            key={poi.id}
            poi={poi}
            onClick={onPOIClick}
            isSelected={selectedPOI.id === poi.id}
          />
        ))}
      </div>
    </div>
  );
};

export default NearbyPOIs;