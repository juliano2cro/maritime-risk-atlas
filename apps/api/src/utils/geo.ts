// src/utils/geo.ts
export function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
export function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

// Haversine distance (km)
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Interpolation linéaire en lat/lon par fraction t dans [0,1]
export function interpLatLng(lat1: number, lon1: number, lat2: number, lon2: number, t: number) {
  const lat = lat1 + (lat2 - lat1) * t;
  const lon = lon1 + (lon2 - lon1) * t;
  return { lat, lon };
}

// Génère des points intermédiaires entre (lat1,lon1) et (lat2,lon2) tous les n km.
// Renvoie un tableau de {lat, lng} sans les extrémités.
export function generateIntermediatePoints(lat1: number, lon1: number, lat2: number, lon2: number, stepKm: number) {
  const dist = haversineDistance(lat1, lon1, lat2, lon2);
  if (dist <= stepKm) return [];
  const numPoints = Math.floor(dist / stepKm);
  const pts: { lat: number; lng: number }[] = [];
  for (let i = 1; i <= numPoints - 1; i++) {
    const t = i / numPoints;
    const p = interpLatLng(lat1, lon1, lat2, lon2, t);
    pts.push({ lat: p.lat, lng: p.lon });
  }
  return pts;
}
