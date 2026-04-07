import { IssueTypeEnum } from '../../types';
import obstuctionPin from '../../assets/obstructionPin.png';
import waterPin from '../../assets/waterPin.png';
import otherPin from '../../assets/otherPin.png';

const makePinIcon = (url: string) =>
    window.L.icon({
        iconUrl: url,
        iconSize: [22, 34],
        iconAnchor: [11, 34],
        popupAnchor: [0, -34],
    });

export const iconForCurrentLocation = () => {
    return window.L.divIcon({
        className: 'current-location-marker',
        html: `
            <div style="position: relative; width: 28px; height: 28px;">
                <span style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(59, 130, 246, 0.3);"></span>
                <span style="position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; transform: translate(-50%, -50%); border-radius: 9999px; background: #3b82f6; border: 2px solid #ffffff; box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.55);"></span>
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

export const iconForType = (type: IssueTypeEnum) => {
    if (type === IssueTypeEnum.OBSTRUCTION) {
        return makePinIcon(obstuctionPin);
    }
    if (type === IssueTypeEnum.WATER) {
        return makePinIcon(waterPin);
    }
    return makePinIcon(otherPin);
};
