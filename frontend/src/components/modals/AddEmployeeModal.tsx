import { Mail, User, X, Loader2 } from 'lucide-react'
import { Modal as AntModal, Select as AntSelect, message } from 'antd'
import { useState } from 'react'
import { employeeService } from '../../services/api'

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: 'Engineering',
    designation: '',
    status: 'Active'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await employeeService.add(form)
      message.success('Employee added successfully')
      setForm({ employee_id: '', full_name: '', email: '', department: 'Engineering', designation: '', status: 'Active' })
      onSuccess()
      onClose()
    } catch (err: any) {
      message.error(err.response?.data?.detail || 'Failed to add employee')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AntModal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={440}
      closeIcon={null}
      className="custom-antd-modal"
    >
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">New Employee</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-title">Employee ID</label>
              <input 
                required
                className="input-field h-10 px-3"
                placeholder="EMP-001"
                value={form.employee_id}
                onChange={e => setForm({...form, employee_id: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="label-title">Department</label>
              <AntSelect 
                className="w-full h-10 custom-select"
                value={form.department}
                onChange={val => setForm({...form, department: val})}
                options={[
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Human Resources', label: 'Human Resources' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Finance', label: 'Finance' },
                  { value: 'Operations', label: 'Operations' },
                ]}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-title">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
              <input 
                required
                className="input-field !pl-11 h-10"
                placeholder="Full name"
                value={form.full_name}
                onChange={e => setForm({...form, full_name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-title">Designation (Role)</label>
            <input 
              required
              className="input-field h-10 px-3"
              placeholder="e.g. Senior Developer"
              value={form.designation}
              onChange={e => setForm({...form, designation: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="label-title">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
              <input 
                required
                type="email"
                className="input-field !pl-11 h-10"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary flex-1 justify-center h-10"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="btn-primary flex-1 justify-center h-10 shadow-sm"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </AntModal>
  )
}
