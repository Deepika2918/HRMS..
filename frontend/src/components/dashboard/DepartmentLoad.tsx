import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { Empty } from 'antd'

interface DepartmentLoadProps {
  distribution: Record<string, number>
  total: number
}

export default function DepartmentLoad({ distribution, total }: DepartmentLoadProps) {
  const isEmpty = Object.keys(distribution).length === 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-5 bg-white border-slate-100 shadow-sm h-[200px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
          <Activity size={14} className="text-primary-600" />
          Department Load
        </h3>
        <div className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[7px] font-extrabold text-slate-400 uppercase tracking-widest">Live Status</div>
      </div>
      
      <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 flex flex-col">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-2 opacity-60">
             <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest text-center mt-2">No Departmental Load Detected</p>
             <div className="flex gap-2 w-full mt-4 opacity-10">
                <div className="h-1 bg-slate-200 rounded-full flex-1" />
                <div className="h-1 bg-slate-200 rounded-full flex-1" />
             </div>
          </div>
        ) : (
          Object.entries(distribution).map(([dept, count], idx) => (
            <div key={dept}>
              <div className="flex justify-between text-[10px] mb-1 font-bold">
                <span className="text-slate-600 uppercase truncate pr-4">{dept}</span>
                <span className="text-slate-400 uppercase shrink-0">{count} {count === 1 ? 'MBR' : 'MBRS'}</span>
              </div>
              <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / (total || 1)) * 100}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.05 }}
                  className="bg-primary-500 h-full rounded-full"
                ></motion.div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}
