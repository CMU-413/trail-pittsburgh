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
  - `name` _(string)_: **Required** — Name of the park.
  - `county` _(string)_: **Required** — County where the park is located.
  - `minLatitude` _(number)_: **Required** — Minimum latitude of the park boundary.
  - `maxLatitude` _(number)_: **Required** — Maximum latitude of the park boundary.
  - `minLongitude` _(number)_: **Required** — Minimum longitude of the park boundary.
  - `maxLongitude` _(number)_: **Required** — Maximum longitude of the park boundary.
  - `isActive` _(boolean, optional)_: Whether the park is active (defaults to `true`).
- **Validations**:
  - Rejects with `400 Bad Request` if any required field is missing, including name, county, or latitude/longitude values.
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
  - `name` _(string, optional)_: Updated park name.
  - `county` _(string, optional)_: Updated park county.
  - `isActive` _(boolean, optional)_: Updated park status.
  - `minLatitude` _(number, optional)_: Updated minimum latitude.
  - `maxLatitude` _(number, optional)_: Updated maximum latitude.
  - `minLongitude` _(number, optional)_: Updated minimum longitude.
  - `maxLongitude` _(number, optional)_: Updated maximum longitude.
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
