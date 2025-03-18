// src/components/issues/IssueResolutionForm.tsx
import React, { useState } from 'react';
import { Issue } from '../../types';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ImageUpload } from '../ui/ImageUpload';

interface IssueResolutionFormProps {
    issue: Issue;
    onResolve: (issueId: number, notes: string, image?: string) => Promise<void>;
}

export const IssueResolutionForm: React.FC<IssueResolutionFormProps> = ({
    issue,
    onResolve
}) => {
    const [notes, setNotes] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleImageChange = (file: File | null, previewUrl: string | null) => {
        // eslint-disable-next-line no-console
        console.log({ file, previewUrl });
        setImagePreview(previewUrl);
    };

    const handleConfirm = () => {
        if (!notes.trim()) {
            setError('Please provide resolution notes');
            return;
        }

        setError(null);
        setIsConfirming(true);
    };

    const handleCancelConfirm = () => {
        setIsConfirming(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!notes.trim()) {
            setError('Please provide resolution notes');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await onResolve(issue.issue_id, notes, imagePreview || undefined);
            setIsSuccess(true);
            setIsConfirming(false);
        } catch (err) {
            setError('An error occurred while resolving the issue.');
            setIsConfirming(false);
            // eslint-disable-next-line no-console
            console.error('Error resolving issue:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // If the issue is already resolved, don't show the form
    if (issue.status === 'resolved') {
        return (
            <Alert variant="success">
                This issue has already been resolved.
            </Alert>
        );
    }

    // Show success message
    if (isSuccess) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300">
                <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                        <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Issue Resolved Successfully!</h2>
                    <p className="mt-2 text-gray-600 max-w-xl mx-auto">
                        Thank you for your work keeping our trails in great condition. The issue has been marked as resolved.
                    </p>
                </div>
            </div>
        );
    }

    // Show confirmation dialog
    if (isConfirming) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300">
                <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                        <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Confirm Resolution</h2>
                    <p className="mt-2 text-gray-600 max-w-xl mx-auto">
                        Are you sure you want to mark this issue as resolved? This action will notify any users who requested to be informed.
                    </p>

                    <div className="mt-8 flex justify-center space-x-4">
                        <Button
                            variant="secondary"
                            onClick={handleCancelConfirm}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                        >
                            Confirm Resolution
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Show the main form
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resolve Issue</h2>

            {error && (
                <Alert variant="danger" className="mb-4" onDismiss={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} className="space-y-6">
                <TextArea
                    label="Resolution Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe how this issue was resolved..."
                    rows={4}
                    fullWidth
                    error={error && !notes.trim() ? 'Please provide resolution notes' : undefined}
                />

                <ImageUpload
                    label="Resolution Photo (Optional)"
                    onChange={handleImageChange}
                />

                <div className="flex justify-end mt-8">
                    <Button
                        type="submit"
                        variant="success"
                        size="md"
                    >
                        Mark as Resolved
                    </Button>
                </div>
            </form>
        </div>
    );
};
