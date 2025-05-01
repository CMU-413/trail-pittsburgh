# Delete and Reset Data

This SQL script is designed to safely remove all existing data from the system in the proper dependency order and reset all auto-incrementing sequences. This is particularly useful during testing, development resets, or preparing a clean environment.

---

## Table Dependency Overview

**Data deletion must follow this dependency hierarchy:**

1. **Issue** — Most dependent (e.g., depends on `Trail`)
2. **Trail** — Depends on `Park`
3. **Park** — Root entity for trail system
4. **User** — Can be reset last; not dependent on park data but crucial for admin access

---

## SQL Script

### Step 1: Delete from the most dependent table

```sql
DELETE FROM "public"."Issue";
ALTER SEQUENCE "Issue_issue_id_seq" RESTART WITH 1;
```

### Step 2: Delete all trails (dependent on parks)

```sql
DELETE FROM "public"."Trail";
ALTER SEQUENCE "Trail_trail_id_seq" RESTART WITH 1;
```

### Step 3: Delete all parks (independent root)

```sql
DELETE FROM "public"."Park";
ALTER SEQUENCE "Park_park_id_seq" RESTART WITH 1;
```

---

## User Table Management

The `User` table stores authentication and profile details for users, typically integrated via OAuth. During a full system reset, you may optionally clear this table, but special attention is needed to ensure administrative access is restored afterward.

### Step 4 (Optional): Delete All Users

```sql
DELETE FROM "public"."User";
ALTER SEQUENCE "User_user_id_seq" RESTART WITH 1;
```

---

## Restoring Super Admin Access After OAuth Login

Since user accounts are created automatically via OAuth (e.g., Google Sign-In), do **not** manually insert admin records.

1. **Log into the system** using the desired admin email (e.g., `admin@example.com`).
2. Once the user record is created via OAuth, connect to the **Google Cloud Database Editor**.
3. Run the following query to promote that user to super admin:

```sql
UPDATE "public"."User"
SET role = 'ROLE_SUPERADMIN'
WHERE email = 'admin@example.com';
```

> **Important**: Only perform this update on a known, secure email. Misuse may grant administrative access to unauthorized users.
