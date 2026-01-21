// src/lib/config/apiKey.js
// Centrale plek voor API-sleutels, zodat alle fetch-functies dezelfde import gebruiken.
export const VITE_MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

// Optioneel object als je liever via apiKey.mapbox leest.
export const apiKey = {
  mapbox: VITE_MAPBOX_API_KEY
};