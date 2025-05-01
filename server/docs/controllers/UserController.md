# UserController Documentation

The `UserController` manages administrative endpoints related to user data and roles. It relies on the `UserService` for business logic, including fetching all users, retrieving a user's role, and updating a user's role.

## Class: `UserController`

### Constructor

```ts
constructor(userService: UserService)
```

- Initializes the controller with a `UserService` instance.
- Binds all controller methods to maintain `this` context in route handlers.

---

### Method: `getUserRole`

```ts
public async getUserRole(req: Request, res: Response)
```

- **Route**: `GET /api/users/:userId/role`
- **Purpose**: Retrieve the role of the currently authenticated user.
- **Authentication Required**: Yes (Super Admin)
- **Responses**:
  - `200 OK`:  
    ```json
    { "role": "admin" }
    ```
  - `401 Unauthorized`: If no user is authenticated.
  - `404 Not Found`: If the user does not exist.
  - `500 Internal Server Error`: On failure.

---

### Method: `getAllUsers`

```ts
public async getAllUsers(req: Request, res: Response)
```

- **Route**: `GET /api/users`
- **Purpose**: Retrieve a list of all users in the system.
- **Authentication Required**: Yes (Super Admin)
- **Responses**:
  - `200 OK`: Array of user objects.
  - `500 Internal Server Error`: On failure to retrieve users.

---

### Method: `updateUserRole`

```ts
public async updateUserRole(req: Request, res: Response)
```

- **Route**: `PUT /api/users/:userId/role`
- **Purpose**: Update the role of a specified user.
- **Authentication Required**: Yes (Super Admin)
- **Path Parameters**:
  - `userId`: The ID of the user to update.
- **Request Body**:
  ```json
  {
    "role": "admin"
  }
  ```
- **Responses**:
  - `200 OK`: Returns the updated user object.
  - `500 Internal Server Error`: On failure to update the role.

---

## Error Handling

Each method:
- Wraps logic in a `try/catch` block to handle exceptions.
- Logs meaningful errors using `logger.error(...)`.
- Returns appropriate HTTP status codes and error messages.