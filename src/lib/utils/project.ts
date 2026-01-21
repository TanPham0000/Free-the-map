export function project(
  lon: number,
  lat: number,
  bounds: {
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
  },
  width: number,
  height: number
) {
  const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * width;
  const y =
    height -
    ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height;

  return { x, y };
}
