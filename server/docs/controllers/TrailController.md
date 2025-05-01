# TrailController Documentation

The `TrailController` handles HTTP endpoints related to trail records. It relies on the `TrailService` to perform all business logic and database operations. This controller supports operations to fetch, create, update, and delete trails, and to retrieve trails linked to specific parks.

## Class: `TrailController`

### Constructor

```ts
constructor(trailService: TrailService)
```

- Initializes the controller with an instance of `TrailService`.
- Binds all controller methods (`this.method = this.method.bind(this)`) for correct `this` context in route handlers.

---

### Method: `getAllTrails`

```ts
public async getAllTrails(req: Request, res: Response)
```

- **Route**: `GET /api/trails`
- **Purpose**: Retrieve all trails in the system.
- **Responses**:
  - `200 OK`: Returns a list of all trails.
  - `500 Internal Server Error`: On failure to retrieve the trails.

---

### Method: `getTrail`

```ts
public async getTrail(req: Request, res: Response)
```

- **Route**: `GET /api/trails/:trailId`
- **Purpose**: Retrieve a single trail by its ID.
- **Path Parameters**:
  - `trailId`: The ID of the trail to retrieve.
- **Responses**:
  - `200 OK`: Returns the trail object.
  - `404 Not Found`: If the trail is not found.
  - `500 Internal Server Error`: On failure to retrieve the trail.

---

### Method: `createTrail`

```ts
public async createTrail(req: Request, res: Response)
```

- **Route**: `POST /api/trails`
- **Purpose**: Create a new trail entry.
- **Request Body**:
  - `name` (string): Required — Name of the trail.
  - `parkId` (number): Required — ID of the park this trail belongs to.
  - `isActive` (boolean, optional): Whether the trail is active.
  - `isOpen` (boolean, optional): Whether the trail is currently open to the public.
- **Responses**:
  - `201 Created`: Trail successfully created, returns the new trail.
  - `500 Internal Server Error`: On creation failure.

---

### Method: `updateTrail`

```ts
public async updateTrail(req: Request, res: Response)
```

- **Route**: `PUT /api/trails/:trailId`
- **Purpose**: Update an existing trail.
- **Path Parameters**:
  - `trailId`: ID of the trail to update.
- **Request Body**:
  - `name` (string, optional): Updated trail name.
  - `isOpen` (boolean, optional): Updated open status.
  - `isActive` (boolean, optional): Updated active status.
- **Responses**:
  - `200 OK`: Updated trail returned.
  - `404 Not Found`: Trail not found.
  - `500 Internal Server Error`: On update failure.

---

### Method: `deleteTrail`

```ts
public async deleteTrail(req: Request, res: Response)
```

- **Route**: `DELETE /api/trails/:trailId`
- **Purpose**: Delete an existing trail by ID.
- **Path Parameters**:
  - `trailId`: ID of the trail to delete.
- **Responses**:
  - `204 No Content`: Trail successfully deleted.
  - `404 Not Found`: Trail not found.
  - `500 Internal Server Error`: On deletion failure.

---

### Method: `getTrailsByPark`

```ts
public async getTrailsByPark(req: Request, res: Response)
```

- **Route**: `GET /api/trails/park/:parkId`
- **Purpose**: Retrieve all trails that belong to a specific park.
- **Path Parameters**:
  - `parkId`: ID of the park to retrieve trails for.
- **Responses**:
  - `200 OK`: Returns a list of trails under the given park.
  - `500 Internal Server Error`: On failure to retrieve the trails.

---

## Error Handling

Each method:
- Uses a `try/catch` block to gracefully handle exceptions.
- Logs errors using `logger.error(...)` with context-specific messages.
- Returns proper HTTP status codes and structured JSON error messages.