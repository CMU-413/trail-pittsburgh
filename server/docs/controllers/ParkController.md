# ParkController Documentation

The `ParkController` handles HTTP endpoints related to park records. It relies on the `ParkService` to perform all business logic and database operations. This controller supports operations to fetch, create, update, and delete parks.

## Class: `ParkController`

### Constructor

```ts
constructor(parkService: ParkService)
```

- Initializes the controller with an instance of `ParkService`.
- Binds all controller methods (`this.method = this.method.bind(this)`) for correct `this` context in route handlers.

---

### Method: `getPark`

```ts
public async getPark(req: Request, res: Response)
```

- **Route**: `GET /api/parks/:parkId`
- **Purpose**: Retrieve a single park by its ID.
- **Path Parameters**:
  - `parkId`: The ID of the park to retrieve.
- **Responses**:
  - `200 OK`: Returns the park object.
  - `404 Not Found`: If the park is not found.
  - `500 Internal Server Error`: On failure to retrieve the park.

---

### Method: `getAllParks`

```ts
public async getAllParks(req: Request, res: Response)
```

- **Route**: `GET /api/parks`
- **Purpose**: Retrieve all parks in the system.
- **Responses**:
  - `200 OK`: Returns a list of all parks.
  - `500 Internal Server Error`: On failure to retrieve the parks.

---

### Method: `createPark`

```ts
public async createPark(req: Request, res: Response)
```

- **Route**: `POST /api/parks`
- **Purpose**: Create a new park entry.
- **Request Body**:
  - `name` *(string)*: **Required** — Name of the park.
  - `county` *(string)*: **Required** — County where the park is located.
  - `isActive` *(boolean, optional)*: Whether the park is active (defaults to `true`).
- **Validations**:
  - Rejects with `400 Bad Request` if `name` or `county` is missing.
- **Responses**:
  - `201 Created`: Park successfully created, returns the new park.
  - `400 Bad Request`: Missing required fields.
  - `500 Internal Server Error`: On creation failure.

---

### Method: `updatePark`

```ts
public async updatePark(req: Request, res: Response)
```

- **Route**: `PUT /api/parks/:parkId`
- **Purpose**: Update an existing park.
- **Path Parameters**:
  - `parkId`: ID of the park to update.
- **Request Body**:
  - `name` *(string, optional)*: Updated park name.
  - `county` *(string, optional)*: Updated park county.
  - `isActive` *(boolean, optional)*: Updated park status.
- **Responses**:
  - `200 OK`: Updated park returned.
  - `404 Not Found`: Park not found.
  - `500 Internal Server Error`: On update failure.

---

### Method: `deletePark`

```ts
public async deletePark(req: Request, res: Response)
```

- **Route**: `DELETE /api/parks/:parkId`
- **Purpose**: Delete an existing park by ID.
- **Path Parameters**:
  - `parkId`: ID of the park to delete.
- **Responses**:
  - `204 No Content`: Park successfully deleted.
  - `404 Not Found`: Park not found.
  - `500 Internal Server Error`: On deletion failure.

---

## Error Handling

Each method:
- Uses a `try/catch` block to gracefully handle exceptions.
- Logs errors using `logger.error(...)` with context-specific messages.
- Returns proper HTTP status codes and structured JSON error messages.