from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import List, Optional

# Attendance Schemas
class AttendanceBase(BaseModel):
    date: date
    status: str
    remarks: Optional[str] = None
    check_in_time: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    employee_db_id: int = Field(..., alias="employee_id")

class AttendanceResponse(AttendanceBase):
    id: int
    
    class Config:
        from_attributes = True

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    designation: str = "Staff"
    status: str = "Active"
    created_at: Optional[datetime] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    
    class Config:
        from_attributes = True

class EmployeeDetail(EmployeeResponse):
    attendances: List[AttendanceResponse] = []

# Analytics Schema
class DashboardStats(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    department_distribution: dict
    recent_employees: List[EmployeeResponse] = []
