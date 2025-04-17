# Authentication API Routes

Base URL: `/api/auth`

---

## `POST /api/auth`

**Description:**  
Generates a Google OAuth 2.0 authorization URL and returns it to the client.

**Request Body:**
```json
{
  "redirectPath": "/dashboard" // Optional. Defaults to "/"
}
```

**Response:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

**Notes:**
- This route is used to initiate the login process from the frontend.

---

### `GET /api/auth/google/callback`
**Description:**  
Handles the OAuth callback from Google. Exchanges the authorization code for user info, creates or finds the user in the database, signs a JWT, and sets it as an HTTP-only cookie.

**Note:**  
Login is restricted to users with email domains matching the value of the environment variable `ALLOWED_EMAIL_DOMAIN`. By default, only users with emails ending in `@trailpittsburgh.org` will be allowed access.

**Query Parameters:**
- `code` – required – authorization code from Google
- `state` – optional – frontend redirect path (originally passed in `redirectPath`)

**Response:**  
Redirects to `${CLIENT_URL}/${state}` or `/` with no JSON body.

**Cookie Set:**
- `token` – HTTP-only, SameSite=Strict, Secure (in production)

**Error Redirects:**
- `/unauthorized` – if email domain is not allowed

---

## `POST /api/auth/logout`

**Description:**  
Clears the authentication token by removing the `token` cookie.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## `GET /api/auth/me`

**Description:**  
Returns the currently authenticated user by verifying the JWT token from the cookie.

**Authentication Required:** Yes (JWT cookie)

**Response:**
```json
{
  "user": {
    "id": 123,
    "email": "user@example.com"
  }
}
```

**Error Response (Unauthenticated):**
```json
{
  "error": "Access token required"
}
```

**Error Response (Invalid/Expired Token):**
```json
{
  "error": "Invalid or expired token"
}
```