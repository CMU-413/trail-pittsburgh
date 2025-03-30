// src/services/api.ts
import { Park, Trail, Issue } from '../types';

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
    const response = await fetch(`${API_BASE_URL}/parks`);
    return handleResponse(response);
  },

  // Get a specific park by ID
  getPark: async (parkId: number): Promise<Park> => {
    const response = await fetch(`${API_BASE_URL}/parks/${parkId}`);
    return handleResponse(response);
  },

  // Create a new park
  createPark: async (parkData: Omit<Park, 'park_id'>): Promise<Park> => {
    const response = await fetch(`${API_BASE_URL}/parks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parkData),
    });
    return handleResponse(response);
  },

  // Update an existing park
  updatePark: async (parkData: Park): Promise<Park> => {
    const response = await fetch(`${API_BASE_URL}/parks/${parkData.park_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parkData),
    });
    return handleResponse(response);
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
    const response = await fetch(`${API_BASE_URL}/trails`);
    return handleResponse(response);
  },

  // Get a specific trail
  getTrail: async (trailId: number): Promise<Trail> => {
    const response = await fetch(`${API_BASE_URL}/trails/${trailId}`);
    return handleResponse(response);
  },
  
  // Get trails by park ID
  getTrailsByPark: async (parkId: number): Promise<Trail[]> => {
    const response = await fetch(`${API_BASE_URL}/parks/${parkId}/trails`);
    return handleResponse(response);
  },

  // Create a new trail
  createTrail: async (trailData: Omit<Trail, 'trail_id'>): Promise<Trail> => {
    const response = await fetch(`${API_BASE_URL}/trails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trailData),
    });
    return handleResponse(response);
  },

  // Update a trail
  updateTrail: async (trailData: Trail): Promise<Trail> => {
    const response = await fetch(`${API_BASE_URL}/trails/${trailData.trail_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_open: trailData.is_open }),
    });
    return handleResponse(response);
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

// export const issueApi = {
//   // Get issues by park ID
//   getIssuesByPark: async (parkId: number) => {
//     // Todo: will need to implement this endpoint on backend
//     // Or filter issues by parkId on the client side
//     const response = await fetch(`${API_BASE_URL}/issues?parkId=${parkId}`);
//     return handleResponse(response);
//   },
  
// };

export const issueApi = {
  // Get all issues
  getAllIssues: async (): Promise<Issue[]> => {
    const response = await fetch(`${API_BASE_URL}/issues`);
    return handleResponse(response);
  },

  // Get a specific issue
  getIssue: async (issueId: number): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}`);
    return handleResponse(response);
  },

  // Get issues by park ID
  getIssuesByPark: async (parkId: number): Promise<Issue[]> => {
    const response = await fetch(`${API_BASE_URL}/issues/park/${parkId}`);
    return handleResponse(response);
  },

  // Get issues by trail ID
  getIssuesByTrail: async (trailId: number): Promise<Issue[]> => {
    const response = await fetch(`${API_BASE_URL}/issues/trail/${trailId}`);
    return handleResponse(response);
  },

  // Get issues by urgency level
  getIssuesByUrgency: async (urgency: number): Promise<Issue[]> => {
    const response = await fetch(`${API_BASE_URL}/issues/urgency/${urgency}`);
    return handleResponse(response);
  },

  // Create a new issue
  createIssue: async (issueData: Omit<Issue, 'issue_id'>): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    });
    return handleResponse(response);
  },

  // Update an issue's status
  updateIssueStatus: async (issueId: number, status: string): Promise<Issue> => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
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