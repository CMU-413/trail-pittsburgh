# AuthController Documentation

The `AuthController` handles authentication-related HTTP endpoints using Google OAuth. It relies on the `AuthService` to initiate and process OAuth authentication, retrieve the currently authenticated user, and manage user logout. This controller ensures secure handling of user sessions and redirection to the client application.

## Class: `AuthController`

### Constructor
constructor(authService: AuthService)
- Initializes the controller with an instance of `AuthService`.
- Binds all controller methods (`this.method = this.method.bind(this)`) for correct `this` context in route handlers.


### Method: `startGoogleOAuth`

public startGoogleOAuth(req: Request, res: Response)
- **Route**: `POST /api/auth/google`
- **Purpose**: Initiate the Google OAuth login process.
- **Request Body**:
  - `redirectPath` *(string, optional)*: A relative path indicating where the user should be redirected after login. Defaults to `'/'`.
- **Responses**:
  - `200 OK`: Returns an object containing the Google OAuth URL to redirect the user.
  - `500 Internal Server Error`: On failure to generate the URL.


### Method: `handleGoogleCallback`

public async handleGoogleCallback(req: Request, res: Response)
- **Route**: `GET /api/auth/google/callback`
- **Purpose**: Handle the callback from Google after user authentication.
- **Query Parameters**:
  - `code`: The authorization code returned from Google OAuth.
  - `state`: Optional redirect path.
- **Responses**:
  - `302 Redirect`: Redirects to the appropriate client URL with the token set in an HTTP-only cookie.
  - Redirects to `/unauthorized` on failure.


### Method: `logout`

public logout(req: Request, res: Response)
- **Route**: `POST /api/auth/logout`
- **Purpose**: Log the user out by clearing the token cookie.
- **Responses**:
  - `200 OK`: Indicates successful logout.


### Method: `getCurrentUser`

public getCurrentUser(req: Request, res: Response)
- **Route**: `GET /api/auth/user`
- **Purpose**: Retrieve the currently authenticated user’s details.
- **Responses**:
  - `200 OK`: Returns the user object with `id`, `email`, `name`, and `picture`. If no user is logged in, returns `user: null`.
  - If the picture is hosted by Google, a proxy is used to avoid CORS issues.


## Error Handling

Each method:
- Uses a `try/catch` block where applicable to handle asynchronous errors.
- Logs errors using `logger.error(...)` with clear context messages.
- Returns appropriate HTTP status codes and structured error messages for debugging and user feedback.
