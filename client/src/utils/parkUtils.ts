import { parkApi } from '../services/api';
import { Park } from '../types';

const fetchParks = async (): Promise<Park[] | undefined> => {
    try {
        return await parkApi.getAllParks();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching parks:', err);
        return undefined;
    } 
};
export async function getParkByLatLng(lat: number, lng: number): Promise<Park | null> {
    const parks = await fetchParks();

    if (!parks)
    {return null;}

    for (const park of parks) {
        const minLat = park.minLatitude;
        const minLng = park.minLongitude;
        const maxLat = park.maxLatitude;
        const maxLng = park.maxLongitude;

        if (
            lat >= minLat && lat <= maxLat &&
            lng >= minLng && lng <= maxLng
        ) {
            return park;
        }
    }
	 return null; // no park found
}
