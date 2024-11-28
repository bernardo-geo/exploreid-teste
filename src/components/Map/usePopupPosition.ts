import { useMap } from 'react-leaflet';
import { useCallback } from 'react';
import { LatLng } from 'leaflet';

export function usePopupPosition() {
  const map = useMap();

  const centerPopup = useCallback((coordinates: [number, number]) => {
    const point = map.latLngToContainerPoint(new LatLng(coordinates[0], coordinates[1]));
    const size = map.getSize();
    
    // Calculate the vertical offset needed to center the popup
    const popupHeight = 300; // Approximate popup height
    const targetY = size.y / 2 - popupHeight / 2;
    const currentY = point.y;
    const offsetY = (targetY - currentY) / map.getZoomScale(map.getZoom());
    
    // Convert pixel offset to latitude offset
    const targetPoint = point.add([0, offsetY]);
    const targetLatLng = map.containerPointToLatLng(targetPoint);
    
    map.setView(targetLatLng, map.getZoom(), {
      animate: true,
      duration: 0.5,
      pan: {
        animate: true,
        duration: 0.5,
        easeLinearity: 0.5
      }
    });
  }, [map]);

  return { centerPopup };
}