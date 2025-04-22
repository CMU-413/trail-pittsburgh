export interface ParkData {
    name: string;
    county?: string;
    isActive?: boolean;
}

export interface TrailData {
    name: string;
    parkId: number;
    isActive?: boolean;
    isOpen?: boolean;
}