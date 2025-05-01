# User API Routes

**Base URL:** `/api/users`

> All routes require a valid JWT in an HTTP-only cookie and Super Admin access.

---

### `GET /api/users`

**Description:**  
Retrieve a list of all users.

**Authentication Required:** Yes (Super Admin)

**Response:**
- `200 OK`: List of user objects

---

### `GET /api/users/:userId/role`

**Description:**  
Get the role of a specific user.

**Authentication Required:** Yes (Super Admin)

**Params:**
- `userId` (string or number, required)

**Response:**
- `200 OK`: User role
- `404 Not Found`: If user doesn't exist

---

### `PUT /api/users/:userId/role`

**Description:**  
Update the role of a specific user.

**Authentication Required:** Yes (Super Admin)

**Params:**
- `userId` (string or number, required)

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response:**
- `200 OK`: Updated user object
- `404 Not Found`: If user doesn't exist
- `400 Bad Request`: If role is invalid