import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import EmployeeList from './pages/EmployeeList'
import AttendanceManager from './pages/AttendanceManager'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="h-screen w-screen bg-[#F1F5F9] p-4 flex gap-4 overflow-hidden text-slate-900">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 bg-white rounded-[2rem] shadow-sm border border-slate-200/50 overflow-hidden relative">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <section className="flex-1 overflow-y-auto no-scrollbar p-10 bg-white relative">
           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/employees" element={<EmployeeList />} />
             <Route path="/attendance" element={<AttendanceManager />} />
           </Routes>
        </section>
      </main>
    </div>
  )
}

export default App
