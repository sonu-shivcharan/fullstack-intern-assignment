# Store Rating Web Application

A full-stack web application that allows users to register, sign in, search registered stores, and submit/modify store ratings from 1 to 5 stars. The system features a unified sign-in flow with role-based dashboard screens for:

1. System Administrators (Manage stores & users, view platform metrics)
2. Store Owners (Monitor store stats, view customer feedback metrics, average ratings)
3. Normal Users (Discover stores, submit & update ratings/reviews)

**Note**: Ignored 1 requirement about min length of name field to be 20 for development purpose so that I can create test data easily . Instead used min length 3 in backend and frontend.

## Follow project Setup Instructions

### [Frontend Setup ](frontend/README.md)

### [Backend Setup ](backend/README.md)

## Using Docker Compose

### Prerequisites

Make sure Docker is installed and running on your system.

### Setup

1. Clone the repository.
2. Navigate to the root directory of the project.
3. Run the following command:

```bash
docker compose up --build
```

This will build and start all required services:

- PostgreSQL Database
- Backend API
- Frontend Application

### Access the Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## Database Schema Design

The application uses PostgreSQL with **Drizzle ORM** for schema definition and migrations. The schema definitions can be found in the [backend/src/db/schema](backend/src/db/schema) folder.

### Table Details

#### 1. Users ([users.ts](backend/src/db/schema/users.ts))

Holds record of all users (Administrators, Store Owners, and Normal Users) registered on the platform.

| Column       | Type             | Constraints                               | Description                                     |
| :----------- | :--------------- | :---------------------------------------- | :---------------------------------------------- |
| `id`         | `integer`        | Primary Key, Generated Always As Identity | Unique auto-incrementing identifier             |
| `name`       | `varchar(60)`    | Not Null                                  | User's full name                                |
| `address`    | `varchar(400)`   | Not Null                                  | User's physical address                         |
| `email`      | `varchar(255)`   | Not Null, Unique                          | User's unique email address (login credentials) |
| `role`       | `user_role` enum | Not Null, Default: `'USER'`               | Roles: `'ADMIN'`, `'USER'`, or `'STORE_OWNER'`  |
| `password`   | `text`           | Not Null                                  | Securely hashed password string                 |
| `created_at` | `timestamp`      | Not Null, Default: `now()`                | Record creation timezone timestamp              |
| `updated_at` | `timestamp`      | Not Null, Default: `now()`                | Last modification timezone timestamp            |

#### 2. Stores ([stores.ts](backend/src/db/schema/stores.ts))

Holds store information. Each store must be owned by exactly one user with the `'STORE_OWNER'` role.

| Column       | Type           | Constraints                               | Description                               |
| :----------- | :------------- | :---------------------------------------- | :---------------------------------------- |
| `id`         | `integer`      | Primary Key, Generated Always As Identity | Unique auto-incrementing identifier       |
| `name`       | `varchar(60)`  | Not Null                                  | Name of the store                         |
| `address`    | `varchar(400)` | Not Null                                  | Physical location of the store            |
| `email`      | `varchar(255)` | Not Null, Unique                          | Official store contact email              |
| `owner_id`   | `integer`      | Not Null, Unique, FK (`users.id`)         | References the user ID who owns the store |
| `created_at` | `timestamp`    | Not Null, Default: `now()`                | Record creation timezone timestamp        |
| `updated_at` | `timestamp`    | Not Null, Default: `now()`                | Last modification timezone timestamp      |

#### 3. Ratings & Reviews ([ratings.ts](backend/src/db/schema/ratings.ts))

Stores the ratings (1-5 stars) and review comment text submitted by users for stores.

