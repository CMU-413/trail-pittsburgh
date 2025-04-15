# ParkController Documentation

The `ParkController` is responsible for handling all HTTP requests related to parks. It delegates business logic to the `ParkService` and ensures appropriate HTTP responses are returned based on the results.

---

## Constructor

### `constructor(parkService: ParkService)`

Initializes the controller with a reference to the `ParkService`.

---

## Methods

### `getPark(req: Request, res: Response)`

Retrieve a specific park by its ID.

**Route Parameter:**
- `id` (number): The ID of the park.

**Responses:**
- `200 OK`: Returns the park object.
- `404 Not Found`: Park with the given ID does not exist.

---

### `getAllParks(req: Request, res: Response)`

Retrieve all parks in the system.

**Responses:**
- `200 OK`: Returns an array of all park objects.

---

### `createPark(req: Request, res: Response)`

Create a new park using the request body data.

**Request Body:**
- `name` (string, required): Name of the park.
- `county` (string, required): County where the park is located.
- `owner_id` (number, optional): ID of the owner associated with the park.
- `is_active` (boolean, optional): Status flag (default is `true` if not provided).

**Responses:**
- `201 Created`: Park successfully created.
- `400 Bad Request`: Missing required `name` or `county`.

---

### `updatePark(req: Request, res: Response)`

Update an existing park by its ID.

**Route Parameter:**
- `parkId` (number): ID of the park to update.

**Request Body:**
- `name` (string, optional): New name for the park.
- `county` (string, optional): New county for the park.
- `is_active` (boolean, optional): New active status.

**Responses:**
- `200 OK`: Updated park object returned.
- `404 Not Found`: Park with the given ID does not exist.

---

### `deletePark(req: Request, res: Response)`

Delete a specific park by its ID.

**Route Parameter:**
- `id` (number): ID of the park to delete.

**Responses:**
- `204 No Content`: Park successfully deleted.
- `404 Not Found`: Park not found.

---
