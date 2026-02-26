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
        id: 'alameda-park',
        name: 'Alameda Park',
        bounds: {
            sw: [40.8660, -79.9450],
            ne: [40.8840, -79.9160],
        },
    },
    {
        id: 'bavington-hillman-state-park',
        name: 'Bavington-Hillman State Park',
        bounds: {
            sw: [40.3660, -80.4720],
            ne: [40.4015, -80.4170],
        },
    },
    {
        id: 'boyce-park',
        name: 'Boyce Park',
        bounds: {
            sw: [40.4310, -79.7060],
            ne: [40.4615, -79.6620],
	    },
    },
    {
        id: 'deer-lakes-park',
        name: 'Deer Lakes Park',
        bounds: {
            sw: [40.5955, -79.7840],
            ne: [40.6315, -79.7350],
	    },
    },
    {
        id: 'frick-park',
        name: 'Frick Park',
        bounds: {
            sw: [40.4095, -79.9275],
            ne: [40.4435, -79.8895],
	    },
    },
    {
        id: 'hartwood-acres',
        name: 'Hartwood Acres',
        bounds: { 
            sw: [40.5555, -79.9385],
            ne: [40.5805, -79.8965]
	    },
    },
    {
        id: 'moraine-state-park',
        name: 'Moraine State Park',
        bounds: {
            sw: [40.9050, -80.1750],
            ne: [40.9950, -80.0300],
        },
    },
    {
        id: 'north-park',
        name: 'North Park',
        bounds: {
            sw: [40.57800, -80.05246],
            ne: [40.62718, -79.97361],
        },
    },
    {
        id: 'oakmont-trails',
        name: 'Oakmont Trails',
        bounds: {
            sw: [40.5135, -79.8450],
            ne: [40.5325, -79.8155],
	    },
    },
    {
        id: 'riverview-park',
        name: 'Riverview Park',
        bounds: {
            sw: [40.4795, -80.0225],
            ne: [40.5035, -79.9985],
	    },
    },
    { 
        id: 'settlers-cabin-park',
        name: 'Settlers Cabin Park',
        bounds: {
            sw: [40.4300, -80.2000],
            ne: [40.4755, -80.1400],
	    },
    },
    {
        id: 'south-park',
        name: 'South Park',
        bounds: {
            sw: [40.2650, -80.0500],
            ne: [40.3300, -79.9750],
	    },
    },
    {
        id: 'white-oak-park',
        name: 'White Oak Park',
        bounds: {
            sw: [40.3425, -79.8235],
            ne: [40.3695, -79.7925],
	   },
    },
];
