// src/pages/dashboard/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Issue, Park, Trail 
} from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/layout/PageHeader';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { getIssueStatusDotColor } from '../../utils/issueStatusUtils';
import { 
    parkApi, trailApi, issueApi
} from '../../services/api';

export const DashboardPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [parks, setParks] = useState<Record<number, Park>>({});
    const [trails, setTrails] = useState<Record<number, Trail>>({});

    // Statistics
    const [totalIssues, setTotalIssues] = useState(0);
    const [openIssues, setOpenIssues] = useState(0);
    const [resolvedIssues, setResolvedIssues] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch issues
                const issuesData = await issueApi.getAllIssues();
                const filteredIssues = issuesData.filter((issue) => issue.is_public);
                setIssues(filteredIssues.slice(0, 6)); // Show only the most recent 6 issues

                // Calculate statistics
                setTotalIssues(filteredIssues.length);
                setOpenIssues(filteredIssues.filter((i) => i.status === 'open').length);
                setResolvedIssues(filteredIssues.filter((i) => i.status === 'resolved').length);

                // Fetch parks and trails for display
                const parksData = await parkApi.getParks();
                const parksMap: Record<number, Park> = {};
                parksData.forEach((park) => {
                    parksMap[park.park_id] = park;
                });
                setParks(parksMap);

                const trailsData = await trailApi.getAllTrails();
                const trailsMap: Record<number, Trail> = {};
                trailsData.forEach((trail) => {
                    trailsMap[trail.trail_id] = trail;
                });
                setTrails(trailsMap);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Get the most recent issues
    const recentIssues = [...issues].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5);

    return (
        <div>
            <PageHeader
                title="Dashboard"
                subtitle="Overview of trail system issues and statistics"
                action={
                    <Link to="/issues/report">
                        <Button variant="primary">Report an Issue</Button>
                    </Link>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Issues"
                    value={totalIssues}
                    icon={
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                    color="green"
                />

                <StatCard
                    title="Open Issues"
                    value={openIssues}
                    icon={
                        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    }
                    color="red"
                />

                <StatCard
                    title="Resolved Issues"
                    value={resolvedIssues}
                    icon={
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                    }
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card
                        title="Recent Issues"
                        headerAction={
                            <Link to="/issues" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                View all issues
                            </Link>
                        }
                    >
                        <div className="divide-y divide-gray-200">
                            {recentIssues.map((issue) => (
                                <div key={issue.issue_id} className="flex items-start py-4 first:pt-0 last:pb-0">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <Link to={`/issues/${issue.issue_id}`} className="font-medium text-blue-600 hover:text-blue-500 truncate">
                                                {issue.issue_type.charAt(0).toUpperCase() + issue.issue_type.slice(1)}
                                            </Link>
                                            <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                                                {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getIssueStatusDotColor(issue.status)}`}></span>
                                            {parks[issue.park_id]?.name} &bull; {trails[issue.trail_id]?.name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Parks Overview">
                        <div className="divide-y divide-gray-200">
                            {Object.values(parks).slice(0, 5).map((park) => (
                                <div key={park.park_id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                    <Link to={`/parks/${park.park_id}`} className="font-medium text-blue-600 hover:text-blue-500 truncate max-w-[70%]">
                                        {park.name}
                                    </Link>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${park.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {park.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <Link to="/parks" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
                                View all parks
                                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </Card>

                    <QuickLinks />
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: 'green' | 'red' | 'yellow' | 'blue';
}> = ({ title, value, icon, color }) => {
    const colorClasses = {
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        blue: 'bg-blue-50 text-blue-600'
    };

    const barColorClasses = {
        green: 'bg-green-500',
        red: 'bg-red-500',
        yellow: 'bg-yellow-500',
        blue: 'bg-blue-500'
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center">
                <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <p className="mt-2 text-3xl font-extrabold">{value}</p>
                </div>
            </div>
            <div className={`h-1 w-full mt-4 ${barColorClasses[color]}`}></div>
        </Card>
    );
};

// QuickLinks Component
const QuickLinks: React.FC = () => {
    const links = [
        {
            name: 'Report a New Issue',
            href: '/issues/report',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        {
            name: 'Browse Parks',
            href: '/parks',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            )
        },
        {
            name: 'View All Issues',
            href: '/issues',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            )
        }
    ];

    return (
        <Card title="Quick Links">
            <div className="space-y-1">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        to={link.href}
                        className="flex items-center px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                        <div className="p-1 text-gray-600 mr-3">
                            {link.icon}
                        </div>
                        <span className="font-medium">{link.name}</span>
                    </Link>
                ))}
            </div>
        </Card>
    );
};
