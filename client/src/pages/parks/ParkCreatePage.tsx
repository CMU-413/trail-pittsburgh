import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Park } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { ParkForm } from '../../components/parks/ParkForm';
import { parkApi } from '../../services/api';

export const ParkCreatePage: React.FC = () => {
    const navigate = useNavigate();
    
    const handleSubmit = async (data: Omit<Park, 'parkId'>) => {
        try {
            const newPark = await parkApi.createPark(data);
            navigate(`/parks/${newPark.parkId}`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error creating park:', err);
            throw err;
        }
    };
    
    return (
        <div>
            <div className="mb-4">
                <Link 
                    to="/parks" 
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <span className="mr-1" aria-hidden="true">&larr;</span>
                    Back to Dashboard
                </Link>
            </div>
            <PageHeader 
                title="Create New Park"
                subtitle="Add a new park to the trail system"
            />
            
            <ParkForm onSubmit={handleSubmit} />
        </div>
    );
};
