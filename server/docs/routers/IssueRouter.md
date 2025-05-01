# Issue API Routes

**Base URL:** `/api/issues`

---

## Protected Routes

> Requires valid JWT in an HTTP-only cookie.

### `GET /api/issues`

**Description:**  
Retrieve all issues.

**Authentication Required:** Yes (Admin)

**Response:**
- `200 OK`: List of issue objects

---

### `GET /api/issues/:issueId`

**Description:**  
Retrieve a specific issue by ID.

**Authentication Required:** Yes (Admin)

**Params:**
- `issueId` (number, required)

**Validation:**  
- Validated using `getIssueSchema`

**Response:**
- `200 OK`: Issue object
- `404 Not Found`: If not found

---

### `GET /api/issues/park/:parkId`

**Description:**  
Get issues associated with a specific park.

**Authentication Required:** Yes (Admin)

**Params:**
- `parkId` (number, required)

**Validation:**  
- Validated using `getIssuesByParkSchema`

**Response:**
- `200 OK`: List of issues for the park

---

### `GET /api/issues/trail/:trailId`

**Description:**  
Get issues associated with a specific trail.

**Authentication Required:** Yes (Admin)

**Params:**
- `trailId` (number, required)

**Validation:**  
- Validated using `getIssuesByTrailSchema`

**Response:**
- `200 OK`: List of issues for the trail

---

### `GET /api/issues/urgency/:urgency`

**Description:**  
Get issues by urgency level.

**Authentication Required:** Yes (Admin)

**Params:**
- `urgency` (string, required – e.g. `"low"`, `"medium"`, `"high"`)

**Validation:**  
- Validated using `getIssuesByUrgencySchema`

**Response:**
- `200 OK`: Filtered list of issues

---

### `POST /api/issues`

**Description:**  
Create a new issue.

**Authentication Required:** Yes

**Request Body:**
```json
{
  "trailId": 1,
  "description": "Washed out bridge",
  "urgency": "high"
}
```

**Validation:**  
- Validated using `createIssueSchema`

**Response:**
- `201 Created`: Created issue object
- `401 Unauthorized`: If not logged in

---

### `PUT /api/issues/:issueId/status`

**Description:**  
Update the status of an issue.

**Authentication Required:** Yes (Admin)

**Params:**
- `issueId` (number, required)

**Request Body:**
```json
{
  "status": "resolved"
}
```

**Validation:**  
- Validated using `updateIssueStatusSchema`

**Response:**
- `200 OK`: Updated issue
- `404 Not Found`: If issue not found
- `401 Unauthorized`: If not logged in

---

### `PUT /api/issues/:issueId`

**Description:**  
Update details of an issue.

**Authentication Required:** Yes (Admin)

**Params:**
- `issueId` (number, required)

**Validation:**  
- Validated using `updateIssueSchema`

**Response:**
- `200 OK`: Updated issue
- `404 Not Found`: If issue not found
- `401 Unauthorized`: If not logged in

---

### `DELETE /api/issues/:issueId`

**Description:**  
Delete an issue by ID.

**Authentication Required:** Yes (Super Admin)

**Params:**
- `issueId` (number, required)

**Validation:**  
- Validated using `deleteIssueSchema`

**Response:**
- `204 No Content`: If deleted
- `404 Not Found`: If not found
- `401 Unauthorized`: If not logged in