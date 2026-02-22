export type LatLngTuple = [number, number];

export type ParkInfo = {
  id: string;
  name: string;
  bounds: {
    sw: LatLngTuple;
    ne: LatLngTuple;
  };
};

export const PARKS: ParkInfo[] = [
    {
        id: 'north-park',
        name: 'North Park',
        bounds: {
            sw: [40.57800, -80.05246],
            ne: [40.62718, -79.97361],
        },
    },
];
