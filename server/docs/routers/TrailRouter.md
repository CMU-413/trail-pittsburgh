# Trail API Routes

Base URL: `/api/trails`

---

## Public Routes

### `GET /api/trails`

**Description:**  
Retrieve all trails.

**Response:**
- `200 OK`: List of trail objects

---

### `GET /api/trails/:trailId`

**Description:**  
Retrieve a specific trail by its ID.

**Params:**
- `trailId` (number, required)

**Validation:**  
- Validated using `getTrailSchema`

**Response:**
- `200 OK`: Trail object
- `404 Not Found`: If trail doesn't exist

---

### `GET /api/trails/park/:parkId`

**Description:**  
Retrieve all trails belonging to a specific park.

**Params:**
- `parkId` (number, required)

**Validation:**  
- Validated using `getTrailsFromParkSchema`

**Response:**
- `200 OK`: List of trails for the park

---

## Protected Routes

> Requires valid JWT in an HTTP-only cookie

### `POST /api/trails`

**Description:**  
Create a new trail.

**Authentication Required:** Yes

**Request Body:**
```json
{
  "name": "Trail Name",
  "parkId": 1,
  "isActive": true,
  "isOpen": true
}
```

**Validation:**  
- Validated using `createTrailSchema`

**Response:**
- `201 Created`: Created trail object
- `401 Unauthorized`: If not logged in

---

### `PUT /api/trails/:trailId`

**Description:**  
Update a trail's data (e.g., open/closed status or other fields).

**Authentication Required:** Yes

**Params:**
- `trailId` (number, required)

**Request Body:**
```json
{
  "isOpen": false
}
```

**Validation:**  
- Validated using `updateTrailSchema`

**Response:**
- `200 OK`: Updated trail
- `404 Not Found`: If trail not found
- `401 Unauthorized`: If not logged in

---

### `DELETE /api/trails/:trailId`

**Description:**  
Delete a trail by ID.

**Authentication Required:** Yes

**Params:**
- `trailId` (number, required)

**Validation:**  
- Validated using `deleteTrailSchema`

**Response:**
- `204 No Content`: If deleted
- `404 Not Found`: If not found
- `401 Unauthorized`: If not logged in