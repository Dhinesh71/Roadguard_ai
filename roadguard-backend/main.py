import os
import random
from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid
import datetime

load_dotenv()

app = FastAPI(title="RoadGuard AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Setup
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://xyzcompany.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "public-anon-key")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Try to load YOLOv8 (Will download yolov8n.pt on first run)
try:
    from ultralytics import YOLO
    model = YOLO('yolov8n.pt') # Using generic nano model for demonstration. You would use a custom trained model for potholes
    YOLO_AVAILABLE = True
except Exception as e:
    YOLO_AVAILABLE = False
    print("YOLO not available:", e)

@app.get("/")
def read_root():
    return {"message": "Welcome to RoadGuard AI API"}

def calculate_severity(hazard_type: str, box_area: float, road_type: str = "local"):
    # Mock severity calculation
    # In reality, you would map box_area (pixel area) relative to image size, or real world estimation
    base_score = 5
    if hazard_type == "Pothole":
        base_score += 2
    elif hazard_type == "missing manhole cover":
        base_score += 4
    
    if road_type == "highway":
        base_score += 2
        
    score = min(max(base_score + random.randint(-1, 2), 1), 10)
    
    level = "Low"
    if score >= 7:
        level = "High"
    elif score >= 4:
        level = "Medium"
        
    return score, level

def estimate_repair_cost(severity_score: int, hazard_type: str):
    if severity_score >= 8:
        return 5000.0
    elif severity_score >= 5:
        return 3500.0
    else:
        return 2000.0

@app.post("/api/hazard/report")
async def report_hazard(
    reporter_id: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    road_type: str = Form("local"),
    file: UploadFile = File(...)
):
    try:
        # 1. AI Detection
        hazard_type = "Pothole" # Default fallback
        confidence = 0.85
        box_area = 1000

        image_bytes = await file.read()
        
        # In a real app we'd pass image_bytes to YOLO
        if YOLO_AVAILABLE:
            pass # Actual YOLO inference would go here, parse boxes, etc.
            # Example: results = model(image_bytes)
            # detect hazard_type etc.
            # We mock the prediction for demonstration as a custom model is required for civic hazards
            hazard_classes = ["Pothole", "Broken road edge", "Waterlogging", "Missing manhole cover", "Road cracks"]
            hazard_type = random.choice(hazard_classes)
            confidence = round(random.uniform(0.75, 0.98), 2)
        
        # 2. Calculate Severity
        severity_score, severity_level = calculate_severity(hazard_type, box_area, road_type)
        
        # 3. Upload Image to Supabase Storage (Mocking URL if storage is not setup)
        # file_path = f"public/{uuid.uuid4()}_{file.filename}"
        # res = supabase.storage.from_("hazards").upload(file_path, image_bytes)
        # image_url = supabase.storage.from_("hazards").get_public_url(file_path)
        image_url = "https://via.placeholder.com/400x300.png?text=Hazard+Image"
        
        estimated_cost = estimate_repair_cost(severity_score, hazard_type)
        
        # 4. Save to Database
        data = {
            "reporter_id": reporter_id,
            "image_url": image_url,
            "latitude": latitude,
            "longitude": longitude,
            "hazard_type": hazard_type,
            "confidence_score": confidence,
            "severity_score": severity_score,
            "severity_level": severity_level,
            "status": "Pending",
            "estimated_cost": estimated_cost
        }
        
        # NOTE: Wrap in try/except if supabase falls back
        # response = supabase.table("hazard_reports").insert(data).execute()
        
        # Give points to user
        # supabase.rpc("increment_points", {"user_id": reporter_id, "amount": 10}).execute()
        
        # Return Mocked response if supabase is not properly configured by user yet
        data["id"] = str(uuid.uuid4())
        
        return {
            "status": "success",
            "message": "Hazard reported successfully",
            "data": data,
            "ai_analysis": {
                "Hazard detected": hazard_type,
                "Confidence": confidence,
                "Severity score": severity_score,
                "Risk level": severity_level
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/hazards")
def get_hazards():
    # Fetch from Supabase
    # response = supabase.table("hazard_reports").select("*").execute()
    # return response.data
    
    # Returning mock data
    return [
        {
            "id": "1",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "hazard_type": "Pothole",
            "severity_level": "High",
            "severity_score": 8,
            "status": "Pending",
            "image_url": "https://via.placeholder.com/400x300.png?text=Pothole"
        },
        {
            "id": "2",
            "latitude": 13.0012,
            "longitude": 80.2565,
            "hazard_type": "Waterlogging",
            "severity_level": "Medium",
            "severity_score": 5,
            "status": "Inspection",
            "image_url": "https://via.placeholder.com/400x300.png?text=Waterlogging"
        }
    ]

@app.get("/api/leaderboard")
def get_leaderboard():
    # response = supabase.table("leaderboard").select("*").limit(10).execute()
    # return response.data
    return [
        {"id": "user1", "name": "Karthik R", "city": "Chennai", "total_points": 1450, "verified_reports": 45, "rank": 1},
        {"id": "user2", "name": "Ananya S", "city": "Coimbatore", "total_points": 1200, "verified_reports": 38, "rank": 2},
        {"id": "user3", "name": "Muthu K", "city": "Madurai", "total_points": 950, "verified_reports": 22, "rank": 3}
    ]

@app.get("/api/predict/risk")
def get_predicted_risks():
    # Uses random forest logic (mocked here) based on traffic, rainfall, past reports
    return [
        {"road_name": "Anna Salai", "risk_level": "High", "reason": "High traffic, frequent potholes", "lat": 13.0604, "lng": 80.2625},
        {"road_name": "OMR Road", "risk_level": "Medium", "reason": "Moderate traffic patterns", "lat": 12.9231, "lng": 80.2307},
        {"road_name": "GST Road", "risk_level": "High", "reason": "Heavy rainfall predictions combined with weak asphalt", "lat": 12.9734, "lng": 80.1477}
    ]

# Keep server running
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
