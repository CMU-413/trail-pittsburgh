import React from 'react';
import { Button } from '../../../components/ui/Button';

type IssueDetailEditHeaderProps = {
    issueDisplayId: number;
    createdAt: string;
    isSaving: boolean;
    onSave: () => void;
    onCancel: () => void;
};

export const IssueDetailEditHeader: React.FC<IssueDetailEditHeaderProps> = ({
    issueDisplayId,
    isSaving,
    onSave,
    onCancel,
}) => {
    return (
        <div className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-lg font-semibold text-slate-900">
                        Editing Issue #{issueDisplayId} Details
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="primary"
                        size="md"
                        className="rounded-full px-4 py-2 font-semibold shadow-sm"
                        onClick={onSave}
                        isLoading={isSaving}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>

                    <Button
                        variant="secondary"
                        size="md"
                        className="rounded-full px-4 py-2 font-semibold shadow-sm"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                </div>
            </div>

            <div className="mt-3 text-sm text-slate-600">
                You can edit issue type, park, description, and location.
            </div>
        </div>
    );
};
