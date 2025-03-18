// src/pages/trails/TrailEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trail } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { TrailForm } from '../../components/trails/TrailForm';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { Button } from '../../components/ui/Button';
import { mockApi } from '../../services/mockData';

export const TrailEditPage: React.FC = () => {
    const { parkId, trailId } = useParams<{ parkId: string; trailId: string }>();
    const navigate = useNavigate();
    
    const [trail, setTrail] = useState<Trail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchTrail = async () => {
            if (!parkId || !trailId) {
                setError('Invalid park or trail ID');
                setIsLoading(false);
                return;
            }
            
            try {
                const trailIdNum = parseInt(trailId, 10);
                const parkIdNum = parseInt(parkId, 10);
                
                const trailData = await mockApi.getTrail(trailIdNum);
                
                if (!trailData) {
                    setError('Trail not found');
                    setIsLoading(false);
                    return;
                }
                
                if (trailData.park_id !== parkIdNum) {
                    setError('Trail does not belong to this park');
                    setIsLoading(false);
                    return;
                }
                
                setTrail(trailData);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching trail:', err);
                setError('Failed to load trail. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchTrail();
    }, [parkId, trailId]);
    
    const handleSubmit = async (data: Omit<Trail, 'trail_id'>) => {
        if (!trail || !parkId) {return;}
        
        try {
            const updatedTrail = await mockApi.updateTrail({
                ...data,
                trail_id: trail.trail_id,
                park_id: parseInt(parkId, 10)
            });
            
            navigate(`/parks/${parkId}/trails/${updatedTrail.trail_id}`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error updating trail:', err);
            throw err;
        }
    };
    
    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    if (error || !trail || !parkId) {
        return (
            <div>
                <PageHeader title="Edit Trail" />
                <EmptyState
                    title={error || 'Trail not found'}
                    description="The trail you're trying to edit doesn't exist or couldn't be loaded."
                    action={
                        <Button variant="primary" onClick={() => navigate(`/parks/${parkId}`)}>
                            Back to Park
                        </Button>
                    }
                />
            </div>
        );
    }
    
    return (
        <div>
            <PageHeader 
                title={`Edit ${trail.name}`}
                subtitle="Update trail information"
            />
            
            <Card>
                <TrailForm 
                    parkId={parseInt(parkId, 10)}
                    initialData={trail}
                    onSubmit={handleSubmit}
                    isEditing
                />
            </Card>
        </div>
    );
};
