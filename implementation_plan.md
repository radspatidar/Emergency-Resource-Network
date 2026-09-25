# Implementation Plan — Real-Time Healthcare Emergency Resource Coordination System

Build a full-stack, role-based Emergency Resource Coordination application using **Node.js, Express, React, Neon PostgreSQL (via Prisma ORM), and Socket.io** for real-time dashboard and simulated GPS tracking.

---

## Architecture Overview

```mermaid
graph TD
    Client[React SPA Frontend] <-->|REST API + Socket.io| Server[Node.js + Express Backend Server]
    Server <-->|Prisma ORM| DB[(Neon PostgreSQL Database)]
    
    subgraph Frontend Pages
        L[Login Page]
        AD[System Admin Dashboard]
        HD[Hospital Admin Dashboard]
        CD[Coordinator Dashboard]
        AO[Ambulance Operator Dashboard]
        CBD[Central Monitoring Dashboard]
    end

    subgraph Backend Core Modules
        Auth[Auth & RBAC Middleware]
        HospMod[Hospital & Resource Manager]
        AmbMod[Ambulance & Location Manager]
        EmergMod[Emergency Request Manager]
        MatchEng[Resource Matching Engine]
        AssignMod[Assignment & Workflow Engine]
        SimGPS[GPS Movement Simulator]
    end
```

---

## User Review Required

> [!IMPORTANT]
> **Neon PostgreSQL Connection**: Please ensure you have a Neon PostgreSQL connection string (or local PostgreSQL URL fallback for development). We can configure `.env` with a database URL placeholder `DATABASE_URL="postgresql://user:password@ep-sample.neon.tech/emergency_db?sslmode=require"`.

> [!NOTE]
> **Simulated GPS Routing**: Real GPS hardware is not required. Predefined coordinate paths (e.g., Indore city waypoints) will simulate live ambulance travel from ambulance location $\rightarrow$ patient $\rightarrow$ hospital.

---

## Open Questions

- **Seed Data**: Would you like us to automatically populate the database with sample hospitals in Indore (e.g., Hospital A, B, C), sample ambulances (A01, A02, A03), and test accounts for each of the 4 roles upon backend start?

---

## Proposed Changes

### Database Schema (Prisma + Neon PostgreSQL)

#### [NEW] [schema.prisma](file:///c:/Users/radsp/Desktop/Minor%20Project/Emergency%20resource%20Network/backend/prisma/schema.prisma)
- Define models:
  - `User` (`SYSTEM_ADMIN`, `HOSPITAL_ADMIN`, `COORDINATOR`, `AMBULANCE_OPERATOR`)
  - `Hospital` (Beds total/occupied, ICU total/occupied, Ventilators, Oxygen, Doctors, Nurses, ER Status, Lat/Lng)
  - `Ambulance` (Vehicle ID, Status: `AVAILABLE`/`BUSY`/`MAINTENANCE`, Lat/Lng)
  - `EmergencyRequest` (Request Code, Patient ID, Priority: `CRITICAL`/`HIGH`/`MEDIUM`/`LOW`, Status: `PENDING`/`ASSIGNED`/`IN_PROGRESS`/`COMPLETED`, Resource Flags)
  - `Assignment` (Links EmergencyRequest, Hospital, Ambulance, AssignedBy)
  - `LocationLog` (Simulated location history for trips)

---

### Backend (Node.js + Express + Socket.io)

#### [NEW] [server.js](file:///c:/Users/radsp/Desktop/Minor%20Project/Emergency%20resource%20Network/backend/src/server.js)
- Express app setup, Socket.io initialization, middleware, routes registration, HTTP server startup.

#### [NEW] [matchingEngine.js](file:///c:/Users/radsp/Desktop/Minor%20Project/Emergency%20resource%20Network/backend/src/services/matchingEngine.js)
- Core algorithm: Filters hospitals with required ICU beds, ventilators, available staff, and pairs with available ambulances. Returns ranked recommendations to the Emergency Coordinator.

#### [NEW] [simulationService.js](file:///c:/Users/radsp/Desktop/Minor%20Project/Emergency%20resource%20Network/backend/src/services/simulationService.js)
- Simulates waypoint-by-waypoint ambulance movement along coordinate paths, emitting Socket.io updates to connected clients.

#### [NEW] API Routes & Controllers
- `authRoutes.js`: User login, JWT generation, session check.
- `hospitalRoutes.js`: Hospital registration, live inventory updates, status toggles.
- `ambulanceRoutes.js`: Ambulance fleet CRUD, availability status, manual location update.
- `emergencyRoutes.js`: Request creation, status changes, matching request trigger.
- `assignmentRoutes.js`: Confirm assignment (atomic transaction reserving resources & updating ambulance status), start trip, complete trip.

---

### Frontend (React + Vite + Leaflet Maps + Tailwind/Custom CSS)

#### [NEW] [App.jsx](file:///c:/Users/radsp/Desktop/Minor%20Project/Emergency%20resource%20Network/frontend/src/App.jsx)
- React Router configuration, Auth Provider, Socket Provider, Role-based route protection.

#### [NEW] Role Dashboards & Views
- `AdminDashboard.jsx`: Register/Manage Hospitals, Ambulances, and Users.
- `HospitalDashboard.jsx`: Live inventory sliders/inputs for Beds, ICU, Ventilators, Staff; Emergency department status toggle; Incoming Emergency Alerts queue.
- `CoordinatorDashboard.jsx`: Create emergency request form, Emergency request queue sorted by priority, **Intelligent Resource Matching Engine** UI with recommended hospitals/ambulances, Assignment button.
- `AmbulanceDashboard.jsx`: Active assigned trip view, "Start Trip" / "Complete Trip" action buttons, Live trip status.
- `CentralDashboard.jsx`: Executive authority monitoring screen with overall KPIs, Capacity warning alert banners, Live Leaflet Map showing hospitals and moving ambulances, Real-time refresh timestamp.

---

## Verification Plan

### Automated Verification
1. **Backend Tests / Verification Script**:
   - Seed database script to create initial roles, hospitals, and ambulances.
   - Auth endpoint testing (JWT login for all 4 roles).
   - Matching engine logic verification test script.

### Manual Verification Workflow
1. **System Admin Setup**: Log in as Admin, create 3 hospitals and 3 ambulances.
2. **Hospital Resource Update**: Log in as Hospital Admin for Hospital A, update ICU available = 2, Ventilators = 1.
3. **Emergency Creation**: Log in as Emergency Coordinator, create Critical Emergency Request `ER-1025` requiring ICU + Ventilator.
4. **Matching Engine**: Run matching. Verify Hospital A is marked suitable, Hospital B (0 ICU) marked unsuitable.
5. **Coordinator Assignment**: Assign Hospital A + Ambulance A01. Verify Request $\rightarrow$ `ASSIGNED`, Ambulance $\rightarrow$ `BUSY`, Hospital ICU count updated.
6. **Ambulance Operator & GPS Simulation**: Log in as Ambulance Operator A01, click "Start Trip". Observe simulated location moving on Central Dashboard Map.
7. **Trip Completion**: Click "Complete Trip". Verify Request $\rightarrow$ `COMPLETED`, Ambulance $\rightarrow$ `AVAILABLE`.
8. **Central Dashboard**: Verify real-time alerts and KPI updates throughout the workflow.
