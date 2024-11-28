/*import { useMap } from 'react-leaflet';
import { useCallback } from 'react';
import { LatLng } from 'leaflet';

export function useMapInteraction() {
  const map = useMap();

  const centerMarkerAndPopup = useCallback((coordinates: [number, number]) => {
    const point = map.latLngToContainerPoint(new LatLng(coordinates[0], coordinates[1]));
    const size = map.getSize();
    
    // Calculate offset to center popup vertically
    const popupHeight = 320; // Approximate height including padding
    const targetY = (size.y - popupHeight) / 2;
    const currentY = point.y;
    const offsetY = targetY - currentY;
    
    // Convert pixel offset to LatLng
    const targetPoint = point.add([0, offsetY]);
    const newCenter = map.containerPointToLatLng(targetPoint);
    
    map.flyTo(newCenter, map.getZoom(), {
      duration: 0.5,
      easeLinearity: 0.25
    });
  }, [map]);

  return { centerMarkerAndPopup };
}*/