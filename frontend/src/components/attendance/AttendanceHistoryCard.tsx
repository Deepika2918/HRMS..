import { motion } from 'framer-motion'
import { History, Search, Clock, MapPin, Info, Calendar as CalendarIcon } from 'lucide-react'
import { Spin, Empty } from 'antd'
import dayjs from 'dayjs'

interface AttendanceRecord {
  id: number
  date: string
  status: string
  check_in_time?: string
  remarks?: string
}

interface AttendanceHistoryCardProps {
  selectedEmployee: any
  history: AttendanceRecord[]
  loading: boolean
}

export default function AttendanceHistoryCard({ selectedEmployee, history, loading }: AttendanceHistoryCardProps) {
  return (
    <div className="lg:col-span-1 flex flex-col h-full gap-3 overflow-hidden font-bold">
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
          ) : loading ? (
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
  )
}
