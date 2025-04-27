// src/pages/issues/IssueListPage.tsx
import React, {
    useState, useEffect, useCallback 
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Issue, Park, Trail, IssueStatusEnum
} from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { IssueList } from '../../components/issues/IssueList';
import { subDays } from 'date-fns/subDays';
import { subMonths } from 'date-fns/subMonths';
import { subYears } from 'date-fns/subYears';
import { parseISO } from 'date-fns/parseISO';
import { 
    parkApi, trailApi, issueApi
} from '../../services/api';
import { getUrgencyLevelIndex } from '../../utils/issueUrgencyUtils';

// Define filter and sort options
type DateFilter = 'all' | 'week' | 'month' | '3months' | 'year';
type SortOption = 'newest' | 'oldest' | 'urgency-high' | 'urgency-low';

export const IssueListPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialParkId = queryParams.get('parkId') ? parseInt(queryParams.get('parkId')!, 10) : undefined;
    const initialTrailId = queryParams.get('trailId') ? parseInt(queryParams.get('trailId')!, 10) : undefined;
    const initialStatus = queryParams.get('status') as IssueStatusEnum | undefined || undefined;

    const [issues, setIssues] = useState<Issue[]>([]);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
    const [parks, setParks] = useState<Record<number, Park>>({});
    const [trails, setTrails] = useState<Record<number, Trail>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedParkId, setSelectedParkId] = useState<number | undefined>(initialParkId);
    const [selectedTrailId, setSelectedTrailId] = useState<number | undefined>(initialTrailId);
    const [selectedStatus, setSelectedStatus] = useState<IssueStatusEnum | 'all'>(initialStatus || 'all');
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    // Apply date filter and sorting
    const applyFiltersAndSort = useCallback((issuesData: Issue[]) => {
        let result = [...issuesData];

        // Apply date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            let cutoffDate: Date;

            switch (dateFilter) {
            case 'week':
                cutoffDate = subDays(now, 7);
                break;
            case 'month':
                cutoffDate = subMonths(now, 1);
                break;
            case '3months':
                cutoffDate = subMonths(now, 3);
                break;
            case 'year':
                cutoffDate = subYears(now, 1);
                break;
            default:
                cutoffDate = new Date(0); // Beginning of time
            }

            result = result.filter((issue) => {
                const issueDate = parseISO(issue.createdAt);
                return issueDate >= cutoffDate;
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'urgency-high':
                return getUrgencyLevelIndex(b.urgency) - getUrgencyLevelIndex(a.urgency);
            case 'urgency-low':
                return getUrgencyLevelIndex(a.urgency) - getUrgencyLevelIndex(b.urgency);
            default:
                return 0;
            }
        });

        setFilteredIssues(result);
    }, [dateFilter, sortBy]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch parks for lookup and filtering
                const parksData = await parkApi.getParks();
                const parksMap: Record<number, Park> = {};
                parksData.forEach((park: Park) => {
                    parksMap[park.parkId] = park;
                });
                setParks(parksMap);

                // Fetch trails for lookup and filtering
                const trailsData = await trailApi.getAllTrails();
                const trailsMap: Record<number, Trail> = {};
                trailsData.forEach((trail) => {
                    trailsMap[trail.trailId] = trail;
                });
                setTrails(trailsMap);

                // Fetch issues based on filters
                let issuesData: Issue[] = [];

                if (selectedTrailId) {
                    // If trail is selected, fetch issues for that trail
                    issuesData = await issueApi.getIssuesByTrail(selectedTrailId);
                } else if (selectedParkId) {
                    // If only park is selected, fetch issues for that park
                    issuesData = await issueApi.getIssuesByPark(selectedParkId);
                } else {
                    // No filters, get all issues
                    issuesData = await issueApi.getAllIssues();
                }

                // Filter by public status (for non-admins)
                issuesData = issuesData.filter((issue) => issue.isPublic);

                // Apply status filter if selected
                if (selectedStatus !== 'all') {
                    issuesData = issuesData.filter((issue) => issue.status === selectedStatus);
                }

                setIssues(issuesData);
                applyFiltersAndSort(issuesData);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching issues:', err);
                setError('Failed to load issues. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedParkId, selectedTrailId, selectedStatus, applyFiltersAndSort]);

    // Apply filters and sort when these values change
    useEffect(() => {
        if (issues.length > 0) {
            applyFiltersAndSort(issues);
        }
    }, [issues, applyFiltersAndSort]);

    // Handle filter changes
    const handleParkChange = (value: string) => {
        const parkId = value ? parseInt(value, 10) : undefined;
        setSelectedParkId(parkId);
        setSelectedTrailId(undefined); // Reset trail selection when park changes
    };

    const handleTrailChange = (value: string) => {
        const trailId = value ? parseInt(value, 10) : undefined;
        setSelectedTrailId(trailId);
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value as IssueStatusEnum | 'all');
    };

    const handleDateFilterChange = (value: string) => {
        setDateFilter(value as DateFilter);
    };

    // Filter trails based on selected park
    const filteredTrails = Object.values(trails).filter(
        (trail) => !selectedParkId || trail.parkId === selectedParkId
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <PageHeader
                title="Trail Issues"
                subtitle="View and manage reported trail issues"
                action={
                    <Link to="/issues/report">
                        <Button variant="primary">Report Issue</Button>
                    </Link>
                }
            />

            <Card className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Issues</h3>

                {/* Filter controls */}
                <div id="filter-controls" className="p-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
                        <Select
                            label="Park"
                            options={[
                                { value: '', label: 'All Parks' },
                                ...Object.values(parks)
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((park) => ({ value: park.parkId.toString(), label: park.name }))
                            ]}
                            value={selectedParkId?.toString() || ''}
                            onChange={handleParkChange}
                            fullWidth
                        />

                        <Select
                            label="Trail"
                            options={[
                                { value: '', label: selectedParkId ? 'All Trails in Selected Park' : 'All Trails' },
                                ...filteredTrails
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((trail) => ({ value: trail.trailId.toString(), label: trail.name }))
                            ]}
                            value={selectedTrailId?.toString() || ''}
                            onChange={handleTrailChange}
                            disabled={filteredTrails.length === 0}
                            fullWidth
                        />

                        <Select
                            label="Status"
                            options={[
                                { value: 'all', label: 'All Statuses' },
                                { value: 'open', label: 'Open' },
                                { value: 'in_progress', label: 'In Progress' },
                                { value: 'resolved', label: 'Resolved' }
                            ]}
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            fullWidth
                        />

                        <Select
                            label="Time Period"
                            options={[
                                { value: 'all', label: 'All Time' },
                                { value: 'week', label: 'Past Week' },
                                { value: 'month', label: 'Past Month' },
                                { value: '3months', label: 'Past 3 Months' },
                                { value: 'year', label: 'Past Year' }
                            ]}
                            value={dateFilter}
                            onChange={handleDateFilterChange}
                            fullWidth
                        />
                    </div>
                </div>
            </Card>

            {error ? (
                <EmptyState
                    title="Error loading issues"
                    description={error}
                    action={
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    }
                />
            ) : (
                <div>
                    {/* Responsive header and sort section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {filteredIssues.length} {filteredIssues.length === 1 ? 'Issue' : 'Issues'} Found
                        </h2>
                        <div className="flex items-center self-stretch sm:self-auto w-full sm:w-auto">
                            <span className="text-sm text-gray-600 mr-2 whitespace-nowrap">Sort by:</span>
                            <div className="relative flex-grow sm:w-48">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="appearance-none block w-full rounded-md py-2 px-3 pr-10 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
                                    aria-label="Sort issues by"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="urgency-high">Highest Urgency</option>
                                    <option value="urgency-low">Lowest Urgency</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <IssueList
                        issues={filteredIssues}
                        parks={parks}
                        trails={trails}
                        emptyStateMessage="No issues match the selected filters"
                    />
                </div>
            )}
        </div>
    );
};
