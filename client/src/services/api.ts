// src/services/api.ts
import { Park, Trail } from '../types';

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
  updateTrail: async (trailId: number, isOpen: boolean): Promise<Trail> => {
    const response = await fetch(`${API_BASE_URL}/trails/${trailId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_open: isOpen }),
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

export const issueApi = {
  // Get issues by park ID
  getIssuesByPark: async (parkId: number) => {
    // Todo: will need to implement this endpoint on backend
    // Or filter issues by parkId on the client side
    const response = await fetch(`${API_BASE_URL}/issues?parkId=${parkId}`);
    return handleResponse(response);
  },
  
};