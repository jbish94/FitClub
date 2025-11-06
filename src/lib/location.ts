// src/lib/location.ts

export type Coords = { lat: number; lng: number; accuracy?: number };
export type Place = { city?: string; state?: string; country?: string };

export type UserLocation = Coords & Place;

const GEO_TIMEOUT_MS = 12_000;
const LOC_KEY = 'fitclub_user_location';

/** Ask the browser for the current location. */
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
 * (Great for MVP/testing. For production, swap in Google/Mapbox/etc.)
 */
export async function reverseGeocode(coords: Coords): Promise<Place> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(coords.lat));
  url.searchParams.set('lon', String(coords.lng));

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
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

/** Persist a location for later reads. */
export function saveUserLocation(loc: UserLocation) {
  try {
    localStorage.setItem(LOC_KEY, JSON.stringify(loc));
  } catch {}
}

/** Load a previously stored location (if any). */
export function loadUserLocation(): UserLocation | undefined {
  try {
    const raw = localStorage.getItem(LOC_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as UserLocation;
  } catch {
    return undefined;
  }
}

/** Clear stored location (not required, but handy). */
export function clearUserLocation() {
  try {
    localStorage.removeItem(LOC_KEY);
  } catch {}
}
