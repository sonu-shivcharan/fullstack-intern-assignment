# Frontend Setup Guide

The frontend is built with React 19, Vite, TanStack Start/Router, and styled with Tailwind CSS (v4) and ShadcnUI

## Prerequisites

Make sure you have Node.js (v18+) or Bun (v1.1+) installed.

## Setup Steps

1. Install Dependencies:
   ```bash
   # If using Bun
   bun install
   
   # Or using npm
   npm install
   ```

2. Configure Environment Variables (Optional):
   The application defaults to connecting to the backend at http://localhost:5000/api. If you want to specify a different path, create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the Frontend Development Server:
   ```bash
   # If using Bun
   bun run dev
   
   # Or using npm
   npm run dev
   ```
   The frontend dev server will launch on http://localhost:3000. Open http://localhost:3000 in your web browser.

## Running Tests & Checks

```bash
# Typecheck source files
npm run typecheck

# Run formatters
npm run format

# Run linter
npm run lint
```
