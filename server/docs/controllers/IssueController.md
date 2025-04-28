# IssueController Documentation

The `IssueController` is responsible for handling all HTTP requests related to `Issue` entities. It delegates business logic to the `IssueService` and includes endpoints for creating, retrieving, updating, and deleting issues, as well as filtering by park, trail, or urgency.

## Class: `IssueController`

### Constructor
constructor(issueService: IssueService)
- Initializes the controller with a given `IssueService` instance.
- Binds all route handler methods to the class instance.


### Method: `getIssue`

public async getIssue(req: Request, res: Response)
- **Route**: `GET /api/issues/:issueId`
- **Purpose**: Retrieve a specific issue by ID.
- **Parameters**:
  - `issueId` (path param): ID of the issue.
- **Responses**:
  - `200 OK`: Issue returned.
  - `404 Not Found`: If issue is not found.
  - `500 Internal Server Error`: On server error.


### Method: `getAllIssues`

public async getAllIssues(req: Request, res: Response)
- **Route**: `GET /api/issues`
- **Purpose**: Retrieve all issues.
- **Responses**:
  - `200 OK`: Returns a list of all issues.
  - `500 Internal Server Error`: On server error.


### Method: `createIssue`

public async createIssue(req: Request, res: Response)
- **Route**: `POST /api/issues`
- **Purpose**: Create a new issue.
- **Request Body**:
  - JSON payload with issue details.
- **Responses**:
  - `201 Created`: Returns created issue and signed image upload URL.
  - `500 Internal Server Error`: On creation error.


### Method: `updateIssueStatus`

public async updateIssueStatus(req: Request, res: Response)
- **Route**: `PATCH /api/issues/:issueId/status`
- **Purpose**: Update the status of a specific issue.
- **Parameters**:
  - `issueId` (path param): ID of the issue.
- **Request Body**:
  - `status`: New status string.
- **Responses**:
  - `200 OK`: Updated issue returned.
  - `404 Not Found`: Issue not found.
  - `500 Internal Server Error`: On update failure.


### Method: `deleteIssue`

public async deleteIssue(req: Request, res: Response)
- **Route**: `DELETE /api/issues/:issueId`
- **Purpose**: Delete an issue by ID.
- **Parameters**:
  - `issueId` (path param): ID of the issue.
- **Responses**:
  - `204 No Content`: Issue deleted.
  - `404 Not Found`: Issue not found.
  - `500 Internal Server Error`: On deletion failure.


### Method: `getIssuesByPark`

public async getIssuesByPark(req: Request, res: Response)
- **Route**: `GET /api/parks/:parkId/issues`
- **Purpose**: Get all issues for a specific park.
- **Parameters**:
  - `parkId` (path param): ID of the park.
- **Responses**:
  - `200 OK`: List of park issues returned.
  - `500 Internal Server Error`: On failure.


### Method: `getIssuesByTrail`

public async getIssuesByTrail(req: Request, res: Response)
- **Route**: `GET /api/trails/:trailId/issues`
- **Purpose**: Get all issues for a specific trail.
- **Parameters**:
  - `trailId` (path param): ID of the trail.
- **Responses**:
  - `200 OK`: List of trail issues returned.
  - `500 Internal Server Error`: On failure.


### Method: `getIssuesByUrgency`

public async getIssuesByUrgency(req: Request, res: Response)
- **Route**: `GET /api/issues/urgency/:urgency`
- **Purpose**: Get issues by urgency level.
- **Parameters**:
  - `urgency` (path param): Numeric urgency value (e.g. 1-5).
- **Responses**:
  - `200 OK`: List of filtered issues returned.
  - `500 Internal Server Error`: On failure.


## Error Handling

All methods:
- Use `try/catch` blocks to handle unexpected errors.
- Log errors using the `logger.error()` utility.
- Return appropriate HTTP status codes and messages.



