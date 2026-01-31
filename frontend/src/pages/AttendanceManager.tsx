import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Search, History, Loader2, Info, Clock, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { employeeService, attendanceService } from '../services/api'
import { DatePicker, message, Spin, Empty } from 'antd'
import dayjs from 'dayjs'

interface Employee {
  id: number
  employee_id: string
  full_name: string
  department: string
}

interface AttendanceRecord {
  id: number
  date: string
  status: string
  check_in_time?: string
  remarks?: string
}

export default function AttendanceManager() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [history, setHistory] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [marking, setMarking] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [date, setDate] = useState(dayjs())
  const [todayStats, setTodayStats] = useState({ present: 0, absent: 0, total: 0 })

  useEffect(() => {
    employeeService.getAll()
      .then(res => setEmployees(res.data))
      .catch(err => message.error('Failed to load employees'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchTodayStats()
  }, [date])

  const fetchTodayStats = async () => {
    try {
      const res = await attendanceService.getTodayStats(date.format('YYYY-MM-DD'))
      setTodayStats(res.data)
    } catch (err) {
      console.error('Failed to fetch stats')
    }
  }

  const fetchHistory = async (empId: number) => {
    setHistoryLoading(true)
    setHistory([])
    try {
      const res = await attendanceService.getForEmployee(empId)
      setHistory(res.data)
    } catch (err) {
      message.error('Failed to load history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleMark = async (emp: Employee, status: 'Present' | 'Absent') => {
    setMarking(`${emp.id}-${status}`)
    const dateStr = date.format('YYYY-MM-DD')
    const timeStr = dayjs().format('hh:mm A')
    try {
      await attendanceService.mark({ 
        employee_id: emp.id, 
        date: dateStr, 
        status,
        check_in_time: status === 'Present' ? timeStr : null,
        remarks: status === 'Present' ? 'On-time' : 'No information'
      })
      message.success(`${status} marked for ${emp.full_name}`)
      fetchTodayStats()
      if (selectedEmployee?.id === emp.id) {
        fetchHistory(emp.id)
      }
    } catch (err) {
      message.error('Failed to mark attendance')
    } finally {
      setMarking(null)
    }
  }

  const viewHistory = (emp: Employee) => {
    setSelectedEmployee(emp)
    fetchHistory(emp.id)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in h-full overflow-hidden">
      <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
        <div className="glass-card p-6 flex flex-col h-full bg-white">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <CalendarIcon size={18} className="text-primary-600" />
              Attendance Control
            </h2>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 mr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
              </div>
              <DatePicker 
                className="h-9 rounded-lg border-slate-200"
                value={date}
                allowClear={false}
                onChange={(val) => val && setDate(val)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 shrink-0">
            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl">
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Present Today</p>
              <div className="flex items-baseline gap-1">
                <h4 className="text-lg font-bold text-emerald-700">{todayStats.present}</h4>
                <span className="text-[10px] font-bold text-emerald-500/60 uppercase">EMP</span>
              </div>
            </div>
            <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-2xl">
              <p className="text-[9px] font-bold text-rose-600 uppercase tracking-wider mb-1">Absent Today</p>
              <div className="flex items-baseline gap-1">
                <h4 className="text-lg font-bold text-rose-700">{todayStats.absent}</h4>
                <span className="text-[10px] font-bold text-rose-500/60 uppercase">EMP</span>
              </div>
            </div>
            <div className="bg-slate-50/50 border border-slate-200/50 p-3 rounded-2xl">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Roster</p>
              <div className="flex items-baseline gap-1">
                <h4 className="text-lg font-bold text-slate-600">{todayStats.total}</h4>
                <span className="text-[10px] font-bold text-slate-400/60 uppercase">STAFF</span>
              </div>
            </div>
          </div>

          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text"
              placeholder="Quick search by name or department..."
              className="input-field !pl-10 !h-9 text-[11px] font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="h-full flex items-center justify-center p-20"><Spin /></div>
            ) : employees.filter(e => 
              e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              e.department.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((emp) => (
              <motion.div 
                layout
                key={emp.id} 
                className={`flex items-center justify-between p-3 bg-white border rounded-2xl transition-all ${
                  selectedEmployee?.id === emp.id ? 'border-primary-500 bg-primary-50/10 shadow-sm' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/30'
                }`}
              >
                <div onClick={() => viewHistory(emp)} className="cursor-pointer group flex-1 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase transition-colors shrink-0 ${
                    selectedEmployee?.id === emp.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'
                  }`}>
                    {emp.full_name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-700 text-xs group-hover:text-primary-600 transition-colors truncate">{emp.full_name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">{emp.employee_id} • {emp.department}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    disabled={marking !== null}
                    onClick={() => handleMark(emp, 'Present')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all w-[85px] ${
                      marking === `${emp.id}-Present` ? 'opacity-50 pointer-events-none' : 'hover:bg-emerald-100 active:scale-95'
                    } bg-emerald-50/50 text-emerald-600 border border-emerald-100/50`}
                  >
                    {marking === `${emp.id}-Present` ? <Loader2 className="animate-spin" size={14} /> : 'Present'}
                  </button>
                  <button 
                    disabled={marking !== null}
                    onClick={() => handleMark(emp, 'Absent')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all w-[85px] ${
                      marking === `${emp.id}-Absent` ? 'opacity-50 pointer-events-none' : 'hover:bg-rose-100 active:scale-95'
                    } bg-rose-50/50 text-rose-600 border border-rose-100/50`}
                  >
                    {marking === `${emp.id}-Absent` ? <Loader2 className="animate-spin" size={14} /> : 'Absent'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 flex flex-col h-full gap-3 overflow-hidden">
        <div className="glass-card p-6 flex-1 min-h-0 flex flex-col bg-white overflow-hidden">
          <h2 className="text-base font-bold flex items-center gap-2 mb-6 text-slate-800 shrink-0 uppercase tracking-tight">
            <History size={16} className="text-primary-600" />
            History
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {!selectedEmployee ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Search size={32} className="text-slate-200 mb-4" />
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Select an employee</p>
              </div>
            ) : historyLoading ? (
              <div className="h-full flex items-center justify-center"><Spin /></div>
            ) : history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10">
                <Empty description={<span className="text-slate-400 text-xs">No records found</span>} />
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((record) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={record.id} 
                    className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-primary-100 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dayjs(record.date).format('dddd')}</div>
                        <div className="text-sm font-bold text-slate-700">{dayjs(record.date).format('MMM DD, YYYY')}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                        record.status === 'Present' ? 'bg-emerald-100/50 text-emerald-600' : 'bg-rose-100/50 text-rose-600'
                      }`}>
                        {record.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[11px] font-medium text-slate-500">{record.check_in_time || (record.status === 'Present' ? '09:00 AM' : '--:--')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="text-[11px] font-medium text-slate-500">{record.status === 'Present' ? 'Office' : 'N/A'}</span>
                      </div>
                    </div>

                    {record.remarks && (
                      <div className="mt-2 text-[10px] italic text-slate-400 flex items-center gap-1">
                        <Info size={10} /> {record.remarks}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-800 px-3 py-2 rounded-2xl text-white shadow-lg shadow-primary-600/20 relative overflow-hidden group shrink-0">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Info size={18} />
              <span className="font-bold uppercase tracking-widest text-[10px] opacity-70">Admin Intelligence</span>
            </div>
            <h3 className="text-base font-bold mb-2">Live Insights</h3>
            <p className="text-primary-100/90 text-xs leading-relaxed font-medium">
              Load history instantly by clicking any employee card. Keep track of daily performance seamlessly.
            </p>
          </div>
          <CalendarIcon className="absolute -right-8 -bottom-8 text-white opacity-10 group-hover:scale-110 transition-transform duration-500" size={140} />
        </div>
      </div>
    </div>
  )
}
