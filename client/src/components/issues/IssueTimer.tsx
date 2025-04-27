// src/components/issues/IssueTimer.tsx
import React, { useState, useEffect } from 'react';
import { Issue, IssueStatusEnum } from '../../types';
import { differenceInDays } from 'date-fns/differenceInDays';
import { differenceInHours } from 'date-fns/differenceInHours';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';
import { parseISO } from 'date-fns/parseISO';

interface IssueTimerProps {
    issue: Issue;
}

export const IssueTimer: React.FC<IssueTimerProps> = ({ issue }) => {
    const [timeDisplay, setTimeDisplay] = useState<string>('');
    const [statusIndicator, setStatusIndicator] = useState<string>('');
    const isResolved = issue.status === IssueStatusEnum.RESOLVED;

    // Safe date parsing function
    const safeParseISO = (dateString?: string): Date | null => {
        try {
            if (!dateString) {
                return null;
            }
            let date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date;
            }
        
            date = parseISO(dateString);
            if (!isNaN(date.getTime())) {
                return date;
            }

            return null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error parsing date:', error, dateString);
            return null;
        }
    };

    useEffect(() => {
        const updateTime = () => {
            try {
                // Safely parse reported date
                const reportedDate = safeParseISO(issue.createdAt);
                if (!reportedDate) {
                    setTimeDisplay('Unknown duration');
                    setStatusIndicator(isResolved ? 'Resolved' : 'Unknown');
                    return;
                }

                const now = new Date();
                
                // Safely parse resolved date if applicable
                let endDate: Date;
                if (isResolved && issue.resolvedAt) {
                    const resolvedDate = safeParseISO(issue.resolvedAt);
                    endDate = resolvedDate || now;
                } else {
                    endDate = now;
                }

                // Calculate time units
                const totalDays = differenceInDays(endDate, reportedDate);
                const totalHours = differenceInHours(endDate, reportedDate);
                const hours = totalHours % 24;
                const totalMinutes = differenceInMinutes(endDate, reportedDate);
                const minutes = totalMinutes % 60;
                const totalSeconds = differenceInSeconds(endDate, reportedDate);
                const seconds = totalSeconds % 60;

                // Formatting logic with full unit names, showing only non-zero units
                let display = '';

                // Just now (less than a minute)
                if (totalSeconds < 60) {
                    display = 'Just now';
                } else {
                    const parts = [];

                    // Add days if at least 1
                    if (totalDays > 0) {
                        parts.push(`${totalDays} ${totalDays === 1 ? 'day' : 'days'}`);
                    }

                    // Add hours if at least 1
                    if (hours > 0 || (totalDays === 0 && totalMinutes >= 60)) {
                        const hoursToShow = totalDays === 0 ? totalHours : hours;
                        parts.push(`${hoursToShow} ${hoursToShow === 1 ? 'hour' : 'hours'}`);
                    }

                    // Add minutes if at least 1 or if we have no days and no hours
                    if (minutes > 0 || (totalDays === 0 && totalHours === 0)) {
                        parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
                    }

                    // Add seconds only for very short durations (< 10 minutes) and if seconds > 0
                    if (totalMinutes < 10 && seconds > 0 && totalHours === 0) {
                        parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
                    }

                    display = parts.join(' ');
                }

                setTimeDisplay(display);

                // Set status indicator based on time elapsed
                if (!isResolved) {
                    if (totalDays >= 30) {
                        setStatusIndicator('Critical');
                    } else if (totalDays >= 14) {
                        setStatusIndicator('Urgent');
                    } else if (totalDays >= 7) {
                        setStatusIndicator('Extended');
                    } else if (totalDays >= 3) {
                        setStatusIndicator('Ongoing');
                    } else if (totalDays >= 1) {
                        setStatusIndicator('Recent');
                    } else {
                        setStatusIndicator('New');
                    }
                } else {
                    setStatusIndicator('Resolved');
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error updating timer:', error);
                setTimeDisplay('Error calculating duration');
                setStatusIndicator(isResolved ? 'Resolved' : 'Unknown');
            }
        };

        updateTime();

        // Only set up interval if we have valid dates
        let intervalId: ReturnType<typeof setInterval>;
        
        if (!isResolved) {
            try {
                const reportedDate = safeParseISO(issue.createdAt);
                
                if (reportedDate) {
                    const now = new Date();
                    const totalMinutes = differenceInMinutes(now, reportedDate);

                    if (totalMinutes < 60) {
                        // Update every second for issues less than an hour old
                        intervalId = setInterval(updateTime, 1000);
                    } else if (differenceInHours(now, reportedDate) < 24) {
                        // Update every minute for issues less than a day old
                        intervalId = setInterval(updateTime, 60000);
                    } else {
                        // Update every hour for older issues
                        intervalId = setInterval(updateTime, 3600000);
                    }
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error setting timer interval:', error);
            }
        }

        return () => {
            if (intervalId) { clearInterval(intervalId); }
        };
    }, [issue, isResolved]);

    // Get status indicator color
    const getStatusColor = () => {
        if (isResolved) { return 'bg-gray-100 text-gray-600'; }

        switch (statusIndicator) {
        case 'Critical':
            return 'bg-red-50 text-red-700';
        case 'Urgent':
            return 'bg-red-50 text-red-700';
        case 'Extended':
            return 'bg-orange-50 text-orange-700';
        case 'Ongoing':
            return 'bg-yellow-50 text-yellow-700';
        case 'Recent':
            return 'bg-blue-50 text-blue-700';
        case 'Unknown':
            return 'bg-gray-50 text-gray-700';
        default: // New Issue
            return 'bg-green-50 text-green-700';
        }
    };

    return (
        <div>
            <p className="text-sm font-medium text-gray-500">Duration</p>
            <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-700 font-medium">
                    {timeDisplay}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor()}`}>
                    {statusIndicator}
                </span>
            </div>
        </div>
    );
};
