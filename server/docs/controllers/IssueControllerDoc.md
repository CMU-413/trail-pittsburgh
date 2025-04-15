# IssueController Documentation

The `IssueController` handles all incoming HTTP requests related to issues. It communicates with `IssueService` to fetch, create, update, or delete issue records, and to retrieve issues based on specific criteria such as park, trail, or urgency.

---

## Constructor

### `constructor(issueService: IssueService)`

Initializes the `IssueController` with an instance of `IssueService`.

---

## Methods

### `getIssue(req: Request, res: Response)`

Fetch a specific issue by its ID.

**Route Parameter:**
- `id` (number): The ID of the issue.

**Responses:**
- `200 OK`: Returns the issue object.
- `404 Not Found`: Issue not found.
- `500 Internal Server Error`: Failed to retrieve the issue.

---

### `getAllIssues(req: Request, res: Response)`

Retrieve a list of all issues in the system.

**Responses:**
- `200 OK`: Returns an array of issue objects.
- `500 Internal Server Error`: Failed to retrieve issues.

---

### `createIssue(req: Request, res: Response)`

Create a new issue with the data provided in the request body.

**Request Body:**
- JSON object containing issue fields (defined in the service layer).

**Responses:**
- `201 Created`: Successfully created issue.
- `500 Internal Server Error`: Failed to create issue.

---

### `updateIssueStatus(req: Request, res: Response)`

Update the status of a specific issue.

**Route Parameter:**
- `id` (number): The ID of the issue to update.

**Request Body:**
- `status` (string): New status for the issue.

**Responses:**
- `200 OK`: Successfully updated issue.
- `400 Bad Request`: Missing or invalid `status`.
- `404 Not Found`: Issue not found.
- `500 Internal Server Error`: Failed to update status.

---

### `deleteIssue(req: Request, res: Response)`

Delete an issue by its ID.

**Route Parameter:**
- `id` (number): The ID of the issue.

**Responses:**
- `204 No Content`: Successfully deleted issue.
- `404 Not Found`: Issue not found.
- `500 Internal Server Error`: Failed to delete issue.

---

### `getIssuesByPark(req: Request, res: Response)`

Fetch all issues for a specific park.

**Route Parameter:**
- `parkId` (number): The ID of the park.

**Responses:**
- `200 OK`: Array of issues for the park.
- `500 Internal Server Error`: Failed to retrieve issues for this park.

---

### `getIssuesByTrail(req: Request, res: Response)`

Fetch all issues for a specific trail.

**Route Parameter:**
- `trailId` (number): The ID of the trail.

**Responses:**
- `200 OK`: Array of issues for the trail.
- `500 Internal Server Error`: Failed to retrieve issues for this trail.

---

### `getIssuesByUrgency(req: Request, res: Response)`

Retrieve issues based on urgency level.

**Route Parameter:**
- `urgency` (number): The urgency level (e.g., 1 = low, 5 = high).

**Responses:**
- `200 OK`: Array of issues with matching urgency.
- `500 Internal Server Error`: Failed to retrieve issues by urgency.

---
