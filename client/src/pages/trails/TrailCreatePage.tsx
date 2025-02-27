// src/pages/trails/TrailCreatePage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trail } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { TrailForm } from '../../components/trails/TrailForm';
import { EmptyState } from '../../components/layout/EmptyState';
import { Button } from '../../components/ui/Button';
import { mockApi } from '../../services/mockData';

export const TrailCreatePage: React.FC = () => {
    const { parkId } = useParams<{ parkId: string }>();
    const navigate = useNavigate();
    
    const handleSubmit = async (data: Omit<Trail, 'trail_id'>) => {
        if (!parkId) {
            throw new Error('Park ID is required');
        }
        
        try {
            const newTrail = await mockApi.createTrail({
                ...data,
                park_id: parseInt(parkId, 10)
            });
            
            navigate(`/parks/${parkId}/trails/${newTrail.trail_id}`);
        } catch (err) {
            console.error('Error creating trail:', err);
            throw err;
        }
    };
    
    if (!parkId) {
        return (
            <div>
                <PageHeader title="Create New Trail" />
                <EmptyState
                    title="Invalid Park"
                    description="A valid park is required to create a trail."
                    action={
                        <Button variant="primary" onClick={() => navigate('/parks')}>
                            Back to Parks
                        </Button>
                    }
                />
            </div>
        );
    }
    
    return (
        <div>
            <PageHeader 
                title="Create New Trail"
                subtitle="Add a new trail to the park"
            />
            
            <Card>
                <TrailForm 
                    parkId={parseInt(parkId, 10)}
                    onSubmit={handleSubmit}
                />
            </Card>
        </div>
    );
};
