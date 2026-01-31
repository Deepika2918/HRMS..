interface AttendanceSummaryProps {
  present: number
  absent: number
  total: number
}

export default function AttendanceSummary({ present, absent, total }: AttendanceSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6 shrink-0">
      <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl">
        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Present Today</p>
        <div className="flex items-baseline gap-1">
          <h4 className="text-lg font-bold text-emerald-700">{present}</h4>
          <span className="text-[10px] font-bold text-emerald-500/60 uppercase">EMP</span>
        </div>
      </div>
      <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-2xl">
        <p className="text-[9px] font-bold text-rose-600 uppercase tracking-wider mb-1">Absent Today</p>
        <div className="flex items-baseline gap-1">
          <h4 className="text-lg font-bold text-rose-700">{absent}</h4>
          <span className="text-[10px] font-bold text-rose-500/60 uppercase">EMP</span>
        </div>
      </div>
      <div className="bg-slate-50/50 border border-slate-200/50 p-3 rounded-2xl">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Roster</p>
        <div className="flex items-baseline gap-1">
          <h4 className="text-lg font-bold text-slate-600">{total}</h4>
          <span className="text-[10px] font-bold text-slate-400/60 uppercase">STAFF</span>
        </div>
      </div>
    </div>
  )
}
