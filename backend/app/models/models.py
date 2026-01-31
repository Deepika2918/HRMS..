from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, Enum as SQLEnum, func
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from ..db.session import Base

class AttendanceStatus(str, enum.Enum):
    PRESENT = "Present"
    ABSENT = "Absent"

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False)
    designation = Column(String, nullable=False, default="Staff")
    status = Column(String, nullable=False, default="Active")
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    attendances = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")

class Attendance(Base):
    __tablename__ = "attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False) # Store as string for simplicity in lite version
    employee_id = Column(Integer, ForeignKey("employees.id"))
    remarks = Column(String, nullable=True)
    check_in_time = Column(String, nullable=True)

    employee = relationship("Employee", back_populates="attendances")
