// src/services/api.ts
import { Park } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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

// You can add more API services for trails and issues here
export const trailApi = {
  // Get trails by park ID
  getTrailsByPark: async (parkId: number) => {
    const response = await fetch(`${API_BASE_URL}/trails/park/${parkId}`);
    return handleResponse(response);
  },
  
  // Additional trail API methods...
};

export const issueApi = {
  // Get issues by park ID
  getIssuesByPark: async (parkId: number) => {
    // You might need to implement this endpoint in your backend
    // Or you could filter issues by parkId on the client side
    const response = await fetch(`${API_BASE_URL}/issues?parkId=${parkId}`);
    return handleResponse(response);
  },
  
  // Additional issue API methods...
};