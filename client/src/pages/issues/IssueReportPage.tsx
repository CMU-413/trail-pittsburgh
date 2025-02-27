// src/pages/issues/IssueReportPage.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Issue } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { IssueReportForm } from '../../components/issues/IssueReportForm';
import { mockApi } from '../../services/mockData';

export const IssueReportPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    // Get park and trail IDs from query parameters, if available
    const parkId = queryParams.get('parkId') ? parseInt(queryParams.get('parkId')!, 10) : undefined;
    const trailId = queryParams.get('trailId') ? parseInt(queryParams.get('trailId')!, 10) : undefined;
    
    const handleSubmit = async (data: Omit<Issue, 'issue_id'>) => {
        try {
            const newIssue = await mockApi.createIssue(data);
            navigate(`/issues/${newIssue.issue_id}`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error creating issue:', err);
            throw err;
        }
    };
    
    return (
        <div>
            <PageHeader 
                title="Report Trail Issue"
                subtitle="Help us keep our trails in great condition by reporting issues you encounter"
            />
            
            <IssueReportForm
                onSubmit={handleSubmit}
                initialParkId={parkId}
                initialTrailId={trailId}
            />
        </div>
    );
};
