# AuthController Documentation

The `AuthController` manages authentication-related HTTP endpoints using Google OAuth. It integrates with `AuthService` and `UserService` to initiate login, handle OAuth callbacks, manage user sessions, and fetch authenticated user information. Errors are logged and handled with appropriate HTTP responses.

## Class: `AuthController`

### Constructor

```ts
constructor(authService: AuthService, userService: UserService)
```

- Initializes the controller with instances of `AuthService` and `UserService`.
- Binds all methods (`this.method = this.method.bind(this)`) to ensure correct `this` context in routes.

---

### Method: `startGoogleOAuth`

```ts
public startGoogleOAuth(req: Request, res: Response)
```

- **Route**: `POST /api/auth`
- **Purpose**: Generates a Google OAuth login URL and returns it to the client.
- **Request Body**:
  - `redirectPath` (string, optional): Client redirect path after login. Defaults to `'/'`.
- **Responses**:
  - `200 OK`: `{ "url": "https://accounts.google.com/o/oauth2/v2/auth?..." }`
  - `500 Internal Server Error`: On failure to generate the URL.

---

### Method: `handleGoogleCallback`

```ts
public async handleGoogleCallback(req: Request, res: Response)
```

- **Route**: `GET /api/auth/google/callback`
- **Purpose**: Handles Google OAuth callback, exchanges code for user token, sets JWT cookie, and redirects.
- **Query Parameters**:
  - `code` (string): Authorization code from Google.
  - `state` (string, optional): Redirect path.
- **Responses**:
  - `302 Redirect`: To `${CLIENT_URL}/${state}` (default `/`) with token cookie set.
  - Redirects to `/unauthorized` if OAuth fails.

- **Cookies Set**:
  - `token` – HTTP-only, secure (in production), SameSite varies by environment.

---

### Method: `logout`

```ts
public logout(req: Request, res: Response)
```

- **Route**: `POST /api/auth/logout`
- **Purpose**: Clears the JWT token cookie to log the user out.
- **Responses**:
  - `200 OK`: `{ "message": "Logged out successfully" }`

---

### Method: `getCurrentUser`

```ts
public async getCurrentUser(req: Request, res: Response)
```

- **Route**: `GET /api/auth/me`
- **Purpose**: Returns the authenticated user's details.
- **Behavior**:
  - If no user is present in the request, responds with `user: null`.
  - Uses `UserService` to fetch user from the database.
  - If user's profile image is hosted on Google, returns a proxied version to bypass CORS.

- **Responses**:
  - `200 OK`:  
    ```json
    {
      "user": {
        "id": 123,
        "email": "user@example.com",
        "name": "User Name",
        "picture": "https://.../profile-image-proxy?...",
        "role": "admin"
      }
    }
    ```
  - `200 OK` with `user: null` if unauthenticated or not found.
  - `500 Internal Server Error`: On server error.

---

## Error Handling

Each method:
- Wraps logic in a `try/catch` block for safety.
- Logs errors using `logger.error(...)` with contextual messages.
- Returns meaningful HTTP responses for client awareness and debugging.