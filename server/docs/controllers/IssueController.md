# IssueController Documentation

The `IssueController` handles HTTP requests related to `Issue` entities and delegates core logic to the `IssueService`. It includes endpoints to create, retrieve, update, delete, and filter issues by park.

## Class: `IssueController`

### Constructor

```ts
constructor(issueService: IssueService)
```

- Initializes the controller with an `IssueService` instance.
- Binds all controller methods to preserve `this` context for route handling.

---

### Method: `createIssue`

```ts
public async createIssue(req: Request, res: Response)
```

- **Route**: `POST /api/issues`
- **Purpose**: Create a new issue.
- **Request Body**: JSON payload with issue fields (e.g., description, safetyRisk).
- **Responses**:
  - `201 Created`:
    ```json
    {
      "issue": { ... },
      "signedUrl": "https://..."
    }
    ```
  - `500 Internal Server Error`: If issue creation fails.

---

### Method: `getIssue`

```ts
public async getIssue(req: Request, res: Response)
```

- **Route**: `GET /api/issues/:issueId`
- **Purpose**: Retrieve a single issue by its ID.
- **Params**:
  - `issueId` (path param): Numeric ID of the issue.
- **Responses**:
  - `200 OK`: `{ "issue": { ... } }`
  - `404 Not Found`: If issue not found.
  - `500 Internal Server Error`: On error.

---

### Method: `getAllIssues`

```ts
public async getAllIssues(req: Request, res: Response)
```

- **Route**: `GET /api/issues`
- **Purpose**: Retrieve all issues.
- **Responses**:
  - `200 OK`: `{ "issues": [ ... ] }`
  - `500 Internal Server Error`: On error.

---

### Method: `getIssuesByPark`

```ts
public async getIssuesByPark(req: Request, res: Response)
```

- **Route**: `GET /api/issues/park/:parkId`
- **Purpose**: Get issues for a specific park.
- **Params**:
  - `parkId` (path param): Numeric ID of the park.
- **Responses**:
  - `200 OK`: `{ "issues": [ ... ] }`
  - `500 Internal Server Error`: On error.

---

### Method: `getMapPins`

```ts
public async getMapPins(req: Request, res: Response)
```

- **Route**: `GET /api/issues/map`
- **Purpose**: Retrieve issue pins within a geographic bounding box, with optional filtering by issue type and status.
- **Params**:
  - `bbox` (string, required): The geographic bounding box (min/max latitude/longitude) to filter issues.
  - `issueTypes` (string[], optional): Filters issues by their type (e.g., obstruction, standing water/mud, other).
  - `statuses` (string[], optional): Filters issues by their current status (e.g., OPEN, IN_PROGRESS)
- **Query Parameter**:

```md
bbox=40.44,-80.0,40.50,-79.9
&issueTypes=OBSTRUCTION
&issueTypes=FLOODING
&statuses=OPEN
&statuses=IN_PROGRESS
```

- **Responses**:
  - `200 OK`:
    ```json
    {
      "pins": [
        {
          "issueId": 1,
          "latitude": 40.44,
          "longitude": -79.99,
          "issueType": "OBSTRUCTION",
          "status": "OPEN"
        }
      ]
    }
    ```
  - `400 Bad Request`: Invalid or missing query parameters.
  - `500 Internal Server Error`: On failure to retrieve map pins.

### Method: `updateIssueStatus`

```ts
public async updateIssueStatus(req: Request, res: Response)
```

- **Route**: `PUT /api/issues/:issueId/status`
- **Purpose**: Update an issue's status (e.g., to "resolved").
- **Params**:
  - `issueId` (path param): Numeric ID of the issue.
- **Request Body**:
  ```json
  {
    "status": "resolved"
  }
  ```
- **Responses**:
  - `200 OK`: `{ "issue": { ... } }`
  - `404 Not Found`: If issue not found.
  - `500 Internal Server Error`: On error.

---

### Method: `updateIssue`

```ts
public async updateIssue(req: Request, res: Response)
```

- **Route**: `PUT /api/issues/:issueId`
- **Purpose**: Update details of an existing issue.
- **Params**:
  - `issueId` (path param): Numeric ID of the issue.
- **Request Body**:
  ```json
  {
    "description": "Updated description",
    "issueType": "OBSTRUCTION",
    "parkId": 1,
    "latitude": 80,
    "longitude": 170
  }
  ```
- **Responses**:
  - `200 OK`: `{ "issue": { ... } }`
  - `404 Not Found`: If issue not found.
  - `500 Internal Server Error`: On error.

---

### Method: `unsubscribeReporterNotifications`

```ts
public async unsubscribeReporterNotifications(req: Request, res: Response)
```

- **Route**: `GET /api/issues/:issueId/unsubscribe?token=<token>`
- **Purpose**: Unsubscribe the reporter from future email notifications for a specific issue.
- **Params**:
  - `issueId` (path param): Numeric ID of the issue.
- **Query**:
  - `token`: Signed unsubscribe token generated for that issue/reporter email.
- **Responses**:
  - Browser/email-link click (`Accept: text/html`): Returns an HTML confirmation/error page.
  - API client (`Accept: application/json`): Returns JSON `{ "message": "..." }`.
  - `200 OK`: Unsubscribed successfully or already unsubscribed.
  - `400 Bad Request`: Invalid/expired token.
  - `404 Not Found`: Issue does not exist.
  - `500 Internal Server Error`: Unsubscribe processing failed.

---

### Method: `deleteIssue`

```ts
public async deleteIssue(req: Request, res: Response)
```

- **Route**: `DELETE /api/issues/:issueId`
- **Purpose**: Delete an issue by ID.
- **Params**:
  - `issueId` (path param): Numeric ID of the issue.
- **Responses**:
  - `204 No Content`: If deletion succeeds.
  - `404 Not Found`: If issue not found.
  - `500 Internal Server Error`: On error.

---

## Error Handling

All methods:

- Use `try/catch` for exception handling.
- Log errors using `logger.error(...)` with contextual messages.
- Return appropriate status codes (`500`, `404`, etc.) and error messages.
