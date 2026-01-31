import { motion } from 'framer-motion'
import { CalendarCheck, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { message } from 'antd'

export default function ReportGenerator() {
  const [generating, setGenerating] = useState(false)

  const handleGenerateReport = () => {
    setGenerating(true)
    const hide = message.loading({ content: 'Generating report...', key: 'reporting' })
    
    setTimeout(() => {
      setGenerating(false)
      message.success({ content: 'Report downloaded successfully', key: 'reporting', duration: 3 })
      
      const element = document.createElement("a");
      const csvContent = "Employee ID,Name,Department,Attendance Rate\nEMP-001,Prince Raj,Engineering,100%\nEMP-002,Henry,Operations,85%";
      const file = new Blob([csvContent], {type: 'text/csv'});
      element.href = URL.createObjectURL(file);
      element.download = "hrms_report.csv";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-5 bg-white border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-3 h-[200px]"
    >
      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shadow-inner">
        <CalendarCheck size={20} />
      </div>
      <div className="max-w-xs space-y-0.5">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Generate Reports</h3>
        <p className="text-slate-400 text-[10px] leading-relaxed font-medium">
          Export comprehensive personnel data.
        </p>
      </div>
      <button 
        disabled={generating}
        onClick={handleGenerateReport}
        className={`btn-primary w-[160px] h-8 shadow-sm flex items-center justify-center gap-2 text-[11px] font-bold ${generating && 'opacity-80'}`}
      >
        {generating ? (
          <Loader2 className="animate-spin" size={14} />
        ) : (
          <>
            <Download size={14} />
            Generate CSV
          </>
        )}
      </button>
    </motion.div>
  )
}
