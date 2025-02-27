import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Issue } from '../../types';
import { mockApi } from '../../services/mockData';
import { Select } from '../../components/ui/Select';

// Dashboard charts component that will be added to the dashboard page
const DashboardCharts: React.FC = () => {
  const [issuesByPark, setIssuesByPark] = useState<any[]>([]);
  const [issuesByType, setIssuesByType] = useState<any[]>([]);
  const [issuesTrend, setIssuesTrend] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('parks');
  const [timeFilter, setTimeFilter] = useState('week');
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  
  // For park limitations - top N parks, rest grouped as "Other"
  const TOP_PARKS_COUNT = 10;

  // Helper function to generate trend data for different time periods
  const generateTrendData = (issues: Issue[], period: string) => {
    const today = new Date();
    let dateFormat: Intl.DateTimeFormatOptions;
    let intervals: number;
    let dateStep: (date: Date, i: number) => Date;
    
    switch(period) {
      case 'week':
        intervals = 7;
        dateFormat = { month: 'short', day: 'numeric' };
        dateStep = (date, i) => {
          const newDate = new Date(date);
          newDate.setDate(date.getDate() - i);
          return newDate;
        };
        break;
      case 'month':
        intervals = 4;
        dateFormat = { month: 'short', day: 'numeric' };
        dateStep = (date, i) => {
          const newDate = new Date(date);
          newDate.setDate(date.getDate() - (i * 7));
          return newDate;
        };
        break;
      case 'year':
        intervals = 12;
        dateFormat = { month: 'short' };
        dateStep = (date, i) => {
          const newDate = new Date(date);
          newDate.setMonth(date.getMonth() - i);
          return newDate;
        };
        break;
      case 'all':
      default:
        // For all time, we'll do 2-year intervals in quarters
        intervals = 8;
        dateFormat = { month: 'short', year: 'numeric' };
        dateStep = (date, i) => {
          const newDate = new Date(date);
          newDate.setMonth(date.getMonth() - (i * 3));
          return newDate;
        };
    }
    
    const trendData = [];
    
    // In a real app, this would process actual date data from the issues
    // For now, generate mock data with appropriate time intervals
    for (let i = intervals - 1; i >= 0; i--) {
      const date = dateStep(today, i);
      
      // For a real app, filter issues by this date range and count them
      trendData.push({
        date: date.toLocaleDateString('en-US', dateFormat),
        reported: Math.floor(Math.random() * 3) + 2 + ((intervals - i) % 3),
        resolved: Math.floor(Math.random() * 2) + 1 + ((intervals - i - 1) % 2)
      });
    }
    
    return trendData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all issues and parks
        const issues = await mockApi.getIssues();
        const parks = await mockApi.getParks();
        const trails = await mockApi.getTrails();
        
        setAllIssues(issues);

        // Create a map of park IDs to names
        const parkNames: Record<number, string> = {};
        parks.forEach(park => {
          parkNames[park.park_id] = park.name;
        });

        // Count issues by park but only focus on open and in-progress issues
        // as these are the ones that require attention
        const issueCountByPark: Record<number, { 
          parkId: number, 
          name: string, 
          open: number, 
          inProgress: number,
          openPercentage: number,
          inProgressPercentage: number,
          totalActive: number
        }> = {};
        
        parks.forEach(park => {
          issueCountByPark[park.park_id] = { 
            parkId: park.park_id,
            name: park.name, 
            open: 0, 
            inProgress: 0,
            openPercentage: 0,
            inProgressPercentage: 0,
            totalActive: 0
          };
        });

        issues.forEach(issue => {
          if (issueCountByPark[issue.park_id]) {
            if (issue.status === 'open') {
              issueCountByPark[issue.park_id].open += 1;
              issueCountByPark[issue.park_id].totalActive += 1;
            } else if (issue.status === 'in_progress') {
              issueCountByPark[issue.park_id].inProgress += 1;
              issueCountByPark[issue.park_id].totalActive += 1;
            }
          }
        });
        
        // Calculate percentages and filter to parks with active issues
        Object.values(issueCountByPark).forEach(park => {
          if (park.totalActive > 0) {
            park.openPercentage = Math.round((park.open / park.totalActive) * 100);
            park.inProgressPercentage = Math.round((park.inProgress / park.totalActive) * 100);
          }
        });

        // Sort parks by total active issues and get top N parks
        const activeParks = Object.values(issueCountByPark)
          .filter(park => park.totalActive > 0)
          .sort((a, b) => b.totalActive - a.totalActive);
        
        const topParks = activeParks.slice(0, TOP_PARKS_COUNT);
        
        // Format for the lollipop chart
        const parkData = topParks.map(park => ({
          name: park.name,
          open: park.open,
          inProgress: park.inProgress,
          totalActive: park.totalActive,
          openPercentage: park.openPercentage,
          inProgressPercentage: park.inProgressPercentage
        }));

        setIssuesByPark(parkData);

        // Count issues by type for radar chart
        const issueTypeCount: { [key: string]: number } = {};
        
        issues.forEach(issue => {
          const type = issue.issue_type.charAt(0).toUpperCase() + issue.issue_type.slice(1);
          if (!issueTypeCount[type]) {
            issueTypeCount[type] = 0;
          }
          issueTypeCount[type] += 1;
        });
        
        // Get max value for scaling
        const maxCount = Math.max(...Object.values(issueTypeCount));

        // Format data for the radar chart
        const typeData = Object.keys(issueTypeCount).map(type => ({
          subject: type,
          A: issueTypeCount[type],
          fullMark: maxCount,
          // For color reference
          colorIndex: Object.keys(issueTypeCount).indexOf(type)
        }));

        setIssuesByType(typeData);

        // Generate trend data based on the selected time period
        const trendData = generateTrendData(issues, timeFilter);
        setIssuesTrend(trendData);

      } catch (error) {
        console.error('Error fetching data for charts:', error);
      }
    };

    fetchData();
  }, []);
  
  // Update trend data when time filter changes
  useEffect(() => {
    if (allIssues.length > 0) {
      const trendData = generateTrendData(allIssues, timeFilter);
      setIssuesTrend(trendData);
    }
  }, [timeFilter, allIssues]);

  // Colors for the charts
  const COLORS = ['#BD4602', '#ED7D38', '#F29E69', '#F6BF99', '#FBDEC8', '#993800', '#80300A', '#732A00', '#4D1C00', '#260E00'];
  const STATUS_COLORS = {
    open: '#ef4444',
    inProgress: '#f59e0b',
    resolved: '#10b981'
  };

  // Handle time filter change
  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
  };
  
  // Tab navigation for different charts on mobile
  const renderTabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-4 md:hidden">
      <button
        className={`py-2 px-4 font-medium text-sm transition-colors ${
          activeTab === 'parks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('parks')}
      >
        Issues by Park
      </button>
      <button
        className={`py-2 px-4 font-medium text-sm transition-colors ${
          activeTab === 'types' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('types')}
      >
        Issue Types
      </button>
      <button
        className={`py-2 px-4 font-medium text-sm transition-colors ${
          activeTab === 'trend' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('trend')}
      >
        Trend
      </button>
    </div>
  );

  const renderIssuesByParkChart = () => (
    <div className={`${activeTab === 'parks' ? 'block' : 'hidden md:block'}`}>
      <h3 className="text-base font-semibold text-gray-900 mb-3">Active Issues by Park</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={issuesByPark.sort((a, b) => b.totalActive - a.totalActive)} // Sort by total active issues
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            barGap={4}
            barCategoryGap={16}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis 
              type="number" 
              domain={[0, 'dataMax']}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              dataKey="name" 
              type="category"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={120} // Fixed width for park names
              tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'open') return [`${value} issues`, 'Open'];
                if (name === 'inProgress') return [`${value} issues`, 'In Progress'];
                return [value, name];
              }}
              contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            
            {/* Bar for open issues */}
            <Bar 
              dataKey="open" 
              fill={STATUS_COLORS.open} 
              name="Open" 
              radius={[0, 4, 4, 0]} 
              barSize={16}
              label={{ 
                position: 'right', 
                fill: '#6b7280',
                fontSize: 11,
                formatter: (value: number) => value > 0 ? value : '',
                offset: 6
              }}
            />
            
            {/* Bar for in progress issues */}
            <Bar 
              dataKey="inProgress" 
              fill={STATUS_COLORS.inProgress} 
              name="In Progress" 
              radius={[0, 4, 4, 0]} 
              barSize={16}
              label={{ 
                position: 'right', 
                fill: '#6b7280',
                fontSize: 11,
                formatter: (value: number) => value > 0 ? value : '',
                offset: 6
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Showing top {TOP_PARKS_COUNT} parks with active issues
      </p>
    </div>
  );

    const renderIssuesByTypeChart = () => {
        return (
            <div className={`${activeTab === 'types' ? 'block' : 'hidden md:block'}`}>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Issue Types Distribution</h3>
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={issuesByType}
                            margin={{
                                top: 0,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                            <XAxis type="number" domain={[0, 'dataMax']} />
                            <YAxis
                                dataKey="subject"
                                type="category"
                                tick={{ fontSize: 12 }}
                                width={100}
                            />
                            <Tooltip
                                formatter={(value) => [`${value} issues`, 'Count']}
                                contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                            />
                            <Legend />
                            <Bar
                                dataKey="A"
                                name="Number of Issues"
                                fill="#BD4602"
                                radius={[0, 4, 4, 0]}
                                label={{
                                    position: 'right',
                                    fill: '#6b7280',
                                    fontSize: 11,
                                    formatter: (value: number) => value > 0 ? value : '',
                                    offset: 6
                                }}
                            >
                                {issuesByType.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Distribution of issues by type across all parks
                </p>
            </div>
        );
    };

  const renderIssuesTrendChart = () => {
    // Get appropriate title based on time filter
    const getTrendTitle = () => {
      switch(timeFilter) {
        case 'week': return 'Weekly Issue Trends';
        case 'month': return 'Monthly Issue Trends';
        case 'year': return 'Yearly Issue Trends';
        case 'all': return 'All Time Issue Trends';
        default: return 'Issue Trends';
      }
    };
    
    return (
      <div className={`${activeTab === 'trend' ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
          <h3 className="text-base font-semibold text-gray-900 mb-2 sm:mb-0">{getTrendTitle()}</h3>
          <div className="w-full sm:w-40">
            <Select
              options={[
                { value: 'week', label: 'Past Week' },
                { value: 'month', label: 'Past Month' },
                { value: 'year', label: 'Past Year' },
                { value: 'all', label: 'All Time' }
              ]}
              value={timeFilter}
              onChange={handleTimeFilterChange}
            />
          </div>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={issuesTrend}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Line
                type="monotone"
                dataKey="reported"
                name="Reported Issues"
                stroke="#BD4602"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                name="Resolved Issues"
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4">
      {renderTabNavigation()}
      
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">{renderIssuesByParkChart()}</div>
        <div>{renderIssuesByTypeChart()}</div>
        <div className="lg:col-span-3">{renderIssuesTrendChart()}</div>
      </div>
      
      <div className="md:hidden">
        {activeTab === 'parks' && renderIssuesByParkChart()}
        {activeTab === 'types' && renderIssuesByTypeChart()}
        {activeTab === 'trend' && renderIssuesTrendChart()}
      </div>
    </Card>
  );
};

export default DashboardCharts;