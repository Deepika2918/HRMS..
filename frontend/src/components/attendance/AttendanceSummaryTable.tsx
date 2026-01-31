import { useEffect, useState } from 'react'
import { attendanceService } from '../../services/api'
import { Table, message, Tag } from 'antd'
import { BarChart3 } from 'lucide-react'

interface SummaryData {
  employee_id: string
  full_name: string
  present_days: number
}

export default function AttendanceSummaryTable() {
  const [data, setData] = useState<SummaryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    attendanceService.getSummary()
      .then(res => setData(res.data))
      .catch(() => message.error('Failed to load attendance summary'))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    {
      title: 'EMP ID',
      dataIndex: 'employee_id',
      key: 'employee_id',
      render: (text: string) => <span className="text-[10px] font-bold text-primary-600 uppercase tracking-tight font-mono">{text}</span>
    },
    {
      title: 'NAME',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text: string) => <span className="text-xs font-bold text-slate-700">{text}</span>
    },
    {
      title: 'TOTAL PRESENT DAYS',
      dataIndex: 'present_days',
      key: 'present_days',
      align: 'center' as const,
      render: (days: number) => (
        <Tag className="border-0 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-bold text-[10px] uppercase m-0">
          {days} Days
        </Tag>
      )
    }
  ]

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-1 py-3 border-b border-slate-50 flex items-center gap-2 mb-2">
        <BarChart3 size={16} className="text-primary-600" />
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Performance Summary</h3>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <Table 
          dataSource={data}
          columns={columns}
          pagination={false}
          loading={loading}
          rowKey="employee_id"
          size="small"
          className="custom-antd-table"
        />
      </div>
    </div>
  )
}
