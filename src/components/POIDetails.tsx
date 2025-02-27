import { type FC } from 'react';
import { ExternalLink, CornerDownRight, Building2, X } from 'lucide-react';
import { Database } from '../types/supabase';
import ShareButton from '../share/components/ShareButton';
import { useCategories, usePOIs } from '../hooks/useSupabase';
import { useNearbyPOIs } from '../hooks/useNearbyPOIs';
import NearbyPOIs from './NearbyPOIs';

type POI = Database['public']['Tables']['points_of_interest']['Row'] | Database['public']['Tables']['ambassadors']['Row'];

interface POIDetailsProps {
  poi: POI;
  iconUrl: string;
  onClose: () => void;
  onPOIChange?: (poi: POI) => void;
}

const POIDetails: FC<POIDetailsProps> = ({ poi, iconUrl, onClose, onPOIChange }) => {
  const { categories } = useCategories();
  const { pois } = usePOIs();
  const nearbyPOIs = useNearbyPOIs(poi, pois);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}`;
  const category = categories.find(cat => cat.id === poi.category_id);
  
  const handleNearbyPOIClick = (newPoi: POI) => {
    if (onPOIChange) {
      onPOIChange(newPoi);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {poi.image_url ? (
        <div className="relative w-full h-48">
          <img
            src={poi.image_url}
            alt={poi.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-3 p-1 bg-white rounded-full shadow-lg 
              hover:bg-gray-50 transition-colors"
          >
            <X size={15} className="text-gray-600" />
          </button>
        </div>
      ) : (
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-xl text-gray-900">
            {poi.name}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={15} className="text-gray-600" />
          </button>
        </div>
      )}
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <img 
              src={iconUrl}
              alt="Category Icon"
              className="w-5 h-5 object-contain"
            />
            <span className="text-xs font-medium text-blue-600">
              {category?.name || 'Categoria'}
            </span>
          </div>
          <ShareButton poi={poi} />
        </div>

        {!poi.image_url && (
          <div className="h-px w-full bg-gray-100 my-3" />
        )}

        {poi.project && (
          <div className="flex items-center gap-1.5 mb-3">
            <Building2 size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              {poi.project}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {poi.description}
        </p>

        <div className="space-y-3">
          {poi.url && (
            <a
              href={poi.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 
                hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2.5 rounded-lg hover:bg-blue-100"
            >            
              <ExternalLink size={16} />
              Sabe mais
            </a>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm font-medium text-green-600 
              hover:text-green-800 transition-colors bg-green-50 px-4 py-2.5 rounded-lg hover:bg-green-100"
          >
            <CornerDownRight size={14} />
            Obter direções
          </a>

          {poi.has_moeda_id && (
            <a
              href="https://exploreid.pt/moeda-id/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-medium text-amber-600 
                hover:text-amber-800 transition-colors bg-amber-50 px-4 py-2.5 rounded-lg hover:bg-amber-100 
                ring-1 ring-amber-200"
            >
              <img src="/icons/ID.png" alt="Moeda ID" className="w-6 h-6" />
              Utiliza a Moeda ID - 10% de desconto
            </a>
          )}
        </div>

        <NearbyPOIs 
          pois={nearbyPOIs}
          onPOIClick={handleNearbyPOIClick}
          selectedPOI={poi}
        />
      </div>
    </div>
  );
};

export default POIDetails;
