export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  status: 'Present' | 'Absent';
}

export interface DashboardStats {
  total_employees: number;
  present_today: number;
  absent_today: number;
  department_distribution: Record<string, number>;
}
