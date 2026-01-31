import { Menu, X, Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface HeaderProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const location = useLocation()
  
  const navItemNames: Record<string, string> = {
    '/': 'Dashboard',
    '/employees': 'Employees',
    '/attendance': 'Attendance',
  }

  const currentPage = navItemNames[location.pathname] || 'HRMS Lite'

  return (
    <header className="h-20 shrink-0 flex items-center justify-between px-10 border-b border-slate-50 bg-white/80 backdrop-blur-md z-30">
      <div className="flex items-center gap-4">
         <button onClick={toggleSidebar} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-100 font-bold uppercase tracking-widest text-[10px]">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
         <h1 className="text-xl font-bold text-slate-800 tracking-tight">
           {currentPage}
         </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Status</span>
           <span className="text-xs font-bold text-emerald-500">System Balanced</span>
        </div>
        <div className="h-8 w-px bg-slate-100 hidden md:block" />
        <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl relative transition-all border border-transparent hover:border-primary-100">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        </button>
      </div>
    </header>
  )
}
