import {
    LatLngTuple, ParkInfo, PARKS 
} from '../pages/parks/ParkInfo';

export function getParkByLatLng(latLng: LatLngTuple): ParkInfo | null {
    const [lat, lng] = latLng;

    for (const park of PARKS) {
        const { sw, ne } = park.bounds;
        if (
            lat >= sw[0] && lat <= ne[0] &&
            lng >= sw[1] && lng <= ne[1]
        ) {
            return park;
        }
    }

    return null; // no park found
}
