from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.session import engine, Base
from .api.endpoints import employees, attendance
from .models import models # Ensure models are loaded for table creation

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be restricted
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])

@app.get("/")
def read_root():
    return {"status": "online", "message": "HRMS Lite API is running"}
