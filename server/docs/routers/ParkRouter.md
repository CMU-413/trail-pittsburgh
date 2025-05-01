# Park API Routes

**Base URL:** `/api/parks`

---

## Public Routes

### `GET /api/parks`

**Description:**  
Retrieve all parks.

**Authentication Required:** No

**Response:**
- `200 OK`: List of park objects

---

## Protected Routes

> Requires valid JWT in an HTTP-only cookie

### `GET /api/parks/:parkId`

**Description:**  
Retrieve a specific park by ID.

**Authentication Required:** Yes (Admin)

**Params:**
- `parkId` (number, required)

**Validation:**  
- Validated using `getParkSchema`

**Response:**
- `200 OK`: Park object
- `404 Not Found`: If park doesn't exist

---

### `POST /api/parks`

**Description:**  
Create a new park.

**Authentication Required:** Yes (Admin)

**Request Body:**
```json
{
  "name": "Park Name",
  "location": "Somewhere, USA",
  "isActive": true
}
```

**Validation:**  
- Validated using `createParkSchema`

**Response:**
- `201 Created`: Created park object
- `401 Unauthorized`: If not logged in

---

### `PUT /api/parks/:parkId`

**Description:**  
Update a park’s data.

**Authentication Required:** Yes (Admin)

**Params:**
- `parkId` (number, required)

**Request Body:**
```json
{
  "name": "New Park Name",
  "location": "Updated Location",
  "isActive": false
}
```

**Validation:**  
- Validated using `updateParkSchema`

**Response:**
- `200 OK`: Updated park
- `404 Not Found`: If park not found
- `401 Unauthorized`: If not logged in

---

### `DELETE /api/parks/:parkId`

**Description:**  
Delete a park by ID.

**Authentication Required:** Yes (Super Admin)

**Params:**
- `parkId` (number, required)

**Validation:**  
- Validated using `deleteParkSchema`

**Response:**
- `204 No Content`: If deleted
- `404 Not Found`: If not found
- `401 Unauthorized`: If not logged in