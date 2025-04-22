// src/pages/parks/ParkEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Park } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { ParkForm } from '../../components/parks/ParkForm';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { Button } from '../../components/ui/Button';
import { parkApi } from '../../services/api';

export const ParkEditPage: React.FC = () => {
    const { parkId } = useParams<{ parkId: string }>();
    const navigate = useNavigate();
    
    const [park, setPark] = useState<Park | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchPark = async () => {
            if (!parkId) {
                setError('Invalid park ID');
                setIsLoading(false);
                return;
            }
            
            try {
                const id = parseInt(parkId, 10);
                const parkData = await parkApi.getPark(id);
                
                if (!parkData) {
                    setError('Park not found');
                    setIsLoading(false);
                    return;
                }
                
                setPark(parkData);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching park:', err);
                setError('Failed to load park. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPark();
    }, [parkId]);
    
    const handleSubmit = async (data: Omit<Park, 'parkId'>) => {
        if (!park) {return;}
        
        try {
            const updatedPark = await parkApi.updatePark({
                ...data,
                parkId: park.parkId
            });
            
            navigate(`/parks/${updatedPark.parkId}`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error updating park:', err);
            throw err;
        }
    };
    
    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    if (error || !park) {
        return (
            <div>
                <PageHeader title="Edit Park" />
                <EmptyState
                    title={error || 'Park not found'}
                    description="The park you're trying to edit doesn't exist or couldn't be loaded."
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
                title={`Edit ${park.name}`}
                subtitle="Update park information"
            />
            
            <ParkForm
                initialData={park}
                onSubmit={handleSubmit}
                isEditing
            />
        </div>
    );
};
