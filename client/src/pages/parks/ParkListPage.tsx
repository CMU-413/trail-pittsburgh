// src/pages/parks/ParkListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Park } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { ParkCard } from '../../components/parks/ParkCard';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { parkApi } from '../../services/api';


export const ParkListPage: React.FC = () => {
    const [parks, setParks] = useState<Park[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchParks = async () => {
            try {
                const response = await parkApi.getParks();
                setParks(response);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching parks:', err);
                setError('Failed to load parks. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchParks();
    }, []);
    
    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    if (error) {
        return (
            <div>
                <PageHeader title="Parks" />
                <EmptyState
                    title="Error loading parks"
                    description={error}
                    action={
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    }
                />
            </div>
        );
    }
    
    if (parks.length === 0) {
        return (
            <div>
                <PageHeader 
                    title="Parks" 
                    action={
                        <Link to="/parks/create">
                            <Button variant="primary">Add Park</Button>
                        </Link>
                    }
                />
                <EmptyState
                    title="No parks found"
                    description="Get started by creating your first park."
                    action={
                        <Link to="/parks/create">
                            <Button variant="primary">Add Park</Button>
                        </Link>
                    }
                />
            </div>
        );
    }
    
    // Filter active parks first, then sort alphabetically
    const sortedParks = [...parks].sort((a, b) => {
        // Active parks first
        if (a.is_active && !b.is_active) {return -1;}
        if (!a.is_active && b.is_active) {return 1;}
        
        // Then alphabetically
        return a.name.localeCompare(b.name);
    });
    
    return (
        <div>
            <PageHeader 
                title="Parks" 
                subtitle={`Showing ${parks.length} parks`}
                action={
                    <Link to="/parks/create">
                        <Button variant="primary">Add Park</Button>
                    </Link>
                }
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedParks.map((park) => (
                    <ParkCard key={park.park_id} park={park} />
                ))}
            </div>
        </div>
    );
};
