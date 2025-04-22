import { 
    Issue, 
    StewardParkAssignment,
    IssueResolutionUpdate
} from '../types';

// Mock Issues
export const issues: Issue[] = [
    {
        issueId: 1,
        parkId: 1,
        trailId: 1,
        isPublic: true,
        status: 'open',
        description: 'Large tree down blocking the main trail',
        issueType: 'obstruction',
        urgency: 4,
        lon: -79.9022,
        lat: 40.4374,
        notifyReporter: true,
        reporterEmail: 'john.smith@example.com',
        createdAt: '2025-02-15T09:30:00Z',
    },
    {
        issueId: 2,
        parkId: 1,
        trailId: 2,
        isPublic: true,
        status: 'in_progress',
        description: 'Trail erosion after recent rainfall',
        createdAt: '2025-02-10T14:15:00Z',
        issueType: 'erosion',
        urgency: 3,
        lon: -79.9056,
        lat: 40.4351,
        notifyReporter: true,
        reporterEmail: 'jane.doe@example.com'
    },
    {
        issueId: 3,
        parkId: 2,
        trailId: 3,
        isPublic: true,
        status: 'resolved',
        description: 'Damaged signage at trail intersection',
        createdAt: '2025-01-28T11:45:00Z',
        issueType: 'signage',
        urgency: 2,
        lon: -79.9470,
        lat: 40.4359,
        notifyReporter: false,
        reporterEmail: 'bob.johnson@example.com',
        resolvedAt: '2025-02-05T15:20:00Z'
    },
    {
        issueId: 4,
        parkId: 2,
        trailId: 4,
        isPublic: false,
        status: 'open',
        description: 'Several branches down after storm',
        createdAt: '2025-02-18T10:00:00Z',
        issueType: 'obstruction',
        urgency: 3,
        lon: -79.9498,
        lat: 40.4329,
        notifyReporter: true,
        reporterEmail: 'alice.wilson@example.com'
    },
    {
        issueId: 5,
        parkId: 3,
        trailId: 5,
        isPublic: true,
        status: 'in_progress',
        description: 'Flooding near the reservoir',
        createdAt: '2025-02-12T08:30:00Z',
        issueType: 'flooding',
        urgency: 5,
        lon: -79.9130,
        lat: 40.4829,
        notifyReporter: true,
        reporterEmail: 'charlie.brown@example.com'
    },
    {
        issueId: 6,
        parkId: 3,
        trailId: 5,
        isPublic: true,
        status: 'resolved',
        description: 'Flooding near the reservoir',
        createdAt: '2025-01-25T13:10:00Z',
        issueType: 'flooding',
        urgency: 2,
        lon: -79.9140,
        lat: 40.4815,
        notifyReporter: false,
        reporterEmail: 'david.miller@example.com',
        resolvedAt: '2025-01-27T09:45:00Z'
    },
    {
        issueId: 7,
        parkId: 1,
        trailId: 1,
        isPublic: true,
        status: 'open',
        description: 'Damaged trail markers causing navigation confusion',
        createdAt: '2025-02-20T11:15:00Z',
        issueType: 'signage',
        urgency: 3,
        lon: -79.9030,
        lat: 40.4380,
        notifyReporter: true,
        reporterEmail: 'emma.davis@example.com'
    },
    {
        issueId: 8,
        parkId: 1,
        trailId: 2,
        isPublic: true,
        status: 'in_progress',
        description: 'Invasive plant species spreading along trail edges',
        createdAt: '2025-02-16T09:45:00Z',
        issueType: 'vegetation',
        urgency: 4,
        lon: -79.9060,
        lat: 40.4355,
        notifyReporter: true,
        reporterEmail: 'frank.wilson@example.com'
    },
    {
        issueId: 9,
        parkId: 2,
        trailId: 3,
        isPublic: true,
        status: 'open',
        description: 'Loose gravel making trail surface unstable',
        createdAt: '2025-02-22T14:30:00Z',
        issueType: 'trail_condition',
        urgency: 3,
        lon: -79.9475,
        lat: 40.4365,
        notifyReporter: true,
        reporterEmail: 'grace.lee@example.com'
    },
    {
        issueId: 10,
        parkId: 2,
        trailId: 4,
        isPublic: false,
        status: 'in_progress',
        description: 'Water drainage problem causing muddy sections',
        createdAt: '2025-02-19T10:20:00Z',
        issueType: 'drainage',
        urgency: 4,
        lon: -79.9490,
        lat: 40.4335,
        notifyReporter: true,
        reporterEmail: 'henry.moore@example.com'
    },
    {
        issueId: 11,
        parkId: 3,
        trailId: 5,
        isPublic: true,
        status: 'open',
        description: 'Broken bench along the trail',
        createdAt: '2025-02-25T13:55:00Z',
        issueType: 'infrastructure',
        urgency: 2,
        lon: -79.9135,
        lat: 40.4835,
        notifyReporter: true,
        reporterEmail: 'isabel.taylor@example.com'
    },
    {
        issueId: 12,
        parkId: 4,
        trailId: 6,
        isPublic: true,
        status: 'open',
        description: 'Overgrown vegetation blocking trail visibility',
        createdAt: '2025-02-23T16:10:00Z',
        issueType: 'vegetation',
        urgency: 3,
        lon: -79.9510,
        lat: 40.4310,
        notifyReporter: true,
        reporterEmail: 'jack.anderson@example.com'
    }
];

