# Backend Setup Guide

The backend handles the server logic, JWT authentication cookies, PostgreSQL database connections, and Zod input validation.

## Prerequisites

Make sure you have the following installed on your system:
* Node.js (v18+) - Required for Node runtime
* PostgreSQL Database (running locally or remotely)
* Git

*Optional alternative runtime:* Bun (v1.1+)

## Setup Steps

1. Install Dependencies:
   ```bash
   npm install
   
   # Or if using Bun
   bun install
   ```

2. Configure Environment Variables:
   Create a `.env` file in the `backend/` directory by copying `.env.example` (or creating a new one):
   ```env
   NODE_ENV=development
   PORT=5000
   CORS_ORIGIN="http://localhost:3000"
   DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/postgres
   ACCESS_TOKEN_SECRET="your-super-secret-jwt-key"
   ```
   Replace `YOUR_DB_PASSWORD` with your local PostgreSQL user password.

3. Sync the Database Schema:
   Push the Drizzle schema definitions directly to your PostgreSQL database:
   ```bash
   npx drizzle-kit push
   
   # Or if using Bun
   bunx drizzle-kit push
   ```

4. Seed the Database:
   Populate the database with initial administrators, users, stores, and ratings:
   ```bash
   npm run seed
   
   # Or if using Bun
   bun run seed:bun
   ```

5. Start the Backend Server:
   ```bash
   npm run dev
   
   # Or if using Bun
   bun run dev:bun
   ```
   The backend server will launch on http://localhost:5000.

## Default Seeded Accounts

The database seeding command creates test accounts with the default password Password123!:

| Role | Email | Password | Name | Description |
| :--- | :--- | :--- | :--- | :--- |
| System Administrator | admin@test.com | Password123! | Aarav Sharma | Access to admin panel, metrics, and user/store creation. |
| Store Owner 1 | owner1@test.com | Password123! | Rajesh Kumar | Associated with Delhi Spice Bazaar. |
| Store Owner 2 | owner2@test.com | Password123! | Priya Patel | Associated with Bengaluru Tech Hub. |
| Store Owner 3 | owner3@test.com | Password123! | Amit Singh | Associated with Jaipur Royal Crafts. |
| Store Owner 4 | owner4@test.com | Password123! | Sanjay Verma | Active Store Owner with no store assigned (Unassigned). |
| Normal Users (15 accounts) | user1@test.com to user15@test.com | Password123! | Rohan Mehta, Sneha Reddy, etc. | Standard customer accounts for submitting store reviews. |
