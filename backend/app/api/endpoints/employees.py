from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...db.session import get_db
from ...models.models import Employee, Attendance
from ...schemas.schemas import EmployeeCreate, EmployeeResponse, EmployeeDetail, DashboardStats
from datetime import date

router = APIRouter()

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Check if employee_id already exists
    db_employee = db.query(Employee).filter(Employee.employee_id == employee.employee_id).first()
    if db_employee:
        raise HTTPException(status_code=400, detail="Employee ID already registered")
    
    # Check if email exists
    db_email = db.query(Employee).filter(Employee.email == employee.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_employee = Employee(**employee.model_dump())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

@router.get("/", response_model=List[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Employee).count()
    today = date.today()
    present = db.query(Attendance).filter(Attendance.date == today, Attendance.status == "Present").count()
    absent = db.query(Attendance).filter(Attendance.date == today, Attendance.status == "Absent").count()
    
    # Simple distribution
    distribution = {}
    employees = db.query(Employee.department).all()
    for (dept,) in employees:
        distribution[dept] = distribution.get(dept, 0) + 1
        
    # Recent employees
    recent = db.query(Employee).order_by(Employee.id.desc()).limit(3).all()
        
    return {
        "total_employees": total,
        "present_today": present,
        "absent_today": absent,
        "department_distribution": distribution,
        "recent_employees": recent
    }

@router.get("/{id}", response_model=EmployeeDetail)
def get_employee(id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
    return None
