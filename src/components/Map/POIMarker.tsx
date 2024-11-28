/*import { Marker, Popup, Tooltip } from 'react-leaflet';
import { POI } from '../../types/poi';
import { categoryIcons } from '../../utils/icons';
import POIPopup from '../POIPopup';
import { useCallback, useRef, useState } from 'react';
import { useMapInteraction } from './useMapInteraction';

interface POIMarkerProps {
  poi: POI;
}

export default function POIMarker({ poi }: POIMarkerProps) {
  const { centerMarkerAndPopup } = useMapInteraction();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const deltaY = touchEnd.y - touchStartRef.current.y;
    const deltaX = Math.abs(touchEnd.x - touchStartRef.current.x);

    if (Math.abs(deltaY) < 10 && deltaX < 10) {
      centerMarkerAndPopup(poi.coordinates);
      setIsPopupOpen(true);
    }

    touchStartRef.current = null;
  }, [centerMarkerAndPopup, poi.coordinates]);

  const handleMarkerClick = useCallback((e: L.LeafletMouseEvent) => {
    if (!e.originalEvent.touches) {
      centerMarkerAndPopup(poi.coordinates);
      setIsPopupOpen(true);
    }
  }, [centerMarkerAndPopup, poi.coordinates]);

  return (
    <Marker
      position={poi.coordinates}
      icon={categoryIcons[poi.category]}
      eventHandlers={{
        click: handleMarkerClick,
        touchstart: handleTouchStart,
        touchend: handleTouchEnd,
      }}
    >
      {isPopupOpen && (
        <Popup 
          className="custom-popup"
          autoPan={false}
          keepInView={true}
          onClose={() => setIsPopupOpen(false)}
        >
          <POIPopup
            poi={poi}
            iconUrl={categoryIcons[poi.category].options.iconUrl || ''}
          />
        </Popup>
      )}
      <Tooltip
        direction="top"
        offset={[0, -20]}
        opacity={1}
      >
        {poi.name}
      </Tooltip>
    </Marker>
  );
}*/