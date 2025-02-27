// src/components/parks/ParkForm.tsx
import React, { useState } from 'react';
import { Park } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ImageUpload } from '../ui/ImageUpload';

interface ParkFormProps {
    initialData?: Partial<Park>;
    onSubmit: (data: Omit<Park, 'park_id'>) => Promise<void>;
    isEditing?: boolean;
}

export const ParkForm: React.FC<ParkFormProps> = ({
    initialData = {},
    onSubmit,
    isEditing = false
}) => {
    const [formData, setFormData] = useState<Partial<Park>>({
        name: '',
        county: '',
        is_active: true,
        owner_id: 2, // Default owner - in real app, this might come from auth context
        ...initialData
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleImageChange = (file: File | null, previewUrl: string | null) => {
        // This would be used to store the image file and preview
        // For now, we're just defining the function for the ImageUpload component
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!formData.name || formData.name.trim() === '') {
                throw new Error('Park name is required');
            }

            if (!formData.county || formData.county.trim() === '') {
                throw new Error('County is required');
            }

            //  We would later upload the image to a server here and get back a URL to store with the park
            await onSubmit(formData as Omit<Park, 'park_id'>);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred while saving the park.');
            }
            // eslint-disable-next-line no-console
            console.error('Error submitting park form:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <Alert variant="danger" className="mb-4" onDismiss={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Park Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input
                        label="Park Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <Input
                        label="County"
                        name="county"
                        value={formData.county}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                </div>

                <ImageUpload
                    label="Park Image (Optional)"
                    onChange={handleImageChange}
                    className="mb-6"
                />

                <div className="flex items-center">
                    <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-3 block text-sm text-gray-700">
                        Park is active and open to visitors
                    </label>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                >
                    {isEditing ? 'Update Park' : 'Create Park'}
                </Button>
            </div>
        </form>
    );
};
