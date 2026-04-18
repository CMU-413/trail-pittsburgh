import {
    Park, Issue, IssueParams, IssueStatusEnum,
    IssueTypeEnum,
    IssueRiskEnum,
    UserRoleEnum,
    User,
    IssuePin
} from '../types';

const API_BASE_URL = `/api`;

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }
    return response.json();
};

export const parkApi = {
    getAllParks: async (): Promise<Park[]> => {
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

export const issueApi = {

    getAllIssues: async (filters?: { reporterEmail?: string; ownerEmail?: string }): Promise<Issue[]> => {
<<<<<<< HEAD
        const url = new URL(`${API_BASE_URL}/issues`, window.location.origin);
=======
        const url = new URL(`${API_BASE_URL}/issues`);
>>>>>>> origin/develop

        // Add any provided filters as query params
        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value) {
                url.searchParams.append(key, value);
            }
        });

        const response = await fetch(url.toString(), { 
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

    getMapPins: async (
        minLat: number,
        minLng: number,
        maxLat: number,
        maxLng: number,
        types: IssueTypeEnum[] = []
    ): Promise<IssuePin[]> => {
        const bbox = `${minLat},${minLng},${maxLat},${maxLng}`;
        const params = new URLSearchParams({ bbox });

        for (const t of types) {
            params.append('issueTypes', t);
        }

<<<<<<< HEAD
        params.append('statuses', IssueStatusEnum.UNRESOLVED);
=======
        params.append('statuses', IssueStatusEnum.OPEN);
>>>>>>> origin/develop
        params.append('statuses', IssueStatusEnum.IN_PROGRESS);

        const response = await fetch(`${API_BASE_URL}/issues/map?${params.toString()}`, {
            credentials: 'include'
        }).then(handleResponse);

        return Array.isArray(response?.pins) ? response.pins : [];
    },

    createIssue: async (issueData: IssueParams): Promise<string | undefined> => {
        const { image, imageMetadata, ...payload } = issueData;

        let headers =  undefined;

        if (imageMetadata) {
            const { DateTimeOriginal, latitude, longitude } = imageMetadata;
            if (DateTimeOriginal && latitude && longitude) {
                const date = DateTimeOriginal as unknown as Date;

                headers = {
                    'x-goog-meta-capturedAt': date.toISOString(),
                    'x-goog-meta-latitude': latitude.toString(),
                    'x-goog-meta-longitude': longitude.toString(),
                };
            }
        }

        const response = await fetch(`${API_BASE_URL}/issues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...payload,
                imageMetadata: image ? {
                    contentType: image.type,
                    headers,
                } : undefined,
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            return 'Failed to create issue';
        }

        const { signedUrl } = await response.json();

        if (signedUrl && image) {
            const response = await fetch(signedUrl.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': image.type,
                    ...headers
                },
                body: image,
            });

            if (!response.ok) {
                return 'Issue created but failed to upload image';
            }
        }
        return undefined;

    },

    updateIssueStatus: async (issueId: number, status: IssueStatusEnum): Promise<Issue> => {
        // Create the request body with status
        const requestBody = JSON.stringify({ status });
        
        try {
            const response = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: requestBody,
                credentials: 'include'
            });
            
            if (!response.ok) {
                let errorMessage = `Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.debug('Operation failed but can be ignored:', error);
                }

                // eslint-disable-next-line no-console
                console.error('API error:', errorMessage);
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            
            return data.issue;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Exception in updateIssueStatus:', error);
            throw error;
        }
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

    updateIssue: async (issueId: number, data: {
        description?: string;
        safetyRisk?: IssueRiskEnum;
        issueType?: IssueTypeEnum;
        isImagePublic?: boolean;
        parkId?: number;
        latitude?: number;
        longitude?: number;
    }): Promise<Issue> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        }).then(handleResponse);
        
        return response.issue;
    },

    getGroupedIssues: async (issueId: number): Promise<Issue[]> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}/grouped`, {
            credentials: 'include'
        }).then(handleResponse);

        return response.issues;
    },

    setIssueGroup: async (issueId: number, issueGroupMemberIds: number[]): Promise<Issue> => {
        const response = await fetch(`${API_BASE_URL}/issues/${issueId}/group`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issueGroupMemberIds }),
            credentials: 'include'
        }).then(handleResponse);

        return response.issue;
    },
};

export const userApi = {
    getUsers: async (): Promise<User[]> => {
        const response = await fetch(`/api/users`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    },

    updateUserRole: async (userId: string, role: UserRoleEnum): Promise<void> => {
        const response = await fetch(`/api/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ role }),
        });
        if (!response.ok) {
            throw new Error('Failed to update user role');
        }
    },

    getUserRole: async (userId: number): Promise<UserRoleEnum> => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
            credentials: 'include'
        }).then(handleResponse);
        return response.role;
    },
};
