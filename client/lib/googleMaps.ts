// Google Maps integration utilities

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

declare global {
  interface Window {
    google: typeof google;
  }
}

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  position: MapPosition;
  title: string;
  type: "alert" | "user" | "emergency";
  data?: any;
}

// Load Google Maps JavaScript API
export const loadGoogleMapsAPI = (): Promise<typeof google> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.google) {
      resolve(window.google);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error("Google Maps API key not configured"));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (typeof window !== "undefined" && window.google) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps API failed to load"));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google Maps API"));
    };

    document.head.appendChild(script);
  });
};

// Get user's current location
export const getCurrentLocation = (): Promise<MapPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location access denied by user"));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information unavailable"));
            break;
          case error.TIMEOUT:
            reject(new Error("Location request timed out"));
            break;
          default:
            reject(new Error("An unknown error occurred"));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  });
};

// Reverse geocoding - get address from coordinates
export const getAddressFromCoordinates = async (
  position: MapPosition,
): Promise<string> => {
  try {
    const google = await loadGoogleMapsAPI();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error("Geocoding failed: " + status));
        }
      });
    });
  } catch (error) {
    throw new Error("Failed to get address: " + error);
  }
};

// Forward geocoding - get coordinates from address
export const getCoordinatesFromAddress = async (
  address: string,
): Promise<MapPosition> => {
  try {
    const google = await loadGoogleMapsAPI();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          reject(new Error("Geocoding failed: " + status));
        }
      });
    });
  } catch (error) {
    throw new Error("Failed to get coordinates: " + error);
  }
};

// Calculate distance between two points
export const calculateDistance = (
  pos1: MapPosition,
  pos2: MapPosition,
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const dLng = ((pos2.lng - pos1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.lat * Math.PI) / 180) *
      Math.cos((pos2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Format distance for display
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
};

// Get directions between two points
export const getDirections = async (
  origin: MapPosition,
  destination: MapPosition,
  travelMode?: google.maps.TravelMode,
): Promise<google.maps.DirectionsResult> => {
  try {
    const google = await loadGoogleMapsAPI();
    const directionsService = new google.maps.DirectionsService();
    const mode = travelMode || google.maps.TravelMode.DRIVING;

    return new Promise((resolve, reject) => {
      directionsService.route(
        {
          origin,
          destination,
          travelMode: mode,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        (result, status) => {
          if (status === "OK" && result) {
            resolve(result);
          } else {
            reject(new Error("Directions request failed: " + status));
          }
        },
      );
    });
  } catch (error) {
    throw new Error("Failed to get directions: " + error);
  }
};

// Check if Google Maps API is available
export const isGoogleMapsAvailable = (): boolean => {
  return Boolean(
    GOOGLE_MAPS_API_KEY && typeof window !== "undefined" && window.google,
  );
};

// Default San Jose coordinates (fallback)
export const DEFAULT_LOCATION: MapPosition = {
  lat: 37.3387,
  lng: -121.8853,
};
