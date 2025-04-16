import {
    Park, Trail, Issue, IssueParams
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// Error handling helper
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }
    return response.json();
};

export const parkApi = {
    // Get all parks
    getParks: async (): Promise<Park[]> => {
        const response = await fetch(`${API_BASE_URL}/parks`).then(handleResponse);
        return response.parks;
    },

    // Get a specific park by ID
    getPark: async (parkId: number): Promise<Park> => {
        const response = await fetch(`${API_BASE_URL}/parks/${parkId}`)
            .then(handleResponse);
        return response.park;
    },

    // Create a new park
    createPark: async (parkData: Omit<Park, 'park_id'>): Promise<Park> => {
        const response = await fetch(`${API_BASE_URL}/parks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parkData),
        })
            .then(handleResponse);
        return response.park;
    },

    // Update an existing park
    updatePark: async (parkData: Park): Promise<Park> => {
        const response = await fetch(`${API_BASE_URL}/parks/${parkData.park_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parkData),
        }).then(handleResponse);
        return response.park;
    },

    // Delete a park
    deletePark: async (parkId: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/parks/${parkId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }
    },
};

export const trailApi = {
    // Get all trails
    getAllTrails: async (): Promise<Trail[]> => {
        const response = await fetch(`${API_BASE_URL}/trails`)
            .then(handleResponse);
        return response.trails;
    },

    // Get a specific trail
    getTrail: async (trailId: number): Promise<Trail> => {
        const response = await fetch(`${API_BASE_URL}/trails/${trailId}`)
            .then(handleResponse);
        return response.trail;
    },

    // Get trails by park ID
    getTrailsByPark: async (parkId: number): Promise<Trail[]> => {
        const response = await fetch(`${API_BASE_URL}/trails/park/${parkId}`)
            .then(handleResponse);
        return response.trails;
    },

    // Create a new trail
    createTrail: async (trailData: Omit<Trail, 'trail_id'>): Promise<Trail> => {
        const response = await fetch(`${API_BASE_URL}/trails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trailData),
        })
            .then(handleResponse);
        return response.trail;
    },

    // Update a trail
    updateTrail: async (trailData: Trail): Promise<Trail> => {
        const response = await fetch(`${API_BASE_URL}/trails/${trailData.trail_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isOpen: trailData.is_open }),
        }).then(handleResponse);
        return response.trail;
    },

    // Delete a trail
    deleteTrail: async (trailId: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/trails/${trailId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }
    },
};

export const issueApi = {
    // Get all issues
    getAllIssues: async (): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues`)
            .then(handleResponse);
        return response.issues;
    },

    // Get a specific issue
    getIssue: async (issueId: number): Promise<Issue> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}`)
            .then(handleResponse);
        return response.issue;
    },

    // Get issues by park ID
    getIssuesByPark: async (parkId: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/park/${parkId}`)
            .then(handleResponse);
        return response.issues;
    },

    // Get issues by trail ID
    getIssuesByTrail: async (trailId: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/trail/${trailId}`)
            .then(handleResponse);
        return response.issues;
    },

    // Get issues by urgency level
    getIssuesByUrgency: async (urgency: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/urgency/${urgency}`)
            .then(handleResponse);
        return response.issues;
    },

    // Create a new issue
    createIssue: async (issueData: IssueParams): Promise<Issue> => {
        const { image, ...payload } = issueData;
        const response = await fetch(`${API_BASE_URL}/issues`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                image_type: image?.type,
            }),
        })
            .then(handleResponse);

        const { issue, signedUrl } = response;

        if (signedUrl && image) {
            await fetch(signedUrl.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': image.type,
                },
                body: image,
            });
        }
        return issue;
    },

    // Update an issue's status
    updateIssueStatus: async (issueId: number, status: string): Promise<Issue> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        })
            .then(handleResponse);
        return response.issue;
    },

    // Delete an issue
    deleteIssue: async (issueId: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }
    },
};
