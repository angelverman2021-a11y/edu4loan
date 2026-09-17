# Edu4Loan Deployment Guide

This guide provides step-by-step instructions for deploying Edu4Loan to production. It covers cloud hosting options (including 100% free-tier setups), environment configurations, database provisioning, initial data seeding, and containerized deployment with Docker.

---

## Architecture Overview

Edu4Loan consists of three main components:
1. **Frontend**: React 18 + Vite + Tailwind CSS Single-Page Application (SPA).
2. **Backend API**: Node.js + Express + TypeScript REST API.
3. **Database**: MongoDB (Local or MongoDB Atlas cloud cluster).

---

## Quick Reference: Recommended Cloud Stacks

| Deployment Target | Frontend Hosting | Backend Hosting | Database | Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Option A (Recommended)** | Vercel (Free) | Render / Railway (Free) | MongoDB Atlas (Free M0) | Free |
| **Option B (All-in-One)** | Render Static Site | Render Web Service | MongoDB Atlas (Free M0) | Free |
| **Option C (Self-Hosted/VPS)** | Docker + NGINX | Docker Container | Docker MongoDB Container | VPS cost |

---

## Step 1: Set Up MongoDB Atlas (Database)

Edu4Loan requires a MongoDB instance. The free M0 tier on MongoDB Atlas provides 512MB of storage, which is more than enough for all authoritative schemes, banks, institutions, and documents.

1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a new free cluster (M0 Sandbox).
3. Under **Security > Database Access**:
   - Create a database user (e.g., `edu4loan_admin`) and a strong password.
4. Under **Security > Network Access**:
   - Add IP address `0.0.0.0/0` (Allow access from anywhere) so cloud hosts like Vercel and Render can connect.
5. Under **Database > Deployment > Connect**:
   - Select **Drivers** (Node.js).
   - Copy the connection string, which looks like:
     ```
     mongodb+srv://edu4loan_admin:<password>@cluster0.abcde.mongodb.net/edu4loan?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password and ensure the database name is `edu4loan`.

---

## Option A: Vercel (Frontend) + Render (Backend)

This is the recommended free-tier setup offering fast global CDN caching for the frontend and an isolated Node.js environment for the API.

### 1. Deploy Backend on Render

1. Sign in to [render.com](https://render.com) and click **New > Web Service**.
2. Connect your GitHub repository (`edu4loan`).
3. Configure the service:
   - **Name**: `edu4loan-backend`
   - **Root Directory**: Leave blank (monorepo root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: `mongodb+srv://edu4loan_admin:<password>@cluster0.abcde.mongodb.net/edu4loan?retryWrites=true&w=majority`
   - `JWT_SECRET`: Generate a random 32-character string
   - `FRONTEND_URL`: `https://your-frontend.vercel.app` (or `*` temporarily during setup)
5. Click **Create Web Service**.
6. Once deployed, copy your backend URL (e.g., `https://edu4loan-backend.onrender.com`).
7. Verify the deployment by visiting `https://edu4loan-backend.onrender.com/api/health`. You should receive:
   ```json
   { "status": "ok", "service": "Edu4Loan API" }
   ```

### 2. Ingest Production Data into MongoDB

After the database is connected, populate the banks, schemes, government initiatives, and document taxonomy:

Run the production seed script from your local machine pointing to your Atlas database:

```bash
cd backend
MONGODB_URI="your_atlas_connection_string" npm run seed:production
MONGODB_URI="your_atlas_connection_string" npm run seed:documents
MONGODB_URI="your_atlas_connection_string" npm run seed:government
```

Alternatively, open the **Render Shell** tab and run:
```bash
cd backend && npm run seed:production && npm run seed:documents && npm run seed:government
```

### 3. Deploy Frontend on Vercel

