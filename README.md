# RoadGuard AI

Welcome to the **Smart Road Hazard Intelligence System**. This platform uses a decoupled architecture with a React (Vite) frontend and a Python (FastAPI + YOLOv8) backend.

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended) - For running the React frontend.
- **Python** (v3.9 or higher recommended) - For running the AI backend.
- **Database Setup** (Supabase Account) - For backend database persistence.

---

## 🚀 Running the Project

You will need two separate terminal windows running at the same time: one for the Backend API, and one for the Frontend UI.

### Part 1: Starting the AI Backend (FastAPI)

1. **Open a Terminal / PowerShell** and navigate to the backend directory:
   ```cmd
   cd roadguard-backend
   ```

2. **Run the auto-start script** (handles venv, dependencies and server automatically):
   ```cmd
   powershell -ExecutionPolicy Bypass -File .\start.ps1
   ```
   > **Alternatively**, double-click `start.bat` in the `roadguard-backend` folder.

   *The backend API is now running at `http://localhost:8000`.*
   *(You can visit `http://localhost:8000/docs` to see the interactive Swagger UI).*

---

### Part 2: Starting the Frontend (React Vite)

The frontend provides the user interface for reporting hazards, viewing maps, and accessing admin controls.

1. **Open a SECOND Terminal / PowerShell** and navigate to the frontend directory:
   ```cmd
   cd roadguard-frontend
   ```

2. **Install Node.js Modules**:
   If you have dependency conflicts, use the `--legacy-peer-deps` flag:
   ```cmd
   npm install --legacy-peer-deps
   ```

3. **Start the Development Server**:
   ```cmd
   npm run dev -- --port 3000
   ```
   *The frontend UI is now running at `http://localhost:3000`.*

---

## 🗄️ Database Setup Guide (Supabase)

If you wish to switch from the local mock endpoints to a real database:

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Go to the SQL Editor in your Supabase dashboard.
3. Open the `roadguard-backend/db_schema.sql` file provided in this repository.
4. Copy all the contents of `db_schema.sql` and run it in the Supabase SQL editor. This will instantly build the necessary tables: `profiles`, `hazard_reports`, `repair_records`, and `leaderboard`.

---

## 🛑 How to Stop the Project

When you are done testing, simply go to both of your terminal windows and press `CTRL + C` on your keyboard to shut down the servers safely.
