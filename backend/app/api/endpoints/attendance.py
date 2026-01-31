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
    if not db.query(Employee).filter(Employee.id == attendance.employee_db_id).first():
        raise HTTPException(status_code=404, detail="Employee not found")
    
    existing = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_db_id,
        Attendance.date == attendance.date
    ).first()
    
    if existing:
        existing.status = attendance.status
        existing.remarks = attendance.remarks
        existing.check_in_time = attendance.check_in_time
        db.commit()
        db.refresh(existing)
        return existing
    
    new_attendance = Attendance(
        date=attendance.date,
        status=attendance.status,
        employee_id=attendance.employee_db_id,
        remarks=attendance.remarks,
        check_in_time=attendance.check_in_time
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
    from sqlalchemy import func
    results = db.query(
        Employee.employee_id,
        Employee.full_name,
        func.count(Attendance.id).label("present_days")
    ).outerjoin(
        Attendance, 
        (Attendance.employee_id == Employee.id) & (Attendance.status == "Present")
    ).group_by(Employee.id).all()

    return [
        {
            "employee_id": r.employee_id,
            "full_name": r.full_name,
            "present_days": r.present_days
        } for r in results
    ]
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
