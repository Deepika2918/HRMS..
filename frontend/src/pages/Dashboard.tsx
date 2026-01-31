import { useEffect, useState } from 'react'
import { Users, CalendarCheck, UserMinus, UserPlus, TrendingUp, Loader2, Download, PieChart as PieChartIcon, ArrowUpRight, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { employeeService } from '../services/api'
import { message, Table, Avatar, Badge } from 'antd'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

interface RecentEmployee {
  id: number
  employee_id: string
  full_name: string
  email: string
  department: string
  designation: string
  status: string
  created_at?: string
}

interface Stats {
  total_employees: number
  present_today: number
  absent_today: number
  department_distribution: Record<string, number>
  recent_employees: RecentEmployee[]
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    employeeService.getStats()
      .then(res => setStats(res.data))
      .catch(err => message.error('Failed to load dashboard statistics'))
      .finally(() => setLoading(false))
  }, [])

  const handleGenerateReport = () => {
    setGenerating(true)
    const hide = message.loading({ content: 'Generating report...', key: 'reporting' })
    
    setTimeout(() => {
      setGenerating(false)
      message.success({ content: 'Report downloaded successfully', key: 'reporting', duration: 3 })
      
      const element = document.createElement("a");
      const file = new Blob(["Employee ID,Name,Department,Attendance Rate\nEMP-001,Prince Raj,Engineering,100%\nEMP-002,Henry,Operations,85%"], {type: 'text/csv'});
      element.href = URL.createObjectURL(file);
      element.download = "hrms_report.csv";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-primary-600" size={32} />
      <p className="text-slate-400 font-semibold text-xs uppercase tracking-widest">Loading Dashboard</p>
    </div>
  )

  const cards = [
    { title: 'Total Employees', value: stats?.total_employees || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Present Today', value: stats?.present_today || 0, icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Absent Today', value: stats?.absent_today || 0, icon: UserMinus, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Attendance Rate', value: `${stats?.total_employees ? Math.round((stats.present_today / stats.total_employees) * 100) : 0}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const chartData = stats ? Object.entries(stats.department_distribution).map(([name, value]) => ({ name, value })) : []

  return (
    <div className="space-y-5 animate-fade-in pb-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Workforce activity and analytics at a glance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            key={card.title}
            className="glass-card p-5 flex items-center justify-between bg-white border-slate-100 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">{card.value}</h3>
            </div>
            <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
              <card.icon size={20} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        {/* Recent Employees Table */}
        <div className="lg:col-span-2 glass-card bg-white border-slate-100 shadow-sm flex flex-col overflow-hidden h-[320px]">
          <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <Users size={14} className="text-primary-600" />
              Recent Hires
            </h3>
            <Link to="/employees" className="text-[9px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group">
              View All <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-hidden no-scrollbar">
            <Table 
              dataSource={stats?.recent_employees.slice(0, 3) || []}
              pagination={false}
              rowKey="id"
              size="small"
              className="custom-antd-table"
              columns={[
                {
                  title: 'EMPLOYEE',
                  key: 'name',
                  render: (_, record) => (
                    <div className="flex items-center gap-2.5">
                      <Avatar className="bg-slate-100 text-primary-600 font-bold text-[10px] uppercase shrink-0" size={32}>
                        {record.full_name.charAt(0)}
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-700 truncate">{record.full_name}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase truncate">{record.designation}</div>
                      </div>
                    </div>
                  )
                },
                {
                  title: 'DEPARTMENT',
                  dataIndex: 'department',
                  key: 'department',
                  render: (dept) => <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{dept}</span>
                },
                {
                  title: 'JOINED',
                  dataIndex: 'created_at',
                  key: 'created_at',
                  render: (date) => <span className="text-[9px] font-bold text-slate-400 uppercase">{date ? dayjs(date).format('MMM DD') : '--'}</span>
                },
                {
                  title: 'STATUS',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Badge status={status === 'Active' ? 'success' : 'default'} text={<span className="text-[9px] font-bold text-slate-400 uppercase">{status}</span>} />
                  )
                }
              ]}
            />
          </div>
        </div>

        {/* Department Distribution (Pie Chart) - SHRUNK */}
        <div className="glass-card bg-white border-slate-100 shadow-sm flex flex-col h-[320px]">
          <div className="px-5 py-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <PieChartIcon size={14} className="text-primary-600" />
              Distribution
            </h3>
          </div>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: -15, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="42%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '6px' }}
                   itemStyle={{ fontSize: '10px', fontWeight: 'bold', padding: 0 }}
                />
                <Legend 
                  iconType="circle" 
                  verticalAlign="bottom"
                  layout="horizontal"
                  align="center"
                  wrapperStyle={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', bottom: '10px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Progress Bars Section */}
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
          
          <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
            {Object.entries(stats?.department_distribution || {}).map(([dept, count], idx) => (
              <div key={dept}>
                <div className="flex justify-between text-[10px] mb-1 font-bold">
                  <span className="text-slate-600 uppercase truncate pr-4">{dept}</span>
                  <span className="text-slate-400 uppercase shrink-0">{count} {count === 1 ? 'MBR' : 'MBRS'}</span>
                </div>
                <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / (stats?.total_employees || 1)) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                    className="bg-primary-500 h-full rounded-full"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Generate Reports Section */}
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
            className={`btn-primary px-5 h-8 shadow-sm flex items-center justify-center gap-2 text-[11px] font-bold ${generating && 'opacity-80'}`}
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
      </div>
    </div>
  )
}
