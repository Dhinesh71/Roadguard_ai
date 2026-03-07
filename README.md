# RoadGuard AI Setup and Run Instructions

This guide covers everything needed to run the Smart Road Hazard Intelligence System.

## Prerequisites
- Node.js (for React frontend)
- Python 3.8+ (for FastAPI backend)
- API Keys: Supabase URL, Supabase Auth Key, Google Maps API Key

---

## 1. Starting the Backend (FastAPI + YOLOv8)

Open a new terminal window or PowerShell and navigate to the backend folder:
```powershell
cd E:\srm-online-hackathon\roadguard-backend
```

**Step 1: Create and Activate Virtual Environment**
If you haven't already:
```powershell
# Create it
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\Activate.ps1
```

**Step 2: Install Requirements**
```powershell
pip install -r requirements.txt
```

**Step 3: Setup Variables**
Open `.env` in `roadguard-backend` and insert your Supabase details (Required for DB actions to work in production, otherwise it uses mocked responses):
```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"
```

**Step 4: Run the Server**
```powershell
uvicorn main:app --reload --port 8000
```
*The backend API will run at **http://localhost:8000** and docs at **http://localhost:8000/docs**.*

---

## 2. Starting the Frontend (React Vite)

Open **another** new terminal window and navigate to the frontend folder:
```powershell
cd E:\srm-online-hackathon\roadguard-frontend
```

**Step 1: Install Dependencies**
If you haven't already installed them:
```powershell
npm install
```

**Step 2: Setup Variables**
Open `.env` in `roadguard-frontend` and insert your Google Maps API Key:
```env
VITE_GOOGLE_MAPS_API_KEY="AIzaSyYourGoogleMapsApiKeyHere"
```
*(This is required for the hazard map and heatmaps to load).*

**Step 3: Run the Dashboard**
```powershell
npm run dev -- --port 3000
```
*The frontend React app will be live at **http://localhost:3000**.*

---

## Stopping the App

When you're finished, go to both terminals and press `CTRL + C` to stop the servers properly.
