// src/lib/location.ts
export type Coords = { lat: number; lng: number; accuracy?: number };
export type Place = { city?: string; state?: string; country?: string };

const GEO_TIMEOUT_MS = 12_000;

export async function getBrowserLocation(): Promise<Coords> {
  if (!('geolocation' in navigator)) {
    throw new Error('Geolocation not supported by this browser.');
  }
  return new Promise((resolve, reject) => {
    const onSuccess = (pos: GeolocationPosition) => {
      resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
    };
    const onError = (err: GeolocationPositionError) => {
      reject(new Error(err.message || 'Unable to get location.'));
    };
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: GEO_TIMEOUT_MS,
      maximumAge: 0,
    });
  });
}

/**
 * DEV-friendly reverse geocode using OpenStreetMap Nominatim.
 * (Rate-limited; fine for MVP/dev. For prod, swap to Google/Mapbox/Positionstack.)
 */
export async function reverseGeocode(coords: Coords): Promise<Place> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(coords.lat));
  url.searchParams.set('lon', String(coords.lng));
  // polite: include your app name in the User-Agent automatically via browser; avoid hammering

  const res = await fetch(url.toString(), {
    headers: {
      // Some browsers ignore custom UA; this call still works for dev use.
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Reverse geocode failed.');
  const data = await res.json();
  const a = data.address || {};
  return {
    city: a.city || a.town || a.village || a.hamlet,
    state: a.state,
    country: a.country,
  };
}

// App.tsx (only the relevant additions/changes shown)
import { getBrowserLocation, reverseGeocode, saveUserLocation, loadUserLocation } from './lib/location';
// ...your other imports...

type UserLocation = {
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  accuracy?: number;
};

export default function App() {
  // add this state
  const [userLocation, setUserLocation] = useState<UserLocation | undefined>(undefined);

  // load saved location on mount
  useEffect(() => {
    try {
      const loc = loadUserLocation();
      if (loc) setUserLocation(loc);
    } catch (e) {
      console.warn('No saved location yet');
    }
  }, []);

  // refresh handler (wire this to the "Refresh" link)
  const handleRefreshLocation = async () => {
    try {
      const coords = await getBrowserLocation();
      let place: { city?: string; state?: string } = {};
      try {
        place = await reverseGeocode(coords);
      } catch {
        // reverse geocode can fail silently
      }
      const merged = { ...coords, ...place };
      saveUserLocation(merged);
      setUserLocation(merged);
    } catch (err: any) {
      alert(err?.message || 'Unable to retrieve location.');
    }
  };

  // ...existing code...

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {/* ...other routes/screens... */}

      {currentScreen === 'home' && (
        <HomeScreen
          onCommunitySelect={handleCommunitySelect}
          onProfileClick={handleProfileClick}
          onDashboardClick={handleDashboardClick}
          onActivityClick={handleActivityClick}
          userType={userData.userType}
          userInterests={userData.interests}
          userLocation={userLocation}                 // <-- pass location
          onRefreshLocation={handleRefreshLocation}   // <-- pass refresh
        />
      )}

      {/* ...other routes/screens... */}
    </div>
  );
}
