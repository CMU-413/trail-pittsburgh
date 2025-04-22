// src/components/issues/IssueReportForm.tsx

import React, { useState, useEffect } from 'react';
import {
    Park, Trail, ImageMetadata, IssueParams
} from '../../types';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ImageUpload } from '../ui/ImageUpload';
import Location from '../ui/Location';
import { 
    parkApi, trailApi 
} from '../../services/api';

interface IssueReportFormProps {
    onSubmit: (data: IssueParams) => Promise<void>; // Fixed: replaced 'any' with 'ImageMetadata'
    initialParkId?: number;
    initialTrailId?: number;
}

export const IssueReportForm: React.FC<IssueReportFormProps> = ({
    onSubmit,
    initialParkId,
    initialTrailId
}) => {
    const [formData, setFormData] = useState<Partial<IssueParams>>({
        parkId: initialParkId || 0,
        trailId: initialTrailId || 0,
        isPublic: true,
        status: 'open',
        description: '',
        issueType: '',
        urgency: 3,
        notifyReporter: false,
        reporterEmail: '',
        createdAt: new Date().toISOString(),
        longitude: undefined,
        latitude: undefined,
        imageMetadata: undefined
    });

    const [imgPreview, setImgPreview] = useState<string>();
    const [parks, setParks] = useState<Park[]>([]);
    const [trails, setTrails] = useState<Trail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [locationProvided, setLocationProvided] = useState(false);

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
                const parksData = await parkApi.getParks();
                setParks(parksData.filter((park) => park.isActive));

                // If we have a park ID, load its trails
                if (formData.parkId) {
                    const trailsData = await trailApi.getTrailsByPark(formData.parkId);
                    setTrails(trailsData.filter((trail) => trail.isActive));
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error loading parks:', err);
                setError('Unable to load parks. Please try again later.');
            }
        };

        fetchParks();
    }, [formData.parkId]);

    // When park changes, update trails
    useEffect(() => {
        const fetchTrails = async () => {
            if (formData.parkId) {
                try {
                    const trailsData = await trailApi.getTrailsByPark(formData.parkId);
                    setTrails(trailsData.filter((trail) => trail.isActive));

                    // If current trail doesn't belong to selected park, reset it
                    if (formData.trailId) {
                        const trailExists = trailsData.some((t) => t.trailId === formData.trailId);
                        if (!trailExists) {
                            setFormData((prev) => ({ ...prev, trailId: 0 }));
                        }
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('Error loading trails:', err);
                    setError('Unable to load trails. Please try again later.');
                }
            } else {
                setTrails([]);
                setFormData((prev) => ({ ...prev, trailId: 0 }));
            }
        };

        fetchTrails();
    }, [formData.parkId, formData.trailId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox inputs
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));

            // Clear email error when notifyReporter is unchecked
            if (name === 'notifyReporter' && !checked) {
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
        if (name === 'reporterEmail') {
            setEmailError(null);
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: Number(value) || value }));
    };

    const handleIssueTypeSelect = (type: string) => {
        setFormData((prev) => ({ ...prev, issueType: type }));
    };

    const handleUrgencySelect = (level: number) => {
        setFormData((prev) => ({ ...prev, urgency: level }));
    };
    
    const handleImageChange = (file: File | null, previewUrl: string | null, metadata?: ImageMetadata) => {

        if (previewUrl) {
            setImgPreview(previewUrl);
        }

        if (file) {
            setFormData((prev) => {
                const newData = {
                    ...prev,
                    image: file,
                    imageMetadata: metadata || {}
                };
                return newData;
            });
        } else {
            setFormData((prev) => {
                const newData = { ...prev };
                delete newData.image;
                delete newData.imageMetadata;
                return newData;
            });
        }
    };

    // Handle location selection
    const handleLocationSelected = (latitude: number, longitude: number) => {
        setFormData((prev) => ({
            ...prev,
            latitude,
            longitude
        }));
        setLocationProvided(true);
    };

    // Get issue type icon
    const getIssueTypeIcon = (type: string) => {
        switch (type) {
        case 'obstruction':
            return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
        case 'erosion':
            return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            );
        case 'flooding':
            return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
            );
        case 'signage':
            return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
        case 'vandalism':
            return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            );
        case 'other':
        default:
            return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
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
            if (!formData.parkId) {
                throw new Error('Please select a park.');
            }

            if (!formData.trailId) {
                throw new Error('Please select a trail.');
            }

            if (!formData.issueType) {
                throw new Error('Please select an issue type.');
            }

            if (!formData.description || formData.description.trim() === '') {
                throw new Error('Please provide a description of the issue.');
            }

            // Check email if notification is enabled
            if (formData.notifyReporter) {
                if (!formData.reporterEmail || formData.reporterEmail.trim() === '') {
                    setEmailError('Please provide your email to receive notifications.');
                    throw new Error('Please provide your email to receive notifications.');
                }

                if (!validateEmail(formData.reporterEmail)) {
                    setEmailError('Please enter a valid email address.');
                    throw new Error('Please enter a valid email address.');
                }
            }

            // Set the reported date to now
            const dataToSubmit = {
                ...formData,
                reported_at: new Date().toISOString()
            } as IssueParams;

            await onSubmit(dataToSubmit);
            setSuccess(true);

            // Reset form
            setFormData({
                parkId: 0,
                trailId: 0,
                isPublic: true,
                status: 'open',
                description: '',
                issueType: '',
                urgency: 3,
                notifyReporter: false,
                reporterEmail: '',
                createdAt: new Date().toISOString(),
                longitude: undefined,
                latitude: undefined
            });
            setLocationProvided(false);

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
        case 1: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
        case 3: return 'bg-amber-100 text-amber-800 border-amber-200';
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
                            ...parks.map((park) => ({ value: park.parkId.toString(), label: park.name }))
                        ]}
                        value={formData.parkId?.toString() || ''}
                        onChange={handleSelectChange('parkId')}
                        required
                        fullWidth
                        helperText="Select the park where you found the issue"
                    />

                    <Select
                        label="Which trail is affected?"
                        options={[
                            { value: '', label: formData.parkId ? 'Select a trail' : 'Select a park first' },
                            ...trails.map((trail) => ({ value: trail.trailId.toString(), label: trail.name }))
                        ]}
                        value={formData.trailId?.toString() || ''}
                        onChange={handleSelectChange('trailId')}
                        required
                        fullWidth
                        disabled={!formData.parkId}
                        helperText="Select the specific trail with the issue"
                    />
                </div>
            </div>

            {/* Issue Details Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">Issue Details</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            What type of issue is it?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {issueTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleIssueTypeSelect(type.value)}
                                    className={`
                                        flex items-center p-4 rounded-lg border transition-all hover:bg-gray-50 cursor-pointer
                                        ${formData.issueType === type.value
                                    ? 'border-blue-600 bg-blue-50 ring-2 ring-offset-2 ring-blue-500'
                                    : 'border-gray-200'
                                }
                                    `}
                                >
                                    <div className={`p-2 rounded-full mr-3 ${formData.issueType === type.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {getIssueTypeIcon(type.value)}
                                    </div>
                                    <span className="font-medium text-sm">{type.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">Select the category that best describes the issue</p>
                    </div>

                    {/* Urgency selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            How urgent is this issue?
                        </label>
                        {/* For large screens: all options in one row */}
                        <div className="hidden md:grid md:grid-cols-5 gap-3">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => handleUrgencySelect(level)}
                                    className={`
                                        p-3 rounded-lg text-center border transition-all cursor-pointer
                                        ${formData.urgency === level
                                    ? `${getUrgencyColor(level)} ring-2 ring-offset-2 ring-blue-500 font-medium`
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }
                                    `}
                                >
                                    <div className="text-sm font-medium">{getUrgencyLabel(level)}</div>
                                </button>
                            ))}
                        </div>

                        {/* For mobile: options stacked one per row */}
                        <div className="grid grid-cols-1 gap-3 md:hidden">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => handleUrgencySelect(level)}
                                    className={`
                                        p-3 rounded-lg text-center border transition-all flex justify-between items-center cursor-pointer
                                        ${formData.urgency === level
                                    ? `${getUrgencyColor(level)} ring-2 ring-offset-2 ring-blue-500 font-medium`
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }
                                    `}
                                >
                                    <div className="text-sm font-medium">{getUrgencyLabel(level)}</div>
                                    {formData.urgency === level && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
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
                        existingImageUrl={imgPreview}
                        existingMetadata={formData.imageMetadata}
                        className="mt-4"
                        acceptedFormats="image/jpeg,image/png,image/gif,image/heic,image/heif"
                    />
                </div>
            </div>

            {/* Location Picker Section */}
            <Location
                onLocationSelected={handleLocationSelected}
                initialLat={formData.latitude}
                initialLon={formData.longitude}
            />
            {locationProvided}

            {/* Preferences Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            id="notifyReporter"
                            name="notifyReporter"
                            type="checkbox"
                            checked={formData.notifyReporter}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifyReporter" className="ml-3 block text-sm text-gray-700">
                            Notify me when this issue is resolved
                        </label>
                    </div>

                    {/* Email input field that appears when notifyReporter is checked */}
                    {formData.notifyReporter && (
                        <div className="pl-7 mt-3">
                            <Input
                                label="Email Address"
                                name="reporterEmail"
                                type="email"
                                value={formData.reporterEmail || ''}
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
