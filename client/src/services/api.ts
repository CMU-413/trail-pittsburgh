import { Park, Trail, Issue } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }
    return response.json();
};

export const parkApi = {
    getParks: async (): Promise<{ data: Park[] }> => {
        const response = await fetch(`${API_BASE_URL}/parks`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    getPark: async (parkId: number): Promise<Park> => {
        const response = await fetch(`${API_BASE_URL}/parks/${parkId}`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    createPark: async (parkData: Omit<Park, 'park_id'>): Promise<Park> => {
        const response = await fetch(`${API_BASE_URL}/parks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parkData),
            credentials: 'include'
        });
        return handleResponse(response);
    },

    updatePark: async (parkData: Park): Promise<Park> => {
        const response = await fetch(`${API_BASE_URL}/parks/${parkData.park_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parkData),
            credentials: 'include'
        });
        return handleResponse(response);
    },

    deletePark: async (parkId: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/parks/${parkId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }
    },
};

export const trailApi = {
    getAllTrails: async (): Promise<Trail[]> => {
        const response = await fetch(`${API_BASE_URL}/trails`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    getTrail: async (trailId: number): Promise<Trail> => {
        const response = await fetch(`${API_BASE_URL}/trails/${trailId}`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    getTrailsByPark: async (parkId: number): Promise<Trail[]> => {
        const response = await fetch(`${API_BASE_URL}/trails/${parkId}/trails`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    createTrail: async (trailData: Omit<Trail, 'trail_id'>): Promise<Trail> => {
        const response = await fetch(`${API_BASE_URL}/trails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trailData),
            credentials: 'include'
        });
        return handleResponse(response);
    },

    updateTrail: async (trailData: Trail): Promise<Trail> => {
        const response = await fetch(`${API_BASE_URL}/trails/${trailData.trail_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_open: trailData.is_open }),
            credentials: 'include'
        });
        return handleResponse(response);
    },

    deleteTrail: async (trailId: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/trails/${trailId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }
    },
};

export const issueApi = {
    getAllIssues: async (): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    getIssue: async (issueId: number): Promise<Issue> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    getIssuesByPark: async (parkId: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/park/${parkId}`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    getIssuesByTrail: async (trailId: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/trail/${trailId}`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    getIssuesByUrgency: async (urgency: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/urgency/${urgency}`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    createIssue: async (issueData: Omit<Issue, 'issue_id'>): Promise<Issue> => {
        const response = await fetch(`${API_BASE_URL}/issues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueData),
            credentials: 'include'
        });
        return handleResponse(response);
    },

    updateIssueStatus: async (issueId: number, status: string): Promise<Issue> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
            credentials: 'include'
        });
        return handleResponse(response);
    },

    deleteIssue: async (issueId: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }
    },
};
