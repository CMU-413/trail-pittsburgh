// src/components/parks/ParkCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Park } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ParkCardProps {
    park: Park;
}

export const ParkCard: React.FC<ParkCardProps> = ({ park }) => {
    return (
        <Link to={`/parks/${park.parkId}`} className="block hover:no-underline">
            <Card className="h-full transition-shadow hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{park.name}</h3>
                    {park.isActive ? (
                        <Badge variant="success">Active</Badge>
                    ) : (
                        <Badge variant="secondary">Inactive</Badge>
                    )}
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    <span className="font-medium">County:</span> {park.county}
                </p>
                <div className="text-sm text-blue-600 font-medium">
                    View details &rarr;
                </div>
            </Card>
        </Link>
    );
};
