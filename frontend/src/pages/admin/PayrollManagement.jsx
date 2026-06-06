import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Download, CheckCircle, Clock, Filter, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import clsx from 'clsx';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const now = new Date();

const PAYROLL_DATA = [
  { month: 'Jul', gross: 1240000, net: 1020000, employees: 142 },
  { month: 'Aug', gross: 1260000, net: 1035000, employees: 144 },
  { month: 'Sep', gross: 1190000, net: 975000,  employees: 141 },
  { month: 'Oct', gross: 1350000, net: 1110000, employees: 148 },
  { month: 'Nov', gross: 1420000, net: 1168000, employees: 151 },
  { month: 'Dec', gross: 1380000, net: 1135000, employees: 149 },
];

const EMPLOYEES = [
  { id:'EMP00001', name:'Alex Morgan',    dept:'HR',          basic:12000, hra:4800, conv:600, med:480, special:1200, pf:1440, esi:141, pt:200, tax:1900, gross:19080, net:15399, status:'paid'      },
  { id:'EMP00002', name:'Sarah Chen',     dept:'Engineering', basic:10000, hra:4000, conv:500, med:400, special:1000, pf:1200, esi:117, pt:200, tax:1600, gross:15900, net:12783, status:'paid'      },
  { id:'EMP00003', name:'Priya Patel',    dept:'HR',          basic:7000,  hra:2800, conv:350, med:280, special:700,  pf:840,  esi:82,  pt:200, tax:1100, gross:11130, net:8908,  status:'paid'      },
  { id:'EMP00004', name:'James Wilson',   dept:'Engineering', basic:6000,  hra:2400, conv:300, med:240, special:600,  pf:720,  esi:70,  pt:200, tax:940,  gross:9540,  net:7610,  status:'processed' },
  { id:'EMP00005', name:'Emma Johnson',   dept:'Engineering', basic:8500,  hra:3400, conv:425, med:340, special:850,  pf:1020, esi:99,  pt:200, tax:1340, gross:13515, net:10856, status:'paid'      },
  { id:'EMP00006', name:'Liam Brown',     dept:'Sales',       basic:6500,  hra:2600, conv:325, med:260, special:650,  pf:780,  esi:76,  pt:200, tax:1020, gross:10335, net:8259,  status:'paid'      },
  { id:'EMP00007', name:'Olivia Davis',   dept:'Marketing',   basic:6000,  hra:2400, conv:300, med:240, special:600,  pf:720,  esi:70,  pt:200, tax:940,  gross:9540,  net:7610,  status:'processed' },
  { id:'EMP00008', name:'Noah Martinez',  dept:'Finance',     basic:7000,  hra:2800, conv:350, med:280, special:700,  pf:840,  esi:82,  pt:200, tax:1100, gross:11130, net:8908,  status:'paid'      },
];

const STATUS_MAP = { paid:'badge-success', processed:'badge-warning', draft:'badge-neutral' };

const fmt = (n) => `$${n.toLocaleString()}`;

