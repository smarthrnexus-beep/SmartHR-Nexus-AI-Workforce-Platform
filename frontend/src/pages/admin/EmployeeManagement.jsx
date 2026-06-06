import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Download, Upload, MoreVertical, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import { employeeAPI } from '@/services/api';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const STATUS_COLORS = {
  active:      'badge-success',
  on_leave:    'badge-warning',
  probation:   'badge-primary',
  resigned:    'badge-danger',
  terminated:  'badge-danger',
};

const ROLE_LABELS = {
  super_admin:    'Super Admin',
  admin:          'Admin',
  senior_manager: 'Sr. Manager',
  hr_recruiter:   'HR Recruiter',
  employee:       'Employee',
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const limit = 12;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await employeeAPI.getAll({ search, role: roleFilter, page, limit });
      setEmployees(data.data || []);
      setTotal(data.total || 0);
    } catch {
      // Show mock data for demo
      setEmployees(MOCK_EMPLOYEES);
      setTotal(MOCK_EMPLOYEES.length);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this employee?')) return;
    try {
      await employeeAPI.delete(id);
      toast.success('Employee deactivated');
      fetchEmployees();
    } catch {
      toast.error('Failed to deactivate employee');
    }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex-between flex-wrap gap-3"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Employee Management</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total.toLocaleString()} total employees</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-xs">
            <Upload className="w-3.5 h-3.5" /> Import CSV
          </button>
          <button className="btn-secondary text-xs">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Employee
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="glass-card p-4 flex flex-wrap gap-3"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, ID, email..."
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="input-field w-auto py-2 text-xs"
        >
          <option value="">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button className="btn-secondary text-xs py-2">
          <Filter className="w-3.5 h-3.5" /> More Filters
        </button>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Role</th>
                <th>Department</th>
                <th>Date Joined</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j}><div className="skeleton h-3 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id || emp.id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/50 to-accent-500/50 flex-center flex-shrink-0">
                          {emp.avatar
                            ? <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                            : <span className="text-xs font-semibold text-white">
                                {emp.firstName?.[0]}{emp.lastName?.[0]}
                              </span>
                          }
                        </div>
                        <div>
                          <p className="font-medium text-white text-xs">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-400 font-mono text-xs">{emp.employeeId || '—'}</td>
                    <td>
                      <span className="text-xs text-slate-300">{ROLE_LABELS[emp.role] || emp.role}</span>
                    </td>
                    <td className="text-slate-400 text-xs">{emp.department?.name || emp.department || '—'}</td>
                    <td className="text-slate-400 text-xs">
                      {emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <span className={clsx('badge text-[10px]', STATUS_COLORS[emp.status] || 'badge-neutral')}>
                        {emp.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="btn-ghost p-1.5" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="btn-ghost p-1.5" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id || emp.id)}
                          className="p-1.5 text-slate-500 hover:text-danger-400 hover:bg-danger-500/10 rounded-lg transition-all"
                          title="Deactivate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex-between px-4 py-3 border-t border-white/5">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
              >← Prev</button>
              {Array.from({ length: Math.min(5, pages) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={clsx('px-3 py-1.5 rounded-lg text-xs transition-all',
                      page === p ? 'bg-primary-600 text-white' : 'btn-secondary')}
                  >{p}</button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
              >Next →</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Mock data for demo
const MOCK_EMPLOYEES = [
  { id: '1', firstName: 'Emma',   lastName: 'Wilson',  email: 'emma@company.com',   employeeId: 'EMP00001', role: 'senior_manager', department: { name: 'Engineering' }, dateOfJoining: '2022-01-15', status: 'active'   },
  { id: '2', firstName: 'James',  lastName: 'Carter',  email: 'james@company.com',  employeeId: 'EMP00002', role: 'hr_recruiter',   department: { name: 'HR'          }, dateOfJoining: '2021-06-10', status: 'active'   },
  { id: '3', firstName: 'Priya',  lastName: 'Sharma',  email: 'priya@company.com',  employeeId: 'EMP00003', role: 'employee',       department: { name: 'Product'     }, dateOfJoining: '2023-03-20', status: 'active'   },
  { id: '4', firstName: 'Marcus', lastName: 'Chen',    email: 'marcus@company.com', employeeId: 'EMP00004', role: 'employee',       department: { name: 'Sales'       }, dateOfJoining: '2020-09-05', status: 'on_leave' },
  { id: '5', firstName: 'Sofia',  lastName: 'Reyes',   email: 'sofia@company.com',  employeeId: 'EMP00005', role: 'employee',       department: { name: 'Marketing'   }, dateOfJoining: '2023-07-12', status: 'probation'},
  { id: '6', firstName: 'Liam',   lastName: 'O\'Brien',email: 'liam@company.com',   employeeId: 'EMP00006', role: 'employee',       department: { name: 'DevOps'      }, dateOfJoining: '2022-11-01', status: 'active'   },
  { id: '7', firstName: 'Aisha',  lastName: 'Patel',   email: 'aisha@company.com',  employeeId: 'EMP00007', role: 'employee',       department: { name: 'Finance'     }, dateOfJoining: '2021-04-18', status: 'active'   },
  { id: '8', firstName: 'Ryan',   lastName: 'Park',    email: 'ryan@company.com',   employeeId: 'EMP00008', role: 'employee',       department: { name: 'Engineering' }, dateOfJoining: '2024-01-08', status: 'active'   },
];
