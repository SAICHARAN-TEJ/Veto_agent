# Run Demo Checklist

## 1) Start Backend

```powershell
cd backend
npm install
npm run dev
```

Expected: API server running on `http://localhost:5000`.

Optional (seed sample memory):

```powershell
cd backend
npm run seed
```

## 2) Start Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Expected: frontend running on `http://localhost:5173`.

## 3) Verify Environment

- `frontend/.env` should contain:

```env
VITE_API_BASE=http://localhost:5000
```

- Backend `.env` should include keys as needed (`GROQ_API_KEY`, `HINDSIGHT_API_KEY`).
- If keys are absent, app can still run demo behavior with fallback paths already in code.

## 4) Smoke Test Flow

- Open app.
- Pick a customer.
- Type a repeated failed solution.
- Confirm veto conflict appears.
- Click `Use this suggestion`.
- Send and close ticket.
- Confirm memory write success toast and updated ROI/session counters.

## 5) Build Check (optional)

```powershell
cd frontend
npm run build
```
