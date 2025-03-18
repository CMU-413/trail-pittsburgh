// src/components/trails/TrailCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Trail } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TrailCardProps {
    trail: Trail;
    parkId: number;
}

export const TrailCard: React.FC<TrailCardProps> = ({ trail, parkId }) => {
    return (
        <Link to={`/parks/${parkId}/trails/${trail.trail_id}`} className="block hover:no-underline">
            <Card className="h-full transition-shadow hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{trail.name}</h3>
                    <div className="flex space-x-2">
                        {trail.is_active ? (
                            <Badge variant="success">Active</Badge>
                        ) : (
                            <Badge variant="secondary">Inactive</Badge>
                        )}
                        {trail.is_open ? (
                            <Badge variant="info">Open</Badge>
                        ) : (
                            <Badge variant="warning">Closed</Badge>
                        )}
                    </div>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                    View trail details &rarr;
                </div>
            </Card>
        </Link>
    );
};
