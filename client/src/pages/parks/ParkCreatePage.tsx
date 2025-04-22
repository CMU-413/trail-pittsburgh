
// src/pages/parks/ParkCreatePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
            <PageHeader 
                title="Create New Park"
                subtitle="Add a new park to the trail system"
            />
            
            <ParkForm onSubmit={handleSubmit} />
        </div>
    );
};
