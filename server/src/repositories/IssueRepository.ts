export class IssueRepository {
    public async getIssue(issueId: number) {
        // Sample data
        return {
            id: issueId,
            park: 'Frick Park',
            coordinates: {
                longitude: 999,
                latitude: 999,
            }
        };
    }
}
