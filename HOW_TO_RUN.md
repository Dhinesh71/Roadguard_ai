# RoadGuard AI - Project Setup & Run Guide

Welcome to the **Smart Road Hazard Intelligence System**. This platform uses a decoupled architecture with a React (Vite) frontend and a Python (FastAPI + YOLOv8) backend. 

Follow these exact steps to start the platform on your local machine.

---

## 🛠️ System Prerequisites

Ensure you have the following installed on your PC:
1. **Node.js** (v18 or higher recommended) - For running the React frontend.
2. **Python** (v3.9 or higher recommended) - For running the AI backend.
3. **Database Setup** (Supabase Account) - For backend database persistence.
4. **Google Maps Platform** API Key - For the interactive map interface.

---

## 🚀 Part 1: Starting the AI Backend (FastAPI)

The backend handles AI processing, database connections, and the endpoints.

1. **Open a new Terminal / PowerShell** and navigate to the backend directory:
   ```cmd
   cd E:\srm-online-hackathon\roadguard-backend
   ```

2. **Create a Virtual Environment** (If you haven't already):
   ```cmd
   python -m venv venv
   ```

3. **Activate the Virtual Environment**:
   - On Windows PowerShell:
     ```cmd
     .\venv\Scripts\Activate.ps1
     ```
   - On Mac/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install Python Dependencies**:
   ```cmd
   pip install -r requirements.txt
   ```
   *(Note: This installs FastAPI, Uvicorn, Supabase, Ultralytics YOLOv8, etc.)*

5. **Configure Environment Variables**:
   Open the `.env` file located in `roadguard-backend/.env` and add your database credentials:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_KEY="your-anon-api-key"
   ```

6. **Run the Server**:
   ```cmd
   uvicorn main:app --reload --port 8000
   ```
   ✅ *The backend API is now running at `http://localhost:8000`.*
   *(You can visit `http://localhost:8000/docs` to see the interactive Swagger UI).*

---

## 💻 Part 2: Starting the Frontend (React Vite)

The frontend provides the user interface for reporting hazards, viewing maps, and accessing admin controls.

1. **Open a SECOND Terminal / PowerShell** (Keep the backend running) and navigate to the frontend directory:
   ```cmd
   cd E:\srm-online-hackathon\roadguard-frontend
   ```

2. **Install Node.js Modules**:
   ```cmd
   npm install
   ```

3. **Configure Environment Variables**:
   (Optional) Open the `.env` file located in `roadguard-frontend/.env` and add any necessary frontend keys. The map is fully open-source via OpenStreetMap and does not require an API key!


4. **Start the Development Server**:
   ```cmd
   npm run dev -- --port 3000
   ```
   ✅ *The frontend UI is now running at `http://localhost:3000`.*

---

## 🗄️ Part 3: Database Setup Guide (Supabase)

If you wish to stop using the mock endpoints and switch to real live data, you must configure your Supabase:

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Go to the SQL Editor in your Supabase dashboard.
3. Open the `roadguard-backend/db_schema.sql` file provided in this repository.
4. Copy all the contents of `db_schema.sql` and run it in the Supabase SQL editor. This will instantly build the `profiles`, `hazard_reports`, `repair_records`, and `leaderboard` tables.

---

## 🛑 How to Stop the Project
When you are done testing, simply go to both of your terminal windows and press `CTRL + C` on your keyboard to shut down the servers safely.

//update

Step 1: Open Your Terminal
You will need two separate terminals running at the same time: one for the Python Backend API, and one for the React Frontend UI.

Step 2: Start the AI Backend (Terminal 1)
Open your first PowerShell window and navigate to the backend folder:

powershell
cd E:\srm-online-hackathon\roadguard-backend
Activate the virtual environment (this contains the isolated python libraries like FastAPI and YOLOv8):

powershell
.\venv\Scripts\Activate.ps1
Run the Server:

powershell
uvicorn main:app --reload --port 8000
✅ Leave this terminal open. The backend is now alive at http://localhost:8000/docs.

Step 3: Start the React Frontend (Terminal 2)
Open a second PowerShell window and navigate to the frontend folder:

powershell
cd E:\srm-online-hackathon\roadguard-frontend
Run the Development Server:

powershell
npm run dev -- --port 3000
✅ Leave this terminal open. The web app is now ready at http://localhost:3000.