1. Sign in to [vercel.com](https://vercel.com) and click **Add New > Project**.
2. Import your GitHub repository (`edu4loan`).
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add **Environment Variable**:
   - `VITE_API_URL`: `https://edu4loan-backend.onrender.com/api`
5. Click **Deploy**.
6. The `frontend/vercel.json` file in this repository automatically handles Single-Page Application (SPA) client-side routing rewrites so refreshes on `/finder`, `/calculator`, or `/compare` will not return 404 errors.

---

## Option B: 1-Click Monorepo Blueprint on Render

A `render.yaml` Infrastructure-as-Code file is included in the root directory.

1. In Render, go to **Blueprints > New Blueprint Instance**.
2. Select your repository. Render will automatically parse `render.yaml` and create:
   - Web service: `edu4loan-backend`
   - Static site: `edu4loan-frontend`
3. Enter your `MONGODB_URI` when prompted.
4. Click **Apply**. Both the backend API and frontend static site will build and link automatically.

---

## Option C: Docker & Docker Compose (Self-Hosted VPS)

To host the complete stack on any Virtual Private Server (AWS EC2, DigitalOcean, Linode, Hetzner, or local machine):

### 1. Requirements
- Docker (v20+)
- Docker Compose (v2+)

### 2. Launch Stack
Run the following command from the repository root:

```bash
docker-compose up -d --build
```

This starts three linked containers:
- `edu4loan-mongodb`: MongoDB 6.0 on port 27017 with persistent volume.
- `edu4loan-backend`: Express REST API on port 5000.
- `edu4loan-frontend`: NGINX production server serving the React client on port 80 with reverse proxying for `/api`.

### 3. Seed Production Data Inside Container
```bash
docker exec -it edu4loan-backend node backend/src/seeds/seedProduction.js
```

### 4. Verify Stack
- Web Client: Visit `http://your-vps-ip`
- API Health: Visit `http://your-vps-ip/api/health`

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | Application environment | `production` |
| `PORT` | Yes | Listening port | `5000` (or host assigned) |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/edu4loan` |
| `JWT_SECRET` | Yes | Secret key for signing auth tokens | `secure_random_string_32_chars` |
| `JWT_EXPIRES_IN`| No | Token expiry duration | `7d` |
| `FRONTEND_URL` | Yes | Allowed CORS origins (comma-separated) | `https://edu4loan.vercel.app` |

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Yes | Full URL to backend REST API | `https://edu4loan-backend.onrender.com/api` |

---

## Common Deployment Troubleshooting

### 1. CORS Errors in Browser Console
- **Symptom**: `Access to fetch at ... from origin ... has been blocked by CORS policy`.
- **Fix**: Update the backend `FRONTEND_URL` environment variable to match your exact frontend domain (including `https://`, without a trailing slash). For example: `https://edu4loan.vercel.app`.

### 2. Page Refresh Returns 404 on Frontend
- **Symptom**: Refreshing `/calculator` or `/schemes` shows "Page Not Found".
- **Fix**: The frontend uses client-side routing (`react-router-dom`). Ensure the rewrite rule routes all traffic to `index.html`.
  - Vercel: Configured via `frontend/vercel.json`.
  - Netlify / Cloudflare: Configured via `frontend/public/_redirects`.
  - NGINX: Configured via `try_files $uri $uri/ /index.html;` in `frontend/nginx.conf`.

### 3. Backend Crashing with "FATAL: JWT_SECRET required"
- **Symptom**: Deployment log shows error and container exits.
- **Fix**: In production (`NODE_ENV=production`), Edu4Loan strictly forbids default fallback secrets. Ensure `JWT_SECRET` is defined in your cloud host environment variables.

### 4. Cold Starts on Free Tier Hosts
- **Symptom**: First API request takes 30-50 seconds after inactivity.
- **Note**: Render free-tier web services spin down after 15 minutes of inactivity. For zero-latency uptime, configure an external uptime monitor (e.g., UptimeRobot, Cron-Job.org) to ping `https://your-backend.onrender.com/api/health` every 10 minutes.