| Column       | Type           | Constraints                               | Description                                  |
| :----------- | :------------- | :---------------------------------------- | :------------------------------------------- |
| `id`         | `integer`      | Primary Key, Generated Always As Identity | Unique auto-incrementing identifier          |
| `rating`     | `integer`      | Not Null                                  | Star rating score (value between 1 and 5)    |
| `review`     | `varchar(255)` | Nullable                                  | Optional written text review                 |
| `user_id`    | `integer`      | Not Null, FK (`users.id`)                 | References the user who submitted the rating |
| `store_id`   | `integer`      | Not Null, FK (`stores.id`)                | References the store being rated             |
| `created_at` | `timestamp`    | Not Null, Default: `now()`                | Record creation timezone timestamp           |
| `updated_at` | `timestamp`    | Not Null, Default: `now()`                | Last modification timezone timestamp         |

_Note: There is a composite unique constraint (`user_store_rating_unique`) on `(store_id, user_id)` to enforce that a user can only rate/review a given store once._

## Backend API Routes

The backend API is built using Node.js/Express. Below is a list of the available endpoints categorized by their primary resource:

### Authentication (`/api/auth`)

- **`POST` `/api/auth/users/signup`** - Registers a new normal user (with `USER` role).
- **`POST` `/api/auth/signin`** - Authenticates user credentials (for users, store owners, and administrators) accessToken validity 1 hour.
- **`GET` `/api/auth/me`** - _(Protected)_ Retrieves details of the currently logged-in user.
- **`POST` `/api/auth/logout`** - _(Protected)_ Logs out the user and clears active session tokens.
- **`PATCH` `/api/auth/change-password`** - _(Protected)_ Updates the current user's password.

### Stores (`/api/stores`)

- **`GET` `/api/stores`** - _(Protected)_ Retrieves all stores in the database (supports searching, sorting, filtering, and pagination).
- **`GET` `/api/stores/:storeId`** - _(Protected)_ Retrieves details of a specific store by its ID.

### Ratings & Reviews (`/api/ratings`)

- **`GET` `/api/ratings/:storeId`** - _(Protected, USER/STORE_OWNER)_ Retrieves all ratings and reviews submitted for a specific store.
- **`POST` `/api/ratings/:storeId`** - _(Protected, USER/STORE_OWNER)_ Submits a rating (1-5 stars) and review comments for a specific store.
- **`PATCH` `/api/ratings/:ratingId`** - _(Protected, USER/STORE_OWNER)_ Modifies/updates an existing rating and review by its rating ID.

### Store Owner Dashboard (`/api/store-owner`)

- **`GET` `/api/store-owner/dashboard`** - _(Protected, STORE_OWNER)_ Retrieves performance metrics (average rating, review counts, star distribution) for the store owner's assigned store.
- **`GET` `/api/store-owner/users`** - _(Protected, STORE_OWNER)_ Retrieves a list of users who have reviewed or rated the owner's store.

### Admin Dashboard & Management (`/api/admin`)

- **`GET` `/api/admin/dashboard`** - _(Protected, ADMIN)_ Retrieves system-wide stats (total users, stores, and ratings) for the administrator dashboard.
- **`GET` `/api/admin/users`** - _(Protected, ADMIN)_ Retrieves all users registered on the platform.
- **`GET` `/api/admin/users-without-store`** - _(Protected, ADMIN)_ Retrieves all store owners who have not yet been assigned a store.
- **`POST` `/api/admin/users`** - _(Protected, ADMIN)_ Creates a new user with a specified role (`USER`, `STORE_OWNER`, or `ADMIN`).
- **`POST` `/api/admin/stores`** - _(Protected, ADMIN)_ Creates a new store and assigns an available store owner to it.

---

## Screenshots

### Normal User Dashboard

![Normal User Dashboard](screenshots/users-dashboard.png)

### Store Details & Review Submission

![Store Details & Review Submission](screenshots/store-details.png)

### Store Owner Dashboard

![Store Owner Dashboard](screenshots/owner-dashboard.png)

### System Administrator Dashboard

![System Administrator Dashboard](screenshots/admin-dashboard.png)

### Admin Users Management

![Admin Users Management](screenshots/admin-users.png)

### Admin Stores Management

![Admin Stores Management](screenshots/admin-stores.png)

---
