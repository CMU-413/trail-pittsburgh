// src/components/trails/TrailForm.tsx
import React, { useState } from 'react';
import { Trail } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ImageUpload } from '../ui/ImageUpload';
import { TextArea } from '../ui/TextArea';

interface TrailFormProps {
    parkId: number;
    initialData?: Partial<Trail>;
    onSubmit: (data: Omit<Trail, 'trailId'>) => Promise<void>;
    isEditing?: boolean;
}

export const TrailForm: React.FC<TrailFormProps> = ({
    parkId,
    initialData = {},
    onSubmit,
    isEditing = false
}) => {
    const [formData, setFormData] = useState<Partial<Trail>>({
        parkId: parkId,
        name: '',
        isActive: true,
        isOpen: true,
        ...initialData
    });

    const [description, setDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // The handleImageChange function is needed for the ImageUpload component
    const handleImageChange = () => {
        // Empty function - image handling would be implemented in a real app
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!formData.name || formData.name.trim() === '') {
                throw new Error('Trail name is required');
            }

            // We would later upload the image to a server here and get back a URL to store with the trail data

            await onSubmit(formData as Omit<Trail, 'trailId'>);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred while saving the trail.');
            }
            // eslint-disable-next-line no-console
            console.error('Error submitting trail form:', err);
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
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Trail Information</h3>

                <div className="space-y-6">
                    <Input
                        label="Trail Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextArea
                        label="Trail Description (Optional)"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Describe the trail, its difficulty level, estimated completion time, etc."
                        fullWidth
                    />

                    <ImageUpload
                        label="Trail Image (Optional)"
                        onChange={handleImageChange}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <input
                                    id="isActive"
                                    name="isActive"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isActive" className="ml-3 block text-sm text-gray-700">
                                    Trail is active
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-7">
                                Active trails appear in the trail listing
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <input
                                    id="isOpen"
                                    name="isOpen"
                                    type="checkbox"
                                    checked={formData.isOpen}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isOpen" className="ml-3 block text-sm text-gray-700">
                                    Trail is open
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-7">
                                Close trails temporarily for maintenance or hazards
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                >
                    {isEditing ? 'Update Trail' : 'Create Trail'}
                </Button>
            </div>
        </form>
    );
};
