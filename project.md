# RoadGuard AI – Smart Road Hazard Intelligence System

## 🌟 Executive Summary

**RoadGuard AI** is a production-quality civic-tech web platform designed to transform how cities monitor, manage, and maintain road infrastructure. Built initially with a focus on Tamil Nadu but scalable across all Indian cities, this platform acts as a comprehensive **Smart City Infrastructure Monitoring System**.

It leverages machine learning and crowdsourcing to solve critical real-world problems:
- Accidents caused by unmonitored potholes.
- Slow and inefficient manual road inspections.
- Poor prioritization of repairs by authorities.
- Lack of contractor accountability for completed work.
- Low citizen engagement in civic maintenance.

---

## 🚀 Core Features

### 1. AI-Powered Hazard Detection
Users can report road hazards simply by uploading an image. The system utilizes a **YOLOv8 Object Detection Model** to process the image and automatically identify:
- **Hazard Type:** Pothole, Broken road edge, Waterlogging, Missing manhole cover, Road cracks.
- **Confidence Score:** Accuracy of the AI prediction.
- **Severity Score (1-10):** Calculated based on the size of the hazard, road type (highway vs. local), and traffic density.
- **Risk Level:** High, Medium, or Low.

### 2. Interactive Public Hazard Map
A live, interactive map powered by **OpenStreetMap** and **Leaflet** displays all reported hazards and works 100% free of API costs.
- **Color-Coded Markers:** Red (High Severity), Orange (Medium), Yellow (Low).
- **Details on Click:** Shows the hazard photo, severity score, reporter profile, and current repair status.

### 3. Gamification & Citizen Engagement
To encourage continuous citizen participation, the platform features a robust gamification system.
- **Points System:** Earn +10 for a valid report, +5 for community verification, +20 when a repair is confirmed, and -5 for false reports.
- **Leaderboard:** Ranks top contributors statewide. The top contributor is recognized as the "Tamil Nadu Road Safety Champion."
- **Public Profiles:** Showcases a user's total points, verified reports, and rank.

### 4. Community Verification
When a contractor marks a repair as completed, nearby users are notified to verify it ("Is this pothole repaired?"). 
- Requires a minimum of 3 "YES" confirmations to officially close the issue. 
- If the majority votes "NO", the repair ticket is automatically reopened.

### 5. Predictive Hazard Risk Analytics
The platform doesn't just react; it predicts. Using a machine learning model, it analyzes historical hazard reports, traffic levels, and weather data (e.g., rainfall) to predict future high-risk zones and displays them as heatmaps for authorities.

### 6. Secret Government & Contractor Admin Panel
A secure dashboard restricted to authorized roles (Moderator, Municipal Officer, Super Admin).
- **Capabilities:** Filter hazards by city/severity, update statuses (Pending ➔ Inspection ➔ Repair Scheduled ➔ Resolved).
- **Contractor Accountability:** Tracks assigned contractors, deadlines, and automatically estimates repair costs based on hazard size (e.g., ₹2000 for Small, ₹5000 for Large).
- **Transparency Dashboard:** Shows constituency-wise statistics on unresolved hazards and average repair times.

---

## 💻 Technology Stack

### Frontend Architecture
- **Framework:** React (Vite)
- **Routing:** React Router DOM
- **Maps:** `@react-google-maps/api`
- **Styling:** Custom Vanilla CSS (Deep blue & Orange accent theme, Mobile Responsive)
- **Icons:** Lucide React

### Backend Architecture
- **Framework:** Python FastAPI
- **AI/ML:** Ultralytics (YOLOv8)
- **Data handling:** NumPy, Scikit-learn, Pillow
- **Concurrency:** Uvicorn ASGI Server

### Database & Storage
- **Provider:** Supabase (PostgreSQL)
- **Authentication:** JWT + Google OAuth (via Supabase)
- **Image Storage:** Supabase Storage buckets

---

## 🗄️ Database Schema Structure

The PostgreSQL database is fully relational and structured as follows:
1. `profiles`: Extends auth.users; tracks name, points, rank, and role.
2. `hazard_reports`: Stores GPS coordinates, AI severity scores, image URLs, and current statuses.
3. `hazard_verifications`: Tracks community votes on completed repairs.
4. `repair_records`: Logs contractor assignments, estimated costs, and deadlines.
5. `road_health_scores`: Aggregates hazard data to grade specific roads (e.g., Anna Salai - 82 Good).
6. `leaderboard`: A SQL View ranking users dynamically based on their total points.

---

## 🔄 System Workflow Flowchart

1. **Upload:** User spots a hazard, opens the mobile-responsive app, and uploads a photo. GPS is auto-captured.
2. **AI Analysis:** Image hits the FastAPI backend; YOLOv8 predicts the hazard type and calculates a 1-10 severity score.
3. **Database Entry:** Report is saved to Supabase; the user receives points.
4. **Public Mapping:** The hazard instantly populates on the React-based Google Hazard Map.
5. **Admin Routing:** Municipal officers see the hazard on the Admin Panel and assign a contractor with an estimated cost.
6. **Resolution & Verification:** Contractor fixes it ➔ Status changes ➔ Citizens vote to verify ➔ Issue closed.
7. **Prediction Loop:** The data feeds back into the ML model to update the city's 30-day risk heatmaps.

---

## 🎨 UI/UX Design Principles
- **Aesthetics:** Deep Blue (`#0A192F`), Accent Orange (`#FF6B35`), and clean White backgrounds.
- **Accessibility:** Clear typography (`Inter` font), large touch targets for mobile, and high contrast for outdoor visibility.
- **Micro-animations:** Smooth sliding transitions and hover states for a premium app feel.

---

## 🔮 Future Roadmap
- Integration with traffic cameras for passive API ingestion of hazards.
- Native React Native application compilation for iOS/Android.
- Automated WhatsApp Bot integration for easy reporting without downloading an app.
