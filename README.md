# ShareHub Backend (FastAPI)

FastAPI backend with Google Sign-In token verification and PostgreSQL-ready models for users and listings.

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment values:

   - Copy `.env.example` to `.env`.
   - `GOOGLE_CLIENT_ID` must match the client id used in frontend.
   - `FRONTEND_ORIGIN` should match your frontend URL.
   - `DATABASE_URL` should point to your PostgreSQL instance.

   Default local value:

   ```
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/sharehub
   ```

4. Optional: start PostgreSQL quickly via Docker:

   ```bash
   docker compose up -d
   ```

5. Run API:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 4000
   ```

API runs at `http://localhost:4000`.

## Endpoints

- `GET /api/health`
- `POST /api/auth/google`
  - body: `{ "credential": "<google_id_token>" }`
  - verifies Google token
  - upserts user in `users` table
  - returns verified user profile

## Current Data Model

- `users`
- `listings`

Tables are created on startup for development. Move to Alembic migrations before production.
