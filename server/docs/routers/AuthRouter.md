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
- The request is validated against the `startOAuthSchema`.

---

## `GET /api/auth/google/callback`

**Description:**  
Handles the OAuth callback from Google. Exchanges the authorization code for user info, creates or finds the user in the database, signs a JWT, and sets it as an HTTP-only cookie.

**Query Parameters:**
- `code` – required – authorization code from Google
- `state` – optional – frontend redirect path (originally passed in `redirectPath`)

**Response:**  
Redirects to `${CLIENT_URL}/${state}` or `/` with no JSON body.

**Cookie Set:**
- `token` – HTTP-only, SameSite=Strict, Secure (in production)

**Error Redirects:**
- `/unauthorized` – if email domain is not allowed
- `/error` – if other errors occur during authentication

**Notes:**
- Login is restricted to users with email domains matching the environment variable `ALLOWED_EMAIL_DOMAIN` (e.g., `@trailpittsburgh.org`).

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

---

## `GET /api/auth/profile-image-proxy`

**Description:**  
Fetches a Google-hosted profile image from a specified URL and returns it with appropriate headers to handle CORS and caching.

**Query Parameters:**
- `url` – required – The URL of the Google-hosted image (`*.googleusercontent.com` only)

**Response:**  
- Returns the proxied image with headers:
  - `Content-Type` based on the image
  - `Cache-Control: public, max-age=86400`
  - `Access-Control-Allow-Origin: *`

**Error Handling:**
- Returns `400` if the URL is missing
- Returns `403` if the URL does not contain `googleusercontent.com`
- Redirects to a default avatar if image fetching fails:
  `https://ui-avatars.com/api/?background=random&color=fff&size=400&name=User`

**Notes:**
- This is a proxy route to work around CORS issues when displaying Google profile images on the frontend.