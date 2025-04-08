# IssueController Documentation

The `IssueController` class handles HTTP requests related to issue management in the Trail Pittsburgh application. It provides endpoints for creating, reading, updating, and deleting issues, as well as specialized queries for filtering issues.

## Constructor

### `constructor(issueService: IssueService)`
Creates a new instance of the IssueController.

**Parameters:**
- `issueService`: IssueService - An instance of the IssueService class for handling business logic

## Methods

### `getIssue(req: express.Request, res: express.Response): Promise<void>`
Retrieves a single issue by its ID.

**Parameters:**
- `req`: Express Request object containing the issue ID in params
- `res`: Express Response object

**Returns:**
- Status 200: JSON object containing the issue data
- Status 404: If issue is not found
- Status 500: If server error occurs

<!-- **Example Response (200):**
```json
{
  "issue_id": 1,
  "park_id": 1,
  "trail_id": 1,
  // ... other issue properties
}
``` -->

### `getAllIssues(req: express.Request, res: express.Response): Promise<void>`
Retrieves all issues in the system.

**Parameters:**
- `req`: Express Request object
- `res`: Express Response object

**Returns:**
- Status 200: Array of issue objects
- Status 500: If server error occurs

### `createIssue(req: express.Request, res: express.Response): Promise<void>`
Creates a new issue in the system.

**Parameters:**
- `req`: Express Request object with the following body parameters:
  - `park_id`: number (required)
  - `trail_id`: number (required)
  - `issue_type`: string 
  - `urgency`: number
  - `description`: string (required)
  - `is_public`: boolean 
  - `status`: string 
  - `notify_reporter`: boolean 
  - `issue_image`: string (optional)
  - `reported_at`: Date (optional)
  - 'reporter_email: string
  - 'lon' : number
  - 'lat' : number
- `res`: Express Response object

**Returns:**
- Status 201: Created issue object
- Status 400: If required fields are missing
- Status 500: If server error occurs

### `updateIssueStatus(req: express.Request, res: express.Response): Promise<void>`
Updates the status of an existing issue.

**Parameters:**
- `req`: Express Request object with:
  - `id`: number (in URL params)
  - `status`: string (in request body)
- `res`: Express Response object

**Returns:**
- Status 200: Updated issue object
- Status 400: If status is missing
- Status 404: If issue not found
- Status 500: If server error occurs

### `deleteIssue(req: express.Request, res: express.Response): Promise<void>`
Deletes an issue from the system.

**Parameters:**
- `req`: Express Request object with issue ID in params
- `res`: Express Response object

**Returns:**
- Status 204: On successful deletion
- Status 404: If issue not found
- Status 500: If server error occurs

### `getIssuesByPark(req: express.Request, res: express.Response): Promise<void>`
Retrieves all issues associated with a specific park.

**Parameters:**
- `req`: Express Request object with park ID in params
- `res`: Express Response object

**Returns:**
- Status 200: Array of issue objects for the specified park
- Status 500: If server error occurs

### `getIssuesByTrail(req: express.Request, res: express.Response): Promise<void>`
Retrieves all issues associated with a specific trail.

**Parameters:**
- `req`: Express Request object with trail ID in params
- `res`: Express Response object

**Returns:**
- Status 200: Array of issue objects for the specified trail
- Status 500: If server error occurs

### `getIssuesByUrgency(req: express.Request, res: express.Response): Promise<void>`
Retrieves all issues with a specific urgency level.

**Parameters:**
- `req`: Express Request object with urgency level in params
- `res`: Express Response object

**Returns:**
- Status 200: Array of issue objects with the specified urgency
- Status 500: If server error occurs

## Error Handling

All methods implement error handling with:
- Input validation where required
- Try-catch blocks for async operations
- Appropriate HTTP status codes
- Error logging to console
- User-friendly error messages in responses

## Dependencies

- Express.js for HTTP handling
- IssueService for business logic implementation 