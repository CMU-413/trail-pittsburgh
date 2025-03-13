// src/components/issues/IssueReportForm.tsx
import React, { useState, useEffect } from 'react';
import {
    Issue, Park, Trail
} from '../../types';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ImageUpload } from '../ui/ImageUpload';
import { mockApi } from '../../services/mockData';

interface IssueReportFormProps {
    onSubmit: (data: Omit<Issue, 'issue_id'>) => Promise<void>;
    initialParkId?: number;
    initialTrailId?: number;
}

export const IssueReportForm: React.FC<IssueReportFormProps> = ({
    onSubmit,
    initialParkId,
    initialTrailId
}) => {
    const [formData, setFormData] = useState<Partial<Issue> & { reporter_email?: string }>({
        park_id: initialParkId || 0,
        trail_id: initialTrailId || 0,
        is_public: true,
        status: 'open',
        description: '',
        issue_type: '',
        urgency: 3,
        notify_reporter: true,
        reporter_email: '',
        reported_at: new Date().toISOString()
    });

    const [parks, setParks] = useState<Park[]>([]);
    const [trails, setTrails] = useState<Trail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const issueTypes = [
        { value: 'obstruction', label: 'Obstruction (tree down, etc.)' },
        { value: 'erosion', label: 'Trail Erosion' },
        { value: 'flooding', label: 'Flooding' },
        { value: 'signage', label: 'Damaged/Missing Signage' },
        { value: 'vandalism', label: 'Vandalism' },
        { value: 'other', label: 'Other' }
    ];

    // Load parks and trails
    useEffect(() => {
        const fetchParks = async () => {
            try {
                const parksData = await mockApi.getParks();
                setParks(parksData.filter((park) => park.is_active));

                // If we have a park ID, load its trails
                if (formData.park_id) {
                    const trailsData = await mockApi.getTrailsByPark(formData.park_id);
                    setTrails(trailsData.filter((trail) => trail.is_active));
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error loading parks:', err);
                setError('Unable to load parks. Please try again later.');
            }
        };

        fetchParks();
    }, [formData.park_id]);

    // When park changes, update trails
    useEffect(() => {
        const fetchTrails = async () => {
            if (formData.park_id) {
                try {
                    const trailsData = await mockApi.getTrailsByPark(formData.park_id);
                    setTrails(trailsData.filter((trail) => trail.is_active));

                    // If current trail doesn't belong to selected park, reset it
                    if (formData.trail_id) {
                        const trailExists = trailsData.some((t) => t.trail_id === formData.trail_id);
                        if (!trailExists) {
                            setFormData((prev) => ({ ...prev, trail_id: 0 }));
                        }
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('Error loading trails:', err);
                    setError('Unable to load trails. Please try again later.');
                }
            } else {
                setTrails([]);
                setFormData((prev) => ({ ...prev, trail_id: 0 }));
            }
        };

        fetchTrails();
    }, [formData.park_id, formData.trail_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox inputs
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));

            // Clear email error when notify_reporter is unchecked
            if (name === 'notify_reporter' && !checked) {
                setEmailError(null);
            }

            return;
        }

        // Handle number inputs
        if (type === 'number') {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
            return;
        }

        // For email field, validate it
        if (name === 'reporter_email') {
            setEmailError(null);
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: Number(value) || value }));
    };

    const handleUrgencySelect = (level: number) => {
        setFormData((prev) => ({ ...prev, urgency: level }));
    };

    const handleImageChange = (file: File | null, previewUrl: string | null) => {
        // We would later upload the file to a server and get a URL back
        if (previewUrl) {
            // eslint-disable-next-line no-console
            console.log({ file, previewUrl });
            setFormData((prev) => ({ ...prev, issue_image: previewUrl }));
        } else {
            setFormData((prev) => {
                const newData = { ...prev };
                delete newData.issue_image;
                return newData;
            });
        }
    };

    // Validate email format
    const validateEmail = (email: string): boolean => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setEmailError(null);
        setSuccess(false);

        try {
            // Make sure all required fields are present
            if (!formData.park_id) {
                throw new Error('Please select a park.');
            }

            if (!formData.trail_id) {
                throw new Error('Please select a trail.');
            }

            if (!formData.issue_type) {
                throw new Error('Please select an issue type.');
            }

            if (!formData.description || formData.description.trim() === '') {
                throw new Error('Please provide a description of the issue.');
            }

            // Check email if notification is enabled
            if (formData.notify_reporter) {
                if (!formData.reporter_email || formData.reporter_email.trim() === '') {
                    setEmailError('Please provide your email to receive notifications.');
                    throw new Error('Please provide your email to receive notifications.');
                }

                if (!validateEmail(formData.reporter_email)) {
                    setEmailError('Please enter a valid email address.');
                    throw new Error('Please enter a valid email address.');
                }
            }

            // Set the reported date to now
            const dataToSubmit = {
                ...formData,
                reported_at: new Date().toISOString()
            } as Omit<Issue, 'issue_id'>;

            await onSubmit(dataToSubmit);
            setSuccess(true);

            // Reset form
            setFormData({
                park_id: 0,
                trail_id: 0,
                is_public: true,
                status: 'open',
                description: '',
                issue_type: '',
                urgency: 3,
                notify_reporter: true,
                reporter_email: '',
                reported_at: new Date().toISOString()
            });

            // Auto-scroll to top on success
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred while submitting the issue.');
            }
            // eslint-disable-next-line no-console
            console.error('Error submitting issue:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getUrgencyLabel = (level: number) => {
        switch (level) {
        case 1: return 'Very Low';
        case 2: return 'Low';
        case 3: return 'Medium';
        case 4: return 'High';
        case 5: return 'Very High';
        default: return 'Medium';
        }
    };

    const getUrgencyColor = (level: number) => {
        switch (level) {
        case 1: return 'bg-green-100 text-green-800 border-green-200';
        case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
        case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 4: return 'bg-orange-100 text-orange-800 border-orange-200';
        case 5: return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            {error && (
                <Alert variant="danger" className="mb-4" onDismiss={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" className="mb-4" onDismiss={() => setSuccess(false)}>
                    <div className="flex flex-col items-center py-2">
                        <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-green-800">Issue reported successfully!</h3>
                        <p className="text-sm text-green-700 text-center mt-1">
                            Thank you for helping maintain our trails. Your report has been submitted.
                        </p>
                    </div>
                </Alert>
            )}

            {/* Location Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Which park is the issue in?"
                        options={[
                            { value: '', label: 'Select a park' },
                            ...parks.map((park) => ({ value: park.park_id.toString(), label: park.name }))
                        ]}
                        value={formData.park_id?.toString() || ''}
                        onChange={handleSelectChange('park_id')}
                        required
                        fullWidth
                        helperText="Select the park where you found the issue"
                    />

                    <Select
                        label="Which trail is affected?"
                        options={[
                            { value: '', label: formData.park_id ? 'Select a trail' : 'Select a park first' },
                            ...trails.map((trail) => ({ value: trail.trail_id.toString(), label: trail.name }))
                        ]}
                        value={formData.trail_id?.toString() || ''}
                        onChange={handleSelectChange('trail_id')}
                        required
                        fullWidth
                        disabled={!formData.park_id}
                        helperText="Select the specific trail with the issue"
                    />
                </div>
            </div>

            {/* Issue Details Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">Issue Details</h3>
                <div className="space-y-6">
                    <Select
                        label="What type of issue is it?"
                        options={[
                            { value: '', label: 'Select issue type' },
                            ...issueTypes
                        ]}
                        value={formData.issue_type || ''}
                        onChange={handleSelectChange('issue_type')}
                        required
                        fullWidth
                        helperText="Select the category that best describes the issue"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            How urgent is this issue?
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => handleUrgencySelect(level)}
                                    className={`
                                        py-3 px-2 rounded-lg text-center border transition-all
                                        ${formData.urgency === level
                                    ? `${getUrgencyColor(level)} ring-2 ring-offset-1 ring-blue-500 font-medium`
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}
                                    `}
                                >
                                    {getUrgencyLabel(level)}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">Select the urgency level based on safety risk and trail usability impact</p>
                    </div>

                    <TextArea
                        label="Describe the issue and location"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Please provide details about the issue (what you saw, where exactly it is located, etc.)..."
                        required
                        fullWidth
                    />

                    <ImageUpload
                        label="Add a photo (optional)"
                        onChange={handleImageChange}
                        existingImageUrl={formData.issue_image}
                        className="mt-4"
                    />
                </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            id="notify_reporter"
                            name="notify_reporter"
                            type="checkbox"
                            checked={formData.notify_reporter}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notify_reporter" className="ml-3 block text-sm text-gray-700">
                            Notify me when this issue is resolved
                        </label>
                    </div>

                    {/* Email input field that appears when notify_reporter is checked */}
                    {formData.notify_reporter && (
                        <div className="pl-7 mt-3">
                            <Input
                                label="Email Address"
                                name="reporter_email"
                                type="email"
                                value={formData.reporter_email || ''}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                error={emailError || undefined}
                                helperText="We'll send you an update when this issue is resolved"
                                fullWidth
                                leadingIcon={
                                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                }
                            />
                        </div>
                    )}

                    <div className="flex items-center">
                        <input
                            id="is_public"
                            name="is_public"
                            type="checkbox"
                            checked={formData.is_public}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_public" className="ml-3 block text-sm text-gray-700">
                            Make this report public (visible to all users)
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    className="px-10 sm:px-12"
                >
                    Submit Issue Report
                </Button>
            </div>
        </form>
    );
};
