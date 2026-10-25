# Where Is My Cargo

Cargo pooling and virtual rake-planning prototype built with React, TypeScript, TanStack Start, and a small Node.js backend.

## Run locally

```sh
npm install
npm run api
```
In a second terminal, run `npm run dev`. The web app uses port 3000 and proxies `/api/cargo` and `/api/health` to the API on port 3001.

## API endpoints

- `GET /api/health` — backend readiness check.
- `GET /api/cargo` — list saved cargo loads.
- `POST /api/cargo` — validate and persist a load to `backend/data/loads.json`.

Run backend tests with `npm run test:backend`; run app tests with `npm test`; build with `npm run build`.

This is a synthetic demonstration. The sign-in flow is not production authentication; never enter real Aadhaar or other identity data.