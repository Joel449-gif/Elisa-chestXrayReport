# Deployment

## Vercel (free, no credit card)

**URL after setup:** `https://elisa-v2.vercel.app`

### Prerequisites

- A [Vercel account](https://vercel.com/signup) (sign in with GitHub)
- The repo pushed to GitHub

### Setup (one-time)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo (`joel-ai/Elisa-chestXrayReport`)
3. Configure:
   - **Root Directory:** `v2/`
   - **Build Command:** `cd client && npm ci && npm run build` (auto-detected from `vercel.json`)
   - **Output Directory:** `client/dist` (auto-detected)
4. Click **Deploy**

Wait ~2 minutes. Visit the generated URL.

### What happens

```
vercel.json          → routes /api/*  → api/index.py (Python FastAPI)
                     → routes /*      → client/dist/   (React SPA)
```

- Vercel builds the React frontend (`npm run build`)
- Vercel deploys the Python function from `api/index.py`
- The FastAPI app handles `/api/health` and `/api/predict`
- All other routes serve the React SPA (with `/index.html` fallback)

### Updating

Push to GitHub → Vercel auto-redeploys. Or:

```bash
cd v2
npx vercel --prod
```

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Build fails: missing lockfile | `package-lock.json` not committed | Run `npm i` in `client/`, commit the lockfile |
| `/api/health` returns 404 | vercel.json routes wrong | Check `source: "/api/(.*)"` matches |
| `/api/predict` returns 500 | Python dependency missing | Check `api/requirements.txt` has all deps |
| Blank page on root | SPA fallback not working | Check rewrite `{"source": "/(.*)", "destination": "/index.html"}` |
| Cold start on first request | Serverless nature | Normal — ~1-2s delay on first hit after inactivity |

---

## Running locally with Docker

```bash
cd v2
docker compose up --build
```

Visit `http://localhost:8000` (maps host 8000 → container 7860).

---

## Running locally without Docker (development)

```bash
# Terminal 1: Backend
cd v2/server
./run.sh

# Terminal 2: Frontend
cd v2/client
npm run dev
```

Visit `http://localhost:5173` — the Vite dev server proxies `/api` to the FastAPI backend.
