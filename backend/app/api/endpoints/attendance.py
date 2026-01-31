from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...db.session import get_db
from ...models.models import Attendance, Employee
from ...schemas.schemas import AttendanceCreate, AttendanceResponse
from datetime import date as date_type

router = APIRouter()

@router.post("/", response_model=AttendanceResponse)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.id == attendance.employee_db_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if attendance already marked for this date
    existing = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_db_id,
        Attendance.date == attendance.date
    ).first()
    
    if existing:
        existing.status = attendance.status
        db.commit()
        db.refresh(existing)
        return existing
    
    new_attendance = Attendance(
        date=attendance.date,
        status=attendance.status,
        employee_id=attendance.employee_db_id
    )
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance

@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
def get_employee_attendance(employee_id: int, db: Session = Depends(get_db)):
    return db.query(Attendance).filter(Attendance.employee_id == employee_id).order_by(Attendance.date.desc()).all()

@router.get("/summary", response_model=List[dict])
def get_attendance_summary(db: Session = Depends(get_db)):
    # Calculate present days per employee
    employees = db.query(Employee).all()
    summary = []
    for emp in employees:
        present_count = db.query(Attendance).filter(
            Attendance.employee_id == emp.id,
            Attendance.status == "Present"
        ).count()
        summary.append({
            "employee_id": emp.employee_id,
            "full_name": emp.full_name,
            "present_days": present_count
        })
    return summary
@router.get("/today-stats")
def get_today_stats(date: str, db: Session = Depends(get_db)):
    # date format should be YYYY-MM-DD
    total = db.query(Employee).count()
    present = db.query(Attendance).filter(Attendance.date == date, Attendance.status == "Present").count()
    absent = db.query(Attendance).filter(Attendance.date == date, Attendance.status == "Absent").count()
    
    return {
        "present": present,
        "absent": absent,
        "total": total
    }
