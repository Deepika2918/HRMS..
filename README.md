# HRMS Lite - Smart Human Resource Management System

A premium, production-ready HRMS dashboard built with a focus on **visual excellence**, **real-time insights**, and **performance**. This system provides a seamless experience for HR teams to manage personnel and track attendance with a cloud-synced backend.

---

## ✨ Key Highlights

- **🎯 Data-Driven Dashboard**: Real-time KPI cards and interactive distribution charts using `Recharts`.
- **⚡ Live Attendance Control**: High-performance attendance marking with instant counter updates and live status pulses.
- **☁️ Cloud-Native Backend**: Fully integrated with **NeonDB (PostgreSQL)** for persistent, cloud-based data storage-no local setup required for the database.
- **🎨 Premium UI/UX**: Crafted with a "Glassmorphism" aesthetic using **Tailwind CSS**, **Ant Design**, and **Framer Motion** for smooth micro-interactions.
- **📱 Responsive & Polished**: normalized typography, sticky headers, and a compact, professional data layout.

---

## 🚀 Features

### 1. Advanced Dashboard
- **Live Stats**: Total Employees, Present Today, and Absent Today counters.
- **Department Distribution**: Transparent visual breakdown of the workforce composition.
- **Recent Hires**: A quick-access table to keep track of the latest additions to the team.

### 2. Employee Management
- **Full CRUD Support**: Add, view, and securely delete employee records.
- **Normalized Data**: Automatic `created_at` timestamps and structured employee profiles.
- **Clean Layout**: A compact, scalable table design with easy-to-read typography.

### 3. Attendance Control Center
- **Smart Mark**: Single-click "Present" or "Absent" marking with backend validation.
- **Quick Search**: Search employees by name or department for rapid marking.
- **History Insights**: Click any employee to instantly load their detailed attendance history.
- **System Balanced Status**: Global status indicator for overall system health.

---

## 🛠️ Tech Stack

- **Frontend**: 
  - `React 18` + `TypeScript`
  - `Tailwind CSS` (Custom Glass Design System)
  - `Ant Design` (Enterprise UI Components)
  - `Framer Motion` (Advanced Animations)
  - `Lucide React` (Modern Iconography)

- **Backend**: 
  - `FastAPI` (High-performance Python Framework)
  - `SQLAlchemy` (ORM for Database Management)
  - `Psycopg2` (PostgreSQL Driver)

- **Database**: 
  - `PostgreSQL` (Hosted on **NeonDB** for 99.9% availability)

---

## ⚙️ Installation & Running

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Setup Virtual Environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install Dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env`:
   - The project is already pre-configured with a **NeonDB PostgreSQL URL**.
   - Simply start the server.
5. Launch:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install Packages:
   ```bash
   npm install
   ```
3. Launch:
   ```bash
   npm run dev
   ```

---

## 📂 Architecture
```text
├── backend/
│   ├── app/
│   │   ├── api/          # Optimized endpoints for Stats & CRUD
│   │   ├── db/           # PostgreSQL connection handling (NeonDB ready)
│   │   ├── models/       # Relational Database Models
│   │   └── main.py       # API Entry Point
├── frontend/
│   ├── src/
│   │   ├── pages/        # Dashboard, EmployeeList, AttendanceManager
│   │   ├── components/   # Highly reusable UI architecture
│   │   └── services/     # Centralized API logic (Axios)
└── .gitignore            # Consolidated root-level ignore rules
```

---
*Developed as a high-fidelity technical assessment for the HR Platform.*
