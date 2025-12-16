import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/constants';

interface MapSelectorProps {
  onLocationSelect: (coordinates: [number, number], address?: any) => void;
  onClose: () => void;
}

export default function MapSelector({ onLocationSelect, onClose }: MapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN || '';

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          initializeMap([longitude, latitude]);
        },
        () => {
          // Delhi for fallback
          initializeMap([77.209, 28.6139]);
        },
        { timeout: 5000 }
      );

      const initializeMap = (center: [number, number]) => {
        if (!mapRef.current || mapInstanceRef.current) {
          return;
        }

        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center,
          zoom: 10,
        });

        mapInstanceRef.current = map;
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        });

        map.addControl(geolocate);

        map.on('click', async e => {
          const { lng, lat } = e.lngLat;

          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=address,place,region,postcode`
            );
            const data = await response.json();

            const addressComponents: any = {};
            if (data.features && data.features.length > 0) {
              const feature = data.features[0];
              const context = feature.context || [];

              context.forEach((item: any) => {
                if (item.id.includes('place')) {
                  addressComponents.place = item.text;
                }
                if (item.id.includes('region')) {
                  addressComponents.state = item.text;
                }
                if (item.id.includes('postcode')) {
                  addressComponents.pincode = item.text;
                }
              });
              const city = feature.place_name?.split(',')[0] || addressComponents.place;
              if (city) {
                addressComponents.city = city;
              }
            }

            onLocationSelect([lng, lat], addressComponents);
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
            onLocationSelect([lng, lat]);
          }
        });

        return () => {
          map.remove();
          mapInstanceRef.current = null;
        };
      };
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-semibold text-sm">Click on the map to set your location</h5>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Close Map
        </button>
      </div>
      <div ref={mapRef} className="w-full h-64 rounded-lg border" />
    </div>
  );
}
