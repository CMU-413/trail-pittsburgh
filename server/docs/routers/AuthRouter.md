# Authentication API Routes

**Base URL:** `/api/auth`

---

## `POST /api/auth`

**Description:**  
Initiates the Google OAuth 2.0 login process by generating an authorization URL.

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
- This route is used to begin the login process from the frontend.
- Request is validated against the `startOAuthSchema`.

---

## `GET /api/auth/google/callback`

**Description:**  
Handles the OAuth callback from Google. Exchanges the authorization code for user info, finds or creates a user in the database, signs a JWT, and sets it in an HTTP-only cookie.

**Query Parameters:**
- `code` – *required* – Authorization code from Google.
- `state` – *optional* – Original redirect path passed via `redirectPath`.

**Response:**  
Redirects the user to `${CLIENT_URL}/${state}` or `/` with no JSON body.

**Cookie Set:**
- `token` – HTTP-only, SameSite=Strict, Secure (in production)

**Error Redirects:**
- `/unauthorized` – if email domain is not allowed.
- `/error` – on general authentication failure.

**Notes:**
- Only users with an email domain matching `ALLOWED_EMAIL_DOMAIN` are allowed.

---

## `POST /api/auth/logout`

**Description:**  
Logs out the current user by clearing the `token` cookie.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## `GET /api/auth/me`

**Description:**  
Retrieves the currently authenticated user by verifying the JWT token in the cookie.

**Authentication Required:** Yes

**Response (Authenticated):**
```json
{
  "user": {
    "id": 123,
    "email": "user@example.com",
    "name": "Jane Doe",
    "picture": "https://yourdomain.com/api/auth/profile-image-proxy?url=...",
    "role": "admin"
  }
}
```

**Response (Unauthenticated or No User Found):**
```json
{
  "user": null
}
```

**Error Response (Server Error):**
```json
{
  "message": "Failed to retrieve user information"
}
```

**Notes:**
- If the user's `profileImage` is hosted on `googleusercontent.com`, it is proxied to bypass CORS.
- The `role` field reflects user authorization level (e.g., `"user"`, `"admin"`, `"superadmin"`).

---

## `GET /api/auth/profile-image-proxy`

**Description:**  
Fetches and proxies a Google-hosted profile image to avoid CORS issues, with appropriate caching headers.

**Query Parameters:**
- `url` – *required* – URL of the Google-hosted image (`*.googleusercontent.com` only)

**Response:**
- Returns the proxied image.

**Headers:**
- `Content-Type` — based on fetched image
- `Cache-Control: public, max-age=86400`
- `Access-Control-Allow-Origin: *`

**Error Handling:**
- Returns `400` if `url` is missing.
- Returns `403` if `url` does not contain `googleusercontent.com`.
- Redirects to a default avatar:
  `https://ui-avatars.com/api/?background=random&color=fff&size=400&name=User`

**Notes:**
- This proxy is required due to CORS restrictions on Google's image servers.