import { 
    Park, 
    Trail, 
    Issue, 
    User, 
    StewardParkAssignment,
    IssueResolutionUpdate
} from '../types';

// Mock Users
export const users: User[] = [
    {
        user_id: 1,
        name: 'John Smith',
        is_hubspot_user: true,
        picture: 'https://randomuser.me/api/portraits/men/1.jpg',
        email: 'john.smith@example.com',
        created_at: '2024-01-15T08:30:00Z',
        is_active: true,
        role: 'steward'
    },
    {
        user_id: 2,
        name: 'Jane Doe',
        is_hubspot_user: true,
        picture: 'https://randomuser.me/api/portraits/women/2.jpg',
        email: 'jane.doe@example.com',
        created_at: '2024-01-20T10:15:00Z',
        is_active: true,
        role: 'owner'
    },
    {
        user_id: 3,
        name: 'Mike Johnson',
        is_hubspot_user: false,
        picture: 'https://randomuser.me/api/portraits/men/3.jpg',
        email: 'mike.johnson@example.com',
        created_at: '2024-02-05T14:45:00Z',
        is_active: true,
        role: 'volunteer'
    },
    {
        user_id: 4,
        name: 'Sarah Williams',
        is_hubspot_user: false,
        picture: 'https://randomuser.me/api/portraits/women/4.jpg',
        email: 'sarah.williams@example.com',
        created_at: '2024-02-10T11:20:00Z',
        is_active: true,
        role: 'steward'
    }
];

// Mock Parks
export const parks: Park[] = [
    {
        park_id: 1,
        owner_id: 2,
        name: 'Frick Park',
        county: 'Allegheny',
        is_active: true
    },
    {
        park_id: 2,
        owner_id: 2,
        name: 'Schenley Park',
        county: 'Allegheny',
        is_active: true
    },
    {
        park_id: 3,
        owner_id: 2,
        name: 'Highland Park',
        county: 'Allegheny',
        is_active: true
    },
    {
        park_id: 4,
        owner_id: 2,
        name: 'Riverview Park',
        county: 'Allegheny',
        is_active: false
    }
];

// Mock Trails
export const trails: Trail[] = [
    {
        trail_id: 1,
        park_id: 1,
        name: 'Frick Park Loop',
        is_active: true,
        is_open: true
    },
    {
        trail_id: 2,
        park_id: 1,
        name: 'Nine Mile Run Trail',
        is_active: true,
        is_open: true
    },
    {
        trail_id: 3,
        park_id: 2,
        name: 'Schenley Park Loop',
        is_active: true,
        is_open: true
    },
    {
        trail_id: 4,
        park_id: 2,
        name: 'Panther Hollow Trail',
        is_active: true,
        is_open: false
    },
    {
        trail_id: 5,
        park_id: 3,
        name: 'Highland Park Reservoir Loop',
        is_active: true,
        is_open: true
    },
    {
        trail_id: 6,
        park_id: 4,
        name: 'Riverview Park Loop',
        is_active: true,
        is_open: true
    }
];