export default function PayrollManagement() {
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear]  = useState(now.getFullYear());
  const [search, setSearch]         = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);

  const filtered = EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalGross = filtered.reduce((s, e) => s + e.gross, 0);
  const totalNet   = filtered.reduce((s, e) => s + e.net,   0);
  const totalPF    = filtered.reduce((s, e) => s + e.pf,    0);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="flex-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Payroll Management</h1>
          <p className="text-slate-400 text-sm mt-0.5">{MONTHS[selectedMonth]} {selectedYear} · {filtered.length} employees</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)}
            className="input-field w-auto py-2 text-xs">
            {MONTHS.map((m,i) => <option key={m} value={i}>{m} {selectedYear}</option>)}
          </select>
          <button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5"/>Export</button>
          <button className="btn-primary text-xs"><CheckCircle className="w-3.5 h-3.5"/>Run Payroll</button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Gross',   value: fmt(totalGross), icon: DollarSign,   color:'text-primary-400', bg:'bg-primary-500/10' },
          { label:'Total Net Pay', value: fmt(totalNet),   icon: TrendingUp,   color:'text-accent-400',  bg:'bg-accent-500/10'  },
          { label:'Total PF',      value: fmt(totalPF),    icon: AlertCircle,  color:'text-warning-400', bg:'bg-warning-500/10' },
          { label:'Employees',     value: filtered.length, icon: Users,        color:'text-slate-300',   bg:'bg-white/5'        },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="stat-card">
            <div className={clsx('w-9 h-9 rounded-xl flex-center', s.bg)}>
              <s.icon className={clsx('w-4 h-4', s.color)} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="glass-card p-5">
        <h3 className="font-semibold text-white text-sm mb-4">6-Month Payroll Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={PAYROLL_DATA} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:'#64748b',fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} tick={{fill:'#64748b',fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip formatter={v=>[`$${v.toLocaleString()}`]} contentStyle={{background:'#1e293b',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',fontSize:'12px'}}/>
            <Bar dataKey="gross" name="Gross" radius={[4,4,0,0]} fill="rgba(99,102,241,0.4)" />
            <Bar dataKey="net"   name="Net"   radius={[4,4,0,0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Table */}
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-3">
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search employee..." className="input-field py-2 text-xs flex-1"/>
          <button className="btn-secondary text-xs"><Filter className="w-3.5 h-3.5"/>Filter</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr>
              <th>Employee</th><th>Dept</th><th>Basic</th><th>Gross</th>
              <th>Deductions</th><th>Net Pay</th><th>Status</th><th>Action</th>
            </tr></thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="group cursor-pointer" onClick={()=>setSelectedEmp(emp)}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500/40 to-accent-500/40 flex-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-white">{emp.name.split(' ').map(n=>n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-500">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-400 text-xs">{emp.dept}</td>
                  <td className="text-slate-300 text-xs">{fmt(emp.basic)}</td>
                  <td className="text-slate-300 text-xs font-medium">{fmt(emp.gross)}</td>
                  <td className="text-danger-400 text-xs">-{fmt(emp.pf+emp.esi+emp.pt+emp.tax)}</td>
                  <td className="text-accent-400 text-xs font-bold">{fmt(emp.net)}</td>
                  <td><span className={clsx('badge text-[10px]', STATUS_MAP[emp.status])}>{emp.status}</span></td>
                  <td>
                    <button className="btn-ghost p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      <Download className="w-3.5 h-3.5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Payslip Detail Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex-center p-4" onClick={()=>setSelectedEmp(null)}>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-md p-6"
            onClick={e=>e.stopPropagation()}>
            <div className="flex-between mb-5">
              <div>
                <h3 className="font-display font-bold text-white">Payslip — {MONTHS[selectedMonth]} {selectedYear}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedEmp.id} · {selectedEmp.dept}</p>
              </div>
              <button onClick={()=>setSelectedEmp(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex-center">
                <span className="text-sm font-bold text-white">{selectedEmp.name.split(' ').map(n=>n[0]).join('')}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{selectedEmp.name}</p>
                <p className="text-xs text-slate-400">{selectedEmp.dept}</p>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Earnings</p>
              {[['Basic Salary',fmt(selectedEmp.basic)],['HRA',fmt(selectedEmp.hra)],['Conveyance',fmt(selectedEmp.conv)],['Medical',fmt(selectedEmp.med)],['Special Allowance',fmt(selectedEmp.special)]].map(([l,v])=>(
                <div key={l} className="flex-between text-xs py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{l}</span><span className="text-slate-200">{v}</span>
                </div>
              ))}
              <div className="flex-between text-xs py-2 font-bold">
                <span className="text-white">Gross Earnings</span><span className="text-primary-400">{fmt(selectedEmp.gross)}</span>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Deductions</p>
              {[['Provident Fund',fmt(selectedEmp.pf)],['ESI',fmt(selectedEmp.esi)],['Professional Tax',fmt(selectedEmp.pt)],['Income Tax (TDS)',fmt(selectedEmp.tax)]].map(([l,v])=>(
                <div key={l} className="flex-between text-xs py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{l}</span><span className="text-danger-400">-{v}</span>
                </div>
              ))}
            </div>
            <div className="flex-between p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl">
              <span className="font-bold text-white">Net Take-Home</span>
              <span className="text-2xl font-display font-bold text-accent-400">{fmt(selectedEmp.net)}</span>
            </div>
            <button className="btn-primary w-full justify-center mt-4 text-xs">
              <Download className="w-3.5 h-3.5"/>Download PDF Payslip
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
