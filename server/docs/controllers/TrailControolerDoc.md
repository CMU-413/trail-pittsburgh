# TrailController Documentation

The `TrailController` manages all HTTP routes related to trail data. It handles incoming requests, communicates with the `TrailService` to perform the necessary business logic, and sends the appropriate HTTP responses.

---

## Constructor

### `constructor(trailService: TrailService)`

Initializes the controller with an instance of the `TrailService`.

---

## Methods

### `getAllTrails(req: Request, res: Response)`

Retrieve all trails from the database.

**Responses:**
- `200 OK`: Returns an array of all trail objects.
- `500 Internal Server Error`: Failed to retrieve trails.

---

### `getTrail(req: Request, res: Response)`

Retrieve a single trail by its ID.

**Route Parameter:**
- `trailId` (number): The ID of the trail.

**Responses:**
- `200 OK`: Returns the trail object.
- `404 Not Found`: If the trail does not exist.
- `500 Internal Server Error`: Failed to retrieve trail.

---

### `createTrail(req: Request, res: Response)`

Create a new trail.

**Request Body:**
- `name` (string): The name of the trail.
- `parkId` (number): The ID of the park this trail belongs to.
- `isActive` (boolean): Whether the trail is active.
- `isOpen` (boolean): Whether the trail is open.

**Responses:**
- `201 Created`: Successfully created the trail.
- `500 Internal Server Error`: Failed to create trail.

---

### `updateTrail(req: Request, res: Response)`

Update the `isOpen` status of a trail.

**Route Parameter:**
- `trailId` (number): ID of the trail to update.

**Request Body:**
- `isOpen` (boolean): New open status of the trail.

**Responses:**
- `200 OK`: Successfully updated the trail status.
- `404 Not Found`: If the trail does not exist.
- `500 Internal Server Error`: Failed to update trail.

---

### `deleteTrail(req: Request, res: Response)`

Delete a specific trail by its ID.

**Route Parameter:**
- `trailId` (number): The ID of the trail to delete.

**Responses:**
- `204 No Content`: Trail successfully deleted.
- `404 Not Found`: Trail not found.
- `500 Internal Server Error`: Failed to delete trail.

---

### `getTrailsByPark(req: Request, res: Response)`

Retrieve all trails associated with a specific park.

**Route Parameter:**
- `parkId` (number): The ID of the park.

**Responses:**
- `200 OK`: Returns an object containing the `parkId` and the list of trails.
- `500 Internal Server Error`: Failed to retrieve trails for the specified park.

---