// Mock Issues
export const issues: Issue[] = [
    {
        issue_id: 1,
        park_id: 1,
        trail_id: 1,
        is_public: true,
        status: 'open',
        description: 'Large tree down blocking the main trail',
        reported_at: '2025-02-15T09:30:00Z',
        issue_type: 'obstruction',
        urgency: 4,
        issue_image: 'https://images.unsplash.com/photo-1589825541479-52ad2c3e31ae',
        lon: -79.9022,
        lat: 40.4374,
        notify_reporter: true
    },
    {
        issue_id: 2,
        park_id: 1,
        trail_id: 2,
        is_public: true,
        status: 'in_progress',
        description: 'Trail erosion after recent rainfall',
        reported_at: '2025-02-10T14:15:00Z',
        issue_type: 'erosion',
        urgency: 3,
        issue_image: 'https://images.unsplash.com/photo-1542202229-7d93c33f5d07',
        lon: -79.9056,
        lat: 40.4351,
        notify_reporter: true
    },
    {
        issue_id: 3,
        park_id: 2,
        trail_id: 3,
        is_public: true,
        status: 'resolved',
        description: 'Damaged signage at trail intersection',
        reported_at: '2025-01-28T11:45:00Z',
        issue_type: 'signage',
        urgency: 2,
        issue_image: 'https://images.unsplash.com/photo-1583407733101-dfe6bc124576',
        lon: -79.9470,
        lat: 40.4359,
        notify_reporter: false,
        resolved_at: '2025-02-05T15:20:00Z'
    },
    {
        issue_id: 4,
        park_id: 2,
        trail_id: 4,
        is_public: false,
        status: 'open',
        description: 'Several branches down after storm',
        reported_at: '2025-02-18T10:00:00Z',
        issue_type: 'obstruction',
        urgency: 3,
        issue_image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122',
        lon: -79.9498,
        lat: 40.4329,
        notify_reporter: true
    },
    {
        issue_id: 5,
        park_id: 3,
        trail_id: 5,
        is_public: true,
        status: 'in_progress',
        description: 'Flooding near the reservoir',
        reported_at: '2025-02-12T08:30:00Z',
        issue_type: 'flooding',
        urgency: 5,
        issue_image: 'https://images.unsplash.com/photo-1574200113687-a1168be12cd5',
        lon: -79.9130,
        lat: 40.4829,
        notify_reporter: true
    },
    {
        issue_id: 6,
        park_id: 3,
        trail_id: 5,
        is_public: true,
        status: 'resolved',
        description: 'Flooding near the reservoir',
        reported_at: '2025-01-25T13:10:00Z',
        issue_type: 'flooding',
        urgency: 2,
        issue_image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18',
        lon: -79.9140,
        lat: 40.4815,
        notify_reporter: false,
        resolved_at: '2025-01-27T09:45:00Z'
    },
    {
        issue_id: 7,
        park_id: 1,
        trail_id: 1,
        is_public: true,
        status: 'open',
        description: 'Damaged trail markers causing navigation confusion',
        reported_at: '2025-02-20T11:15:00Z',
        issue_type: 'signage',
        urgency: 3,
        issue_image: 'https://images.unsplash.com/photo-1581638919428-b185de73277d',
        lon: -79.9030,
        lat: 40.4380,
        notify_reporter: true
    },
    {
        issue_id: 8,
        park_id: 1,
        trail_id: 2,
        is_public: true,
        status: 'in_progress',
        description: 'Invasive plant species spreading along trail edges',
        reported_at: '2025-02-16T09:45:00Z',
        issue_type: 'vegetation',
        urgency: 4,
        issue_image: 'https://images.unsplash.com/photo-1610141160480-d64e0c63f5ea',
        lon: -79.9060,
        lat: 40.4355,
        notify_reporter: true
    },
    {
        issue_id: 9,
        park_id: 2,
        trail_id: 3,
        is_public: true,
        status: 'open',
        description: 'Loose gravel making trail surface unstable',
        reported_at: '2025-02-22T14:30:00Z',
        issue_type: 'trail_condition',
        urgency: 3,
        issue_image: 'https://images.unsplash.com/photo-1593014432442-cf6f4e4fa861',
        lon: -79.9475,
        lat: 40.4365,
        notify_reporter: true
    },
    {
        issue_id: 10,
        park_id: 2,
        trail_id: 4,
        is_public: false,
        status: 'in_progress',
        description: 'Water drainage problem causing muddy sections',
        reported_at: '2025-02-19T10:20:00Z',
        issue_type: 'drainage',
        urgency: 4,
        issue_image: 'https://images.unsplash.com/photo-1602928298173-9d6b5eba5b22',
        lon: -79.9490,
        lat: 40.4335,
        notify_reporter: true
    },
    {
        issue_id: 11,
        park_id: 3,
        trail_id: 5,
        is_public: true,
        status: 'open',
        description: 'Broken bench along the trail',
        reported_at: '2025-02-25T13:55:00Z',
        issue_type: 'infrastructure',
        urgency: 2,
        issue_image: 'https://images.unsplash.com/photo-1581579186913-45ac24ed53d2',
        lon: -79.9135,
        lat: 40.4835,
        notify_reporter: true
    },
    {
        issue_id: 12,
        park_id: 4,
        trail_id: 6,
        is_public: true,
        status: 'open',
        description: 'Overgrown vegetation blocking trail visibility',
        reported_at: '2025-02-23T16:10:00Z',
        issue_type: 'vegetation',
        urgency: 3,
        issue_image: 'https://images.unsplash.com/photo-1594213124414-d83bfa22c05d',
        lon: -79.9510,
        lat: 40.4310,
        notify_reporter: true
    }
];

// Mock Steward Assignments
export const stewardAssignments: StewardParkAssignment[] = [
    {
        assignment_id: 1,
        user_id: 1, // John Smith
        park_id: 1, // Frick Park
        assigned_date: '2024-01-15T08:30:00Z',
        is_active: true
    },
    {
        assignment_id: 2,
        user_id: 4, // Sarah Williams
        park_id: 2, // Schenley Park
        assigned_date: '2024-02-10T11:20:00Z',
        is_active: true
    },
    {
        assignment_id: 3,
        user_id: 1, // John Smith
        park_id: 3, // Highland Park
        assigned_date: '2024-01-20T14:45:00Z',
        is_active: true
    }
];

// Mock Issue Resolutions
export const issueResolutions: IssueResolutionUpdate[] = [
    {
        res_id: 1,
        issue_id: 3,
        resolve_image: 'https://images.unsplash.com/photo-1581622558663-b789e2a2574d',
        resolved_at: '2025-02-05T15:20:00Z',
        resolved_by: 4 // Sarah Williams
    },
    {
        res_id: 2,
        issue_id: 6,
        resolve_image: 'https://images.unsplash.com/photo-1532509774891-141d37f25ae9',
        resolved_at: '2025-01-27T09:45:00Z',
        resolved_by: 1 // John Smith
    }
];

// Mock API services
export const mockApi = {
    // Parks
    getParks: () => Promise.resolve([...parks]),
    getPark: (id: number) => Promise.resolve(parks.find((park) => park.park_id === id)),
    createPark: (park: Omit<Park, 'park_id'>) => {
        const newPark = { ...park, park_id: parks.length + 1 };
        parks.push(newPark);
        return Promise.resolve(newPark);
    },
    updatePark: (park: Park) => {
        const index = parks.findIndex((p) => p.park_id === park.park_id);
        if (index !== -1) {
            parks[index] = park;
            return Promise.resolve(park);
        }
        return Promise.reject(new Error('Park not found'));
    },
    
    // Trails
    getTrails: () => Promise.resolve([...trails]),
    getTrailsByPark: (parkId: number) => 
        Promise.resolve(trails.filter((trail) => trail.park_id === parkId)),
    getTrail: (id: number) => Promise.resolve(trails.find((trail) => trail.trail_id === id)),
    createTrail: (trail: Omit<Trail, 'trail_id'>) => {
        const newTrail = { ...trail, trail_id: trails.length + 1 };
        trails.push(newTrail);
        return Promise.resolve(newTrail);
    },
    updateTrail: (trail: Trail) => {
        const index = trails.findIndex((t) => t.trail_id === trail.trail_id);
        if (index !== -1) {
            trails[index] = trail;
            return Promise.resolve(trail);
        }
        return Promise.reject(new Error('Trail not found'));
    },
    
    // Issues
    getIssues: () => Promise.resolve([...issues]),
    getIssuesByPark: (parkId: number) => 
        Promise.resolve(issues.filter((issue) => issue.park_id === parkId)),
    getIssuesByTrail: (trailId: number) => 
        Promise.resolve(issues.filter((issue) => issue.trail_id === trailId)),
    getIssue: (id: number) => Promise.resolve(issues.find((issue) => issue.issue_id === id)),
    createIssue: (issue: Omit<Issue, 'issue_id'>) => {
        const newIssue = { ...issue, issue_id: issues.length + 1 };
        issues.push(newIssue);
        return Promise.resolve(newIssue);
    },
    updateIssue: (issue: Issue) => {
        const index = issues.findIndex((i) => i.issue_id === issue.issue_id);
        if (index !== -1) {
            issues[index] = issue;
            return Promise.resolve(issue);
        }
        return Promise.reject(new Error('Issue not found'));
    },
    resolveIssue: (issueId: number, userId: number, resolveImage?: string, resolvenotes?: string) => {
        const issue = issues.find((i) => i.issue_id === issueId);
        if (!issue) {
            return Promise.reject(new Error('Issue not found'));
        }
        
        const resolvedAt = new Date().toISOString();
        
        // Update the issue
        issue.status = 'resolved';
        issue.resolved_at = resolvedAt;
        
        // Create a resolution record
        const resolution: IssueResolutionUpdate = {
            res_id: issueResolutions.length + 1,
            issue_id: issueId,
            resolve_image: resolveImage,
            resolve_notes: resolvenotes,
            resolved_at: resolvedAt,
            resolved_by: userId
        };
        
        issueResolutions.push(resolution);
        return Promise.resolve({ issue, resolution });
    },
    
    // Users
    getUsers: () => Promise.resolve([...users]),
    getUsersByRole: (role: string) => 
        Promise.resolve(users.filter((user) => user.role === role)),
    getUser: (id: number) => Promise.resolve(users.find((user) => user.user_id === id)),
    
    // Steward Assignments
    getStewardAssignments: () => Promise.resolve([...stewardAssignments]),
    getStewardAssignmentsByPark: (parkId: number) => 
        Promise.resolve(stewardAssignments.filter((a) => a.park_id === parkId)),
    getStewardAssignmentsBySteward: (userId: number) => 
        Promise.resolve(stewardAssignments.filter((a) => a.user_id === userId)),
    
    // Resolution Updates
    getResolutionUpdates: () => Promise.resolve([...issueResolutions]),
    getResolutionUpdatesByIssue: (issueId: number) => 
        Promise.resolve(issueResolutions.filter((r) => r.issue_id === issueId))
};
