# ---- Build stage (React frontend) ----
FROM node:22-alpine AS client-build

WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm ci
COPY client/ .
RUN npm run build

# ---- Build stage (Python backend) ----
FROM python:3.14-slim AS server-build

WORKDIR /app/server
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ .

# ---- Runtime ----
FROM python:3.14-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=client-build /app/client/dist ./client/dist
COPY --from=server-build /app/server ./server

EXPOSE 7860

CMD ["uvicorn", "server.app.main:app", "--host", "0.0.0.0", "--port", "7860"]
