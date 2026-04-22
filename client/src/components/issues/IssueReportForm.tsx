// src/components/issues/IssueReportForm.tsx

import React, { useState, useEffect } from 'react';
import {
    Park, ImageMetadata, IssueParams, IssueStatusEnum, IssueTypeEnum, IssueRiskEnum
} from '../../types';
import { getSafetyRiskLabel } from '../../utils/issueSafetyRiskUtils';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ImageUpload } from '../ui/ImageUpload';
import Location from '../ui/Location';
import { TextArea } from '../ui/TextArea';
import { parkApi } from '../../services/api';
import { getParkByLatLng } from '../../utils/parkUtils';
import { Select } from '../ui/Select';
import { useAuth } from '../../providers/AuthProvider';

interface IssueReportFormProps {
    onSubmit: (data: IssueParams) => Promise<void>;
}

export const IssueReportForm: React.FC<IssueReportFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<Partial<IssueParams>>({
        isPublic: true,
        status: IssueStatusEnum.UNRESOLVED,
        description: '',
        issueType: IssueTypeEnum.OBSTRUCTION,
        safetyRisk: IssueRiskEnum.NO_RISK,
        passible: true,
        notifyReporter: false,
        reporterEmail: '',
        ownerEmail: undefined,
        createdAt: new Date().toISOString(),
        longitude: undefined,
        latitude: undefined,
        imageMetadata: undefined
    });

    const { user } = useAuth();
    const [imgPreview, setImgPreview] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [locationProvided, setLocationProvided] = useState(false);
    const [locationProvidedByImage, setLocationProvidedByImage] = useState(false);
    const [parks, setParks] = useState<Park[]>([]);
    const [atIssueLocation, setAtIssueLocation] = useState(false);
    const [locationConfirmed, setLocationConfirmed] = useState<boolean | null>(null);

    const issueTypes = [
        { value: IssueTypeEnum.OBSTRUCTION, label: 'Obstruction (tree down, etc.)' },
        { value: IssueTypeEnum.WATER, label: 'Standing Water/Mud' },
        { value: IssueTypeEnum.OTHER, label: 'Other' }
    ];
    const safetyRiskLevels = [
        IssueRiskEnum.NO_RISK,
        IssueRiskEnum.MINOR_RISK,
        IssueRiskEnum.SERIOUS_RISK,
    ];

    useEffect(() => {
        const fetchParks = async () => {
            try {
                const parksData = await parkApi.getAllParks();
                setParks(parksData.filter((park) => park.isActive));
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error loading parks:', err);
                setError('Unable to load parks. Please try again later.');
            }
        };

        fetchParks();
    }, []);

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: Number(value) || value }));
    };

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

    const handleIssueTypeSelect = (type: IssueTypeEnum) => {
        setFormData((prev) => ({ ...prev, issueType: type }));
    };

    const handleSafetyRiskSelect = (level: IssueRiskEnum) => {
        setFormData((prev) => ({ ...prev, safetyRisk: level }));
    };

    const handlePassibleSelect = (level: boolean) => {
        setFormData((prev) => ({ ...prev, passible: level }));
    };
    
    const handleImageChange = async (file: File | null, previewUrl: string | null, metadata?: ImageMetadata) => {
        if (previewUrl) {
            setImgPreview(previewUrl);
        }

        if (file) {
            const lat = metadata?.latitude ?? metadata?.Latitude;
            const lng = metadata?.longitude ?? metadata?.Longitude;

            let parkId: number | undefined;

            if (typeof lat === 'number' && typeof lng === 'number') {
                setLocationProvidedByImage(true);
                // Set ParkId
                const park = await getParkByLatLng(lat, lng);
                if (park !== null) {
                    const parkInfo = parks.find((p) => (p.name === park.name));
                    if (parkInfo) {
                        parkId = parkInfo.parkId;
                        setLocationProvided(true);
                    } 
                }
            }
            setFormData((prev) => ({
                ...prev,
                image: file,
                imageMetadata: metadata || {},
                latitude: (typeof lat === 'number' ? lat : prev.latitude),
                longitude: (typeof lng === 'number' ? lng : prev.longitude),
                parkId: parkId ?? prev.parkId,
            }));
        } else {
            setLocationConfirmed(null);
            setAtIssueLocation(false);
            setFormData((prev) => {
                const newData = { ...prev, latitude: undefined, longitude: undefined };
                delete newData.image;
                delete newData.parkId;
                delete newData.imageMetadata;
                return newData;
            });
        }
    };

    // Handle location selection
    const handleLocationSelected = async (latitude: number, longitude: number) => {
        let parkId: number | undefined;

        if (typeof latitude === 'number' && typeof longitude === 'number') {
            const park = await getParkByLatLng(latitude, longitude);
            if (park !== null) {
                const parkInfo = parks.find((p) => (p.name === park.name));
                if (parkInfo) {
                    parkId = parkInfo.parkId;
           			setLocationProvided(true);
                } 
            }
        }

        setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            ...(parkId !== undefined ? { parkId } : {}),
        }));
    };

    const mapStringToBool = (option: string) => {
        if (option === 'Yes') {
            return true;
        } else {
            return false;
        }
    };

    // Get issue type icon
    const getIssueTypeIcon = (type: IssueTypeEnum) => {
        switch (type) {
        case IssueTypeEnum.OBSTRUCTION:
            return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
        case IssueTypeEnum.WATER:
            return (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0M3 19c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
                </svg>
            );
        case IssueTypeEnum.OTHER:
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

            if (!formData.issueType) {
                throw new Error('Please select an issue type.');
            }

            if (!formData.safetyRisk) {
                throw new Error('Please select a safety risk level.');
            }

            if (typeof formData.passible !== 'boolean') {
                throw new Error('Please indicate whether the trail is passible.');
            }

            const hasPhoto = Boolean(formData.imageMetadata);
            const hasLocation = typeof formData.latitude === 'number' && typeof formData.longitude === 'number';
            const hasPark = Boolean(formData.parkId);

            if (!hasPhoto && !hasLocation && !hasPark) {
                throw new Error('When no photo is uploaded, provide either a location or select a park.');
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
                reporterEmail: formData.notifyReporter ? formData.reporterEmail : undefined,
                ownerEmail: user?.email || undefined,
                reported_at: new Date().toISOString()
            } as IssueParams;

            await onSubmit(dataToSubmit);
            setSuccess(true);

            // Reset form
            setFormData({
                isPublic: true,
                status: IssueStatusEnum.UNRESOLVED,
                // description: '',
                issueType: IssueTypeEnum.OTHER,
                safetyRisk: IssueRiskEnum.NO_RISK,
                notifyReporter: false,
                passible: true,
                reporterEmail: '',
                createdAt: new Date().toISOString(),
                longitude: undefined,
                latitude: undefined
            });
            setLocationProvided(false);
            setLocationProvidedByImage(false);
            setLocationConfirmed(null);

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

            {/* Image Upload Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-6">
                    <ImageUpload
                        label="Add a photo (Optional)"
                        description='By uploading a photo, you agree to share its embedded GPS location data so we can identify the issue’s location.'
                        onChange={handleImageChange}
                        existingImageUrl={imgPreview}
                        existingMetadata={formData.imageMetadata}
                        acceptedFormats="image/jpeg,image/png,image/gif,image/heic,image/heif"
                    />
                    {!formData.imageMetadata && (
                        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                            Adding a photo helps stewards triage faster.
                        </p>
                    )}
                </div>
            </div>

            {/* Check If Action Issue Location Section */}
            {!formData.latitude && !formData.longitude && formData.imageMetadata !== undefined &&
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                There is no location information from the image.
                            </label>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Are you currently at the location of the issue to provide location of the issue and willing to share your location?  
                            </label>
                            {/* For large screens: all options in one row */}
                            <div className="hidden md:grid md:grid-cols-2 gap-3">
                                {['Yes', 'No'].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setAtIssueLocation(mapStringToBool(option))}
                                        className={`
                                            flex items-center p-4 rounded-lg border transition-all hover:bg-gray-50 cursor-pointer
                                            ${atIssueLocation === mapStringToBool(option)
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200'
                                    }
                                        `}
                                    >
                                        <div className="text-sm font-medium">{option}</div>
                                    </button>
                                ))}
                            </div>

                            {/* For mobile: options stacked one per row */}
                            <div className="grid grid-cols-1 gap-3 md:hidden">
                                {['Yes', 'No'].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setAtIssueLocation(mapStringToBool(option))}
                                        className={`
                                            flex items-center p-4 rounded-lg border transition-all hover:bg-gray-50 cursor-pointer
                                            ${atIssueLocation === mapStringToBool(option)
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200'
                                    }
                                        `}
                                    >
                                        <div className="text-sm font-medium">{option}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
            
            {/* Location Picker Section */}
            {((formData.latitude && formData.longitude) ||  atIssueLocation) && 
                <Location
                    key={`location-${locationConfirmed}-${formData.latitude}-${formData.longitude}`}
                    onLocationSelected={handleLocationSelected}
                    initialLat={formData.latitude}
                    initialLon={formData.longitude}
                    readOnly={!(locationConfirmed === false || (atIssueLocation && locationConfirmed !== true))}
                    subText={
                        (locationProvidedByImage && ((locationConfirmed === null) || locationConfirmed))
                            ? 'This location was automatically extracted from the image you uploaded. Your location data will only be used for this issue report.'
                            : 'Providing the exact location helps us find and fix the issue more quickly. Your location data will only be used for this issue report.'
                    }
                />
            }

            {formData.latitude && formData.longitude && (
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Is this the correct location of the issue?
                    </label>

                    {/* For large screens: all options in one row */}
                    <div className="hidden md:grid md:grid-cols-2 gap-3">
                        {['Yes', 'No'].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setLocationConfirmed(mapStringToBool(option))}
                                className={`
                                    flex items-center p-4 rounded-lg border transition-all hover:bg-gray-50 cursor-pointer
                                    ${locationConfirmed === mapStringToBool(option)
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200'
                            }
                                `}
                            >
                                <div className="text-sm font-medium">{option}</div>
                            </button>
                        ))}
                    </div>

                    {/* For mobile: options stacked one per row */}
                    <div className="grid grid-cols-1 gap-3 md:hidden">
                        {['Yes', 'No'].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setLocationConfirmed(mapStringToBool(option))}
                                className={`
                                    flex items-center p-4 rounded-lg border transition-all hover:bg-gray-50 cursor-pointer
                                    ${locationConfirmed === mapStringToBool(option)
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200'
                            }
                                `}
                            >
                                <div className="text-sm font-medium">{option}</div>
                            </button>
                        ))}
                    </div>
                    {locationConfirmed === false && (
                        <p className="text-xs text-gray-500 mt-1">
                            Please go back up to issue location and either update your location or drag the pin to the correct issue location;
                        </p>
                    )}
                </div>
            )}

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
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
                    helperText={
                        locationProvided
                            ? 'Based on the information you provided, we automatically detected this park. If this looks incorrect, feel free to update it.'
                            : 'We weren’t able to detect the park from the information provided. Please select the park where you found the issue.'
                    }
                />
            </div>

            {/* Issue Type Selection */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
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
                                    ? 'border-blue-600 bg-blue-50'
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
                </div>
            </div>

            {/* Safety Risk Selection */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Safety Risk?
                        </label>
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                            {safetyRiskLevels.map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => handleSafetyRiskSelect(level)}
                                    className={`
                                        rounded-lg border p-4 text-left transition-all hover:bg-gray-50 cursor-pointer
                                        ${formData.safetyRisk === level
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200'
                                }
                                    `}
                                >
                                    <div className="text-sm font-medium">{getSafetyRiskLabel(level)}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Passible Selection */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Is it passible?
                        </label>
                        {/* For large screens: all options in one row */}
                        <div className="hidden md:grid md:grid-cols-2 gap-3">
                            {['Yes', 'No'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handlePassibleSelect(mapStringToBool(option))}
                                    className={`
                                        flex items-center p-4 rounded-lg border transition-all hover:bg-gray-50 cursor-pointer
                                        ${formData.passible === mapStringToBool(option)
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200'
                                }
                                    `}
                                >
                                    <div className="text-sm font-medium">{option}</div>
                                </button>
                            ))}
                        </div>

                        {/* For mobile: options stacked one per row */}
                        <div className="grid grid-cols-1 gap-3 md:hidden">
                            {['Yes', 'No'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handlePassibleSelect(mapStringToBool(option))}
                                    className={`
                                        flex items-center p-4 rounded-lg border transition-all hover:bg-gray-50 cursor-pointer
                                        ${formData.passible === mapStringToBool(option)
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200'
                                }
                                    `}
                                >
                                    <div className="text-sm font-medium">{option}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <TextArea
                    label="Additional Comments (Optional)"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Provide any additional details about this issue (what you saw, where exactly it is located, etc)"
                    fullWidth
                />
            </div>

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
                            Opt-in for email notification on status updates regarding this issue
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
                                helperText="We'll send you an update when on status changes on this issue"
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
                    size="lg"
                    isLoading={isLoading}
                    className="px-14 py-4 text-lg"
                >
                    Submit Issue Report
                </Button>
            </div>
        </form>
    );
};
