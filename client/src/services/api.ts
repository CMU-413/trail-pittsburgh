import {
    Park, Trail, Issue, IssueParams
} from '../types';

const API_BASE_URL = `${import.meta.env.VITE_API_URL  }/api`;

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }
    return response.json();
};

export const parkApi = {
    getParks: async (): Promise<Park[]> => {
        const response = await fetch(`${API_BASE_URL}/parks`, {
            credentials: 'include'
        }).then(handleResponse);
        return response.parks;
    },

    getPark: async (parkId: number): Promise<Park> => {
        const response = await fetch(`${API_BASE_URL}/parks/${parkId}`, {
            credentials: 'include'
        })
            .then(handleResponse);
        return response.park;
    },

    createPark: async (parkData: Omit<Park, 'parkId'>): Promise<Park> => {
        const response = await fetch(`${API_BASE_URL}/parks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parkData),
            credentials: 'include'
        })
            .then(handleResponse);
        return response.park;
    },

    updatePark: async (parkData: Park): Promise<Park> => {
        const response = await fetch(`${API_BASE_URL}/parks/${parkData.parkId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parkData),
            credentials: 'include'
        }).then(handleResponse);
        return response.park;
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
        })
            .then(handleResponse);
        return response.trails;
    },

    getTrail: async (trailId: number): Promise<Trail> => {
        const response = await fetch(`${API_BASE_URL}/trails/${trailId}`, {
            credentials: 'include'
        })
            .then(handleResponse);
        return response.trail;
    },

    getTrailsByPark: async (parkId: number): Promise<Trail[]> => {
        const response = await fetch(`${API_BASE_URL}/trails/park/${parkId}`, {
            credentials: 'include'
        }).then(handleResponse);
        return response.trails;
    },

    createTrail: async (trailData: Omit<Trail, 'trailId'>): Promise<Trail> => {
        const response = await fetch(`${API_BASE_URL}/trails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trailData),
            credentials: 'include'
        })
            .then(handleResponse);
        return response.trail;
    },

    updateTrail: async (trailData: Trail): Promise<Trail> => {
        const response = await fetch(`${API_BASE_URL}/trails/${trailData.trailId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isOpen: trailData.isOpen }),
            credentials: 'include'
        }).then(handleResponse);
        return response.trail;
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
        })
            .then(handleResponse);
        return response.issues;
    },

    getIssue: async (issueId: number): Promise<Issue> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
            credentials: 'include'
        })
            .then(handleResponse);
        return response.issue;
    },

    getIssuesByPark: async (parkId: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/park/${parkId}`, {
            credentials: 'include'
        })
            .then(handleResponse);
        return response.issues;
    },

    getIssuesByTrail: async (trailId: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/trail/${trailId}`, {
            credentials: 'include'
        })
            .then(handleResponse);
        return response.issues;
    },

    getIssuesByUrgency: async (urgency: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/urgency/${urgency}`);
        return handleResponse(response);
    },

    createIssue: async (issueData: IssueParams): Promise<Issue> => {
        const { image, ...payload } = issueData;
        const response = await fetch(`${API_BASE_URL}/issues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...payload,
                image_type: image?.type,
            }),
            credentials: 'include'
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

    updateIssueStatus: async (issueId: number, status: string): Promise<Issue> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
            credentials: 'include'
        })
            .then(handleResponse);
        return response.issue;
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