// Mock Steward Assignments
export const stewardAssignments: StewardParkAssignment[] = [
    {
        assignment_id: 1,
        userId: 1, // John Smith
        parkId: 1, // Frick Park
        assigned_date: '2024-01-15T08:30:00Z',
        isActive: true
    },
    {
        assignment_id: 2,
        userId: 4, // Sarah Williams
        parkId: 2, // Schenley Park
        assigned_date: '2024-02-10T11:20:00Z',
        isActive: true
    },
    {
        assignment_id: 3,
        userId: 1, // John Smith
        parkId: 3, // Highland Park
        assigned_date: '2024-01-20T14:45:00Z',
        isActive: true
    }
];

// Mock Issue Resolutions
export const issueResolutions: IssueResolutionUpdate[] = [
    {
        res_id: 1,
        issueId: 3,
        resolve_image: 'https://images.unsplash.com/photo-1581622558663-b789e2a2574d',
        resolvedAt: '2025-02-05T15:20:00Z',
        resolved_by: 4 // Sarah Williams
    },
    {
        res_id: 2,
        issueId: 6,
        resolve_image: 'https://images.unsplash.com/photo-1532509774891-141d37f25ae9',
        resolvedAt: '2025-01-27T09:45:00Z',
        resolved_by: 1 // John Smith
    }
];

// Mock API services
export const mockApi = {
    // Issues
    getIssues: () => Promise.resolve([...issues]),
    getIssuesByPark: (parkId: number) => 
        Promise.resolve(issues.filter((issue) => issue.parkId === parkId)),
    getIssuesByTrail: (trailId: number) => 
        Promise.resolve(issues.filter((issue) => issue.trailId === trailId)),
    getIssue: (id: number) => Promise.resolve(issues.find((issue) => issue.issueId === id)),
    createIssue: (issue: Omit<Issue, 'issueId'>) => {
        const newIssue = { ...issue, issueId: issues.length + 1 };
        issues.push(newIssue);
        return Promise.resolve(newIssue);
    },
    updateIssue: (issue: Issue) => {
        const index = issues.findIndex((i) => i.issueId === issue.issueId);
        if (index !== -1) {
            issues[index] = issue;
            return Promise.resolve(issue);
        }
        return Promise.reject(new Error('Issue not found'));
    },
    resolveIssue: (issueId: number, userId: number, resolveImage?: string, resolvenotes?: string) => {
        const issue = issues.find((i) => i.issueId === issueId);
        if (!issue) {
            return Promise.reject(new Error('Issue not found'));
        }
        
        const resolvedAt = new Date().toISOString();
        
        // Update the issue
        issue.status = 'resolved';
        issue.resolvedAt = resolvedAt;
        
        // Create a resolution record
        const resolution: IssueResolutionUpdate = {
            res_id: issueResolutions.length + 1,
            issueId: issueId,
            resolve_image: resolveImage,
            resolve_notes: resolvenotes,
            resolvedAt: resolvedAt,
            resolved_by: userId
        };
        
        issueResolutions.push(resolution);
        return Promise.resolve({ issue, resolution });
    },
    
    // Users
    getUser: (id: number) => Promise.resolve({
        userId: id,
        username: `user${id}`,
        email: `user${id}@example.com`,
        profileImage: `https://example.com/avatar${id}.jpg`,
        isAdmin: false,
        permission: 'steward',
        isActive: true,
        createdAt: new Date().toISOString()
    }),
    
    // Steward Assignments
    getStewardAssignments: () => Promise.resolve([...stewardAssignments]),
    getStewardAssignmentsByPark: (parkId: number) => 
        Promise.resolve(stewardAssignments.filter((a) => a.parkId === parkId)),
    getStewardAssignmentsBySteward: (userId: number) => 
        Promise.resolve(stewardAssignments.filter((a) => a.userId === userId)),
    
    // Resolution Updates
    getResolutionUpdates: () => Promise.resolve([...issueResolutions]),
    getResolutionUpdatesByIssue: (issueId: number) => 
        Promise.resolve(issueResolutions.filter((r) => r.issueId === issueId))
};
