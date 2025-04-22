# Issue API Routes

Base URL: `/api/issues`

---

## Public Routes

### `GET /api/issues`
**Description:** Retrieve all issues.

**Response:**
- `200 OK`: List of issue objects

---

### `GET /api/issues/:issueId`
**Description:** Retrieve a specific issue by ID.

**Params:**
- `issueId` (number, required)

**Response:**
- `200 OK`: Issue object
- `404 Not Found`: If not found

---

### `GET /api/issues/park/:parkId`
**Description:** Get issues associated with a specific park.

**Params:**
- `parkId` (number, required)

**Response:**
- `200 OK`: List of issues for the park

---

### `GET /api/issues/trail/:trailId`
**Description:** Get issues associated with a specific trail.

**Params:**
- `trailId` (number, required)

**Response:**
- `200 OK`: List of issues for the trail

---

### `GET /api/issues/urgency/:urgency`
**Description:** Get issues by urgency level.

**Params:**
- `urgency` (string, required – e.g. `"low"`, `"medium"`, `"high"`)

**Response:**
- `200 OK`: Filtered list of issues

---

## Protected Routes

> Requires valid JWT in an HTTP-only cookie

### `POST /api/issues`
**Description:** Create a new issue.

**Request Body:**
```json
{
  "trailId": 1,
  "description": "Washed out bridge",
  "urgency": "high"
}
```

**Response:**
- `201 Created`: Created issue object
- `401 Unauthorized`: If not logged in

---

### `PUT /api/issues/:issueId/status`
**Description:** Update the status of an issue.

**Params:**
- `issueId` (number, required)

**Request Body:**
```json
{
  "status": "resolved"
}
```

**Response:**
- `200 OK`: Updated issue
- `404 Not Found`: If issue not found
- `401 Unauthorized`: If not logged in

---

### `DELETE /api/issues/:issueId`
**Description:** Delete an issue by ID.

**Params:**
- `issueId` (number, required)

**Response:**
- `204 No Content`: If deleted
- `404 Not Found`: If not found
- `401 Unauthorized`: If not logged in