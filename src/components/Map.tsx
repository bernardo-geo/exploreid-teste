import { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, AttributionControl, ZoomControl } from 'react-leaflet';
import * as L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Navigation, PanelLeftClose, PanelLeftOpen, ChevronDown, ChevronUp, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { baseMaps } from '../types/map';
import SearchBar from './SearchBar';
import Legend from './Legend';
import POIDetails from './POIDetails';
import FullscreenControl from './FullscreenControl';
import ReturnToViewButton from './ReturnToViewButton';
import LocationToast from './LocationToast';
import { useCategories, usePOIs } from '../hooks/useSupabase';
import { Database } from '../types/supabase';

type POI = Database['public']['Tables']['points_of_interest']['Row'] | Database['public']['Tables']['ambassadors']['Row'];

const PORTUGAL_BOUNDS: L.LatLngBoundsExpression = [
  [36.8, -12.6],
  [42.2, -6.1]
];

function MapBoundsHandler() {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(PORTUGAL_BOUNDS);
    map.setMinZoom(6);
    
    const handleDrag = () => {
      map.panInsideBounds(PORTUGAL_BOUNDS, { animate: false });
    };
    
    map.on('drag', handleDrag);
    return () => {
      map.off('drag', handleDrag);
    };
  }, [map]);

  return null;
}

function LocationTracker() {
  const map = useMap();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition(pos);
          map.setView([pos.coords.latitude, pos.coords.longitude], map.getZoom());
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [map]);

  if (!position) return null;

  return (
    <Marker
      position={[position.coords.latitude, position.coords.longitude]}
      icon={new L.DivIcon({
        className: 'location-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })}
    >
      <Tooltip>Estás aqui</Tooltip>
    </Marker>
  );
}

function Map() {
  const { categories, loading: categoriesLoading } = useCategories();
  const { pois, loading: poisLoading } = usePOIs();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [previousCategories, setPreviousCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoedaId, setShowMoedaId] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedBaseMap, setSelectedBaseMap] = useState<keyof typeof baseMaps>('base');
  const mapRef = useRef<L.Map | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 678);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      const allCategories = new Set(categories.map(cat => cat.id));
      setSelectedCategories(allCategories);
      setPreviousCategories(allCategories);
    }
  }, [categories, categoriesLoading]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 678);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredPOIs = pois.filter(poi => {
    if (showMoedaId && !poi.has_moeda_id) return false;
    const matchesCategory = selectedCategories.has(poi.category_id);
    const matchesSearch = searchQuery === '' || 
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const searchLower = searchQuery.toLowerCase();
    const matchingPOIs = pois.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.project.toLowerCase().includes(searchLower)
    );

    if (matchingPOIs.length > 0) {
      const searchCategories = new Set<string>(matchingPOIs.map(poi => poi.category_id));
      setSelectedCategories(searchCategories);

      if (mapRef.current) {
        const bounds = L.latLngBounds(matchingPOIs.map(p => [p.latitude, p.longitude]));
        mapRef.current.fitBounds(bounds, { padding: [25, 25] });
      }
    }
  }, [searchQuery, pois]);

  const handleMarkerClick = useCallback((poi: POI) => {
    setSelectedPOI(poi);
    setIsSidebarOpen(true);
    
    if (mapRef.current) {
      const map = mapRef.current;
      const currentZoom = map.getZoom();
      const targetZoom = currentZoom < 14 ? 14 : currentZoom;
      
      map.flyTo([poi.latitude, poi.longitude], targetZoom, {
        duration: 0.5,
        easeLinearity: 0.25
      });
    }
  }, []);

  const handlePOIChange = useCallback((newPoi: POI) => {
    setSelectedPOI(newPoi);
    
    if (mapRef.current) {
      const map = mapRef.current;
      const currentZoom = map.getZoom();
      const targetZoom = currentZoom < 14 ? 14 : currentZoom;
      
      map.flyTo([newPoi.latitude, newPoi.longitude], targetZoom, {
        duration: 0.5,
        easeLinearity: 0.25
      });
    }
  }, []);

  const handleMoedaIdToggle = useCallback((show: boolean) => {
    setShowMoedaId(show);
    if (show) {
      const moedaIdPOIs = pois.filter(poi => poi.has_moeda_id);
      const categories = new Set<string>(moedaIdPOIs.map(poi => poi.category_id));
      setPreviousCategories(selectedCategories);
      setSelectedCategories(categories);

      if (mapRef.current && moedaIdPOIs.length > 0) {
        const bounds = L.latLngBounds(moedaIdPOIs.map(poi => [poi.latitude, poi.longitude]));
        mapRef.current.fitBounds(bounds, { padding: [25, 25] });
      }
    } else {
      setSelectedCategories(previousCategories);
    }
  }, [pois, selectedCategories, previousCategories]);

  const selectAllCategories = useCallback(() => {
    if (categories.length > 0) {
      const allCategories = new Set(categories.map(cat => cat.id));
      setSelectedCategories(allCategories);
      setPreviousCategories(allCategories);
      setShowMoedaId(false);
      setSearchQuery('');
      if (mapRef.current) {
        mapRef.current.setView([40.019, -8.399], 12.5);
      }
    }
  }, [categories]);

  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories(prev => {
      const newCategories = new Set(prev);
      if (newCategories.has(categoryId)) {
        newCategories.delete(categoryId);
      } else {
        newCategories.add(categoryId);
      }
      return newCategories;
    });
  }, []);

  if (categoriesLoading || poisLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div id="app-container" className="relative h-screen w-screen overflow-hidden bg-gray-50">
      {/* Mobile search bar */}
      {isMobile && (
        <div className="fixed top-2 left-12 right-12 justify-center rounded-t-xl z-[700]">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            handleReset={selectAllCategories}
          />
        </div>
      )}

      {/* Sidebar */}
      <div className={`${
        isMobile
          ? `bottom-0 left-0 right-0 rounded-t-xl ${isSidebarOpen ? 'h-[70vh]' : 'h-10'}`
          : `top-0 h-full ${isSidebarOpen ? 'w-[280px] left-0' : 'w-[40px] left-0'}`
      } fixed bg-white shadow-xl transition-all duration-300 z-[1000]`}>
        {isMobile ? (
          <>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full bg-white flex items-center justify-center py-1 hover:bg-gray-50 rounded-t-xl"
            >
              {isSidebarOpen ? (
                <ChevronDown className="text-gray-600" size={14} />
              ) : (
                <ChevronUp className="text-gray-600" size={14} />
              )}
            </button>

            {isSidebarOpen && (
              <div className="px-4 py-0 border-t border-gray-100 overflow-y-auto h-[calc(100%-50px)]">
                {selectedPOI ? (
                  <POIDetails
                    poi={selectedPOI}
                    onClose={() => setSelectedPOI(null)}
                    iconUrl={categories.find(cat => cat.id === selectedPOI.category_id)?.icon_url || ''}
                    onPOIChange={handlePOIChange}
                  />
                ) : (
                  <>
                    <button
                      onClick={() => handleMoedaIdToggle(!showMoedaId)}
                      className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all text-sm mt-3
                        ${showMoedaId 
                          ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                      <img src="/icons/ID.png" alt="Moeda ID" className="w-6 h-6 object-contain" />
                      <span className="font-medium">Descubra onde obter e utilizar a Moeda ID</span>
                    </button>
                    <Legend
                      categoryIcons={Object.fromEntries(categories.map(cat => [cat.id, cat.icon_url]))}
                      selectedCategories={selectedCategories}
                      toggleCategory={toggleCategory}
                      selectedRoutes={new Set()}
                      toggleRoute={() => {}}
                      handleReset={selectAllCategories}
                      baseMaps={baseMaps}
                      selectedBaseMap={selectedBaseMap}
                      setSelectedBaseMap={setSelectedBaseMap}
                      clearPOIs={() => setSelectedCategories(new Set())}
                      clearRoutes={() => setSelectedCategories(previousCategories)}
                      showMoedaId={showMoedaId}
                      setShowMoedaId={handleMoedaIdToggle}
                      isMobile={isMobile}
                      categories={categories}
                    />
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 border-b bg-white">
              {isSidebarOpen ? (
                <>
                  <span className="text-base font-semibold text-gray-800">
                    {selectedPOI ? selectedPOI.name : 'Interações no Mapa'}
                  </span>
                  <div className="flex items-center gap-2">
                    {selectedPOI && (
                      <button
                        onClick={() => setSelectedPOI(null)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="text-gray-600" size={0} />
                      </button>
                    )}
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <PanelLeftClose className="text-gray-600" size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors mx-auto"
                >
                  <PanelLeftOpen className="text-gray-600" size={18} />
                </button>
              )}
            </div>

            {isSidebarOpen && (
              <div className="h-[calc(100%-56px)] overflow-y-auto">
                {selectedPOI ? (
                  <POIDetails
                    poi={selectedPOI}
                    onClose={() => setSelectedPOI(null)}
                    iconUrl={categories.find(cat => cat.id === selectedPOI.category_id)?.icon_url || ''}
                    onPOIChange={handlePOIChange}
                  />
                ) : (
                  <>
                    <div className="p-3 border-b">
                      <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearch={handleSearch}
                        handleReset={selectAllCategories}
                      />
                      <button
                        onClick={() => handleMoedaIdToggle(!showMoedaId)}
                        className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all text-sm mt-3
                          ${showMoedaId 
                            ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      >
                        <img src="/icons/ID.png" alt="Moeda ID" className="w-6 h-6 object-contain" />
                        <span className="font-medium">Descubra onde obter e utilizar a Moeda ID</span>
                      </button>
                    </div>
                    <Legend
                      categoryIcons={Object.fromEntries(categories.map(cat => [cat.id, cat.icon_url]))}
                      selectedCategories={selectedCategories}
                      toggleCategory={toggleCategory}
                      selectedRoutes={new Set()}
                      toggleRoute={() => {}}
                      handleReset={selectAllCategories}
                      baseMaps={baseMaps}
                      selectedBaseMap={selectedBaseMap}
                      setSelectedBaseMap={setSelectedBaseMap}
                      clearPOIs={() => setSelectedCategories(new Set())}
                      clearRoutes={() => setSelectedCategories(previousCategories)}
                      showMoedaId={showMoedaId}
                      setShowMoedaId={handleMoedaIdToggle}
                      isMobile={isMobile}
                      categories={categories}
                    />
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Map */}
      <div className={`absolute inset-0 ${isMobile ? 'pb-12' : ''}`}>
        {locationError && <LocationToast message={locationError} onClose={() => setLocationError(null)} />}
        
        <MapContainer
          center={[40.019, -8.399]}
          zoom={12.5}
          style={{ height: '100%', width: '100%' }}
          className="h-full w-full"
          ref={mapRef}
          zoomControl={false}
          attributionControl={false}
          maxBounds={PORTUGAL_BOUNDS}
          minZoom={12}
        >
          <TileLayer
            url={baseMaps[selectedBaseMap].url}
            attribution={baseMaps[selectedBaseMap].attribution}
            maxZoom={19}
          />
          
          <AttributionControl position="bottomright" prefix={false} />
          <ZoomControl position="bottomright" />
          <FullscreenControl />
          <ReturnToViewButton />
          <MapBoundsHandler />

          <div className="leaflet-control-locate leaflet-bar leaflet-control">
            <button
              onClick={() => setIsTracking(!isTracking)}
              className={`w-8 h-8 bg-white rounded-xl shadow-lg flex items-center 
                justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition-colors
                ${isTracking ? 'text-blue-500' : 'text-gray-600'}`}
              title="Track my location"
            >
              <Navigation size={20} className={isTracking ? 'text-blue-500' : ''} />
            </button>
          </div>

          {isTracking && <LocationTracker />}

          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={15}
            disableClusteringAtZoom={25}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
          >

          {/* Render markers */}
          {filteredPOIs.map((poi) => {
            const iconUrl = categories.find(cat => cat.id === poi.category_id)?.icon_url || '';
            const isSelected = selectedPOI?.id === poi.id;

            return (
              <Marker
                key={poi.id}
                position={[poi.latitude, poi.longitude]}
                icon={new L.Icon({
                  iconUrl,
                  iconSize: [30, 30],
                  iconAnchor: [15, 28],
                  className: `marker-icon ${isSelected ? 'selected-marker' : ''}`
                })}
                eventHandlers={{
                  click: () => handleMarkerClick(poi)
                }}
                zIndexOffset={isSelected ? 1000 : 0}
              >
                <Tooltip 
                  direction="top" 
                  offset={[0, 0]} 
                  opacity={1}
                  permanent={isSelected}
                  className={isSelected ? 'selected-tooltip' : ''}
                >
                  {poi.name}
                </Tooltip>
              </Marker>
            );
          })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
