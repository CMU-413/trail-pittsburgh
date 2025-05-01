# IssueController Documentation

The `IssueController` handles HTTP requests related to `Issue` entities and delegates core logic to the `IssueService`. It includes endpoints to create, retrieve, update, delete, and filter issues by park, trail, or urgency.

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
- **Request Body**: JSON payload with issue fields (e.g., description, trailId, urgency).
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

### Method: `getIssuesByTrail`

```ts
public async getIssuesByTrail(req: Request, res: Response)
```

- **Route**: `GET /api/issues/trail/:trailId`
- **Purpose**: Get issues for a specific trail.
- **Params**:
  - `trailId` (path param): Numeric ID of the trail.
- **Responses**:
  - `200 OK`: `{ "issues": [ ... ] }`
  - `500 Internal Server Error`: On error.

---

### Method: `getIssuesByUrgency`

```ts
public async getIssuesByUrgency(req: Request, res: Response)
```

- **Route**: `GET /api/issues/urgency/:urgency`
- **Purpose**: Get issues by urgency level.
- **Params**:
  - `urgency` (path param): Value from `IssueUrgencyEnum` (e.g., `"low"`, `"medium"`, `"high"`).
- **Responses**:
  - `200 OK`: `{ "issues": [ ... ] }`
  - `500 Internal Server Error`: On error.

---

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
    "urgency": "medium",
    "issueType": "obstruction",
    "parkId": 1,
    "trailId": 2
  }
  ```
- **Responses**:
  - `200 OK`: `{ "issue": { ... } }`
  - `404 Not Found`: If issue not found.
  - `500 Internal Server Error`: On error.

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