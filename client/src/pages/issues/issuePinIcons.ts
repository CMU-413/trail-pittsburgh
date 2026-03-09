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

export const iconForType = (type: IssueTypeEnum) => {
    if (type === IssueTypeEnum.OBSTRUCTION) {
        return makePinIcon(obstuctionPin);
    }
    if (type === IssueTypeEnum.FLOODING) {
        return makePinIcon(waterPin);
    }
    return makePinIcon(otherPin);
};
