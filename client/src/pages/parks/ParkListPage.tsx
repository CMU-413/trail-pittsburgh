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
    const [showInactive, setShowInactive] = useState(false);

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

    // Filter active and inactive parks
    const activeParks = parks.filter((park) => park.is_active);
    const inactiveParks = parks.filter((park) => !park.is_active);

    // Determine which parks to display
    const displayParks = showInactive ? parks : activeParks;

    // Sort parks: active parks first (sorted by name), then inactive parks (sorted by name)
    const sortedParks = [...displayParks].sort((a, b) => {
        // Active parks first
        if (a.is_active && !b.is_active) {return -1;}
        if (!a.is_active && b.is_active) {return 1;}

        // Then sort by name
        return a.name.localeCompare(b.name);
    });

    if (sortedParks.length === 0) {
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
                    title={showInactive ? 'No inactive parks found' : 'No parks found'}
                    description={showInactive
                        ? 'There are no inactive parks in the system.'
                        : 'Get started by creating your first park.'}
                    action={
                        <Link to="/parks/create">
                            <Button variant="primary">Add Park</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Parks"
                subtitle={`Showing ${sortedParks.length} ${showInactive ? '' : 'active'} parks`}
                action={
                    <div className="flex items-center space-x-3">
                        {inactiveParks.length > 0 && (
                            <Button
                                variant="secondary"
                                onClick={() => setShowInactive(!showInactive)}
                            >
                                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
                            </Button>
                        )}
                        <Link to="/parks/create">
                            <Button variant="primary">Add Park</Button>
                        </Link>
                    </div>
                }
            />

            {inactiveParks.length > 0 && showInactive && (
                <div className="mb-4 bg-yellow-50 border border-yellow-100 rounded-md p-3 flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-yellow-700">
                        Showing all parks, including {inactiveParks.length} inactive {inactiveParks.length === 1 ? 'park' : 'parks'}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedParks.map((park) => (
                    <ParkCard key={park.park_id} park={park} />
                ))}
            </div>
        </div>
    );
};
