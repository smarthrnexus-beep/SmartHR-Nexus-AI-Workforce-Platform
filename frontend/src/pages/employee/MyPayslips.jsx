import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Download, Eye, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

const PAYSLIPS = [
  { month:'December 2025', gross:9540, deductions:1930, net:7610, pf:720, tax:940, status:'processed', basic:6000, hra:2400, conv:300, med:240, special:600 },
  { month:'November 2025', gross:9540, deductions:1930, net:7610, pf:720, tax:940, status:'paid',      basic:6000, hra:2400, conv:300, med:240, special:600 },
  { month:'October 2025',  gross:9540, deductions:1930, net:7610, pf:720, tax:940, status:'paid',      basic:6000, hra:2400, conv:300, med:240, special:600 },
  { month:'September 2025',gross:9540, deductions:1930, net:7610, pf:720, tax:940, status:'paid',      basic:6000, hra:2400, conv:300, med:240, special:600 },
  { month:'August 2025',   gross:9540, deductions:1930, net:7610, pf:720, tax:940, status:'paid',      basic:6000, hra:2400, conv:300, med:240, special:600 },
  { month:'July 2025',     gross:9540, deductions:1930, net:7610, pf:720, tax:940, status:'paid',      basic:6000, hra:2400, conv:300, med:240, special:600 },
];

const CHART_DATA = PAYSLIPS.slice().reverse().map(p => ({ month: p.month.split(' ')[0], gross: p.gross, net: p.net }));
const fmt = n => `$${n.toLocaleString()}`;

export default function MyPayslips() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-5">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <h1 className="font-display text-2xl font-bold text-white">My Payslips</h1>
        <p className="text-slate-400 text-sm mt-0.5">Salary history and payment details</p>
      </motion.div>

      {/* CTC summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Monthly CTC',       value:fmt(9540),  color:'text-primary-400', bg:'bg-primary-500/10' },
          { label:'In-Hand Salary',    value:fmt(7610),  color:'text-accent-400',  bg:'bg-accent-500/10'  },
          { label:'Annual CTC',        value:'$114.5k',  color:'text-warning-400', bg:'bg-warning-500/10' },
          { label:'Total Tax YTD',     value:fmt(5640),  color:'text-danger-400',  bg:'bg-danger-500/10'  },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} className="stat-card">
            <div className={`w-8 h-8 rounded-lg flex-center ${s.bg}`}><DollarSign className={`w-4 h-4 ${s.color}`}/></div>
            <div>
              <p className="text-xl font-display font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.15}} className="glass-card p-5">
        <h3 className="font-semibold text-white text-sm mb-4">6-Month Salary Trend</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={CHART_DATA} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:'#64748b',fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} tick={{fill:'#64748b',fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip formatter={v=>[fmt(v)]} contentStyle={{background:'#1e293b',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',fontSize:'11px'}}/>
            <Bar dataKey="gross" name="Gross" fill="rgba(99,102,241,0.35)" radius={[4,4,0,0]}/>
            <Bar dataKey="net"   name="Net"   fill="#6366f1"              radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Payslip list */}
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-semibold text-white text-sm">Payslip History</h3>
        </div>
        <div className="divide-y divide-white/5">
          {PAYSLIPS.map((p,i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/5 transition-colors group">
              <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary-400"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{p.month}</p>
                <p className="text-xs text-slate-500">Gross: {fmt(p.gross)} · Deductions: {fmt(p.deductions)}</p>
              </div>
              <div className="text-right mr-4">
                <p className="text-sm font-bold text-accent-400">{fmt(p.net)}</p>
                <span className={`badge text-[10px] ${p.status==='paid'?'badge-success':'badge-warning'}`}>{p.status}</span>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>setSelected(p)} className="btn-ghost p-1.5"><Eye className="w-3.5 h-3.5"/></button>
                <button className="btn-ghost p-1.5"><Download className="w-3.5 h-3.5"/></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payslip modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex-center p-4" onClick={()=>setSelected(null)}>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-sm p-6"
            onClick={e=>e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 className="font-display font-bold text-white">Payslip — {selected.month}</h3>
              <button onClick={()=>setSelected(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Earnings</p>
              {[['Basic',fmt(selected.basic)],['HRA',fmt(selected.hra)],['Conveyance',fmt(selected.conv)],['Medical',fmt(selected.med)],['Special',fmt(selected.special)]].map(([l,v])=>(
                <div key={l} className="flex-between text-xs py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{l}</span><span className="text-slate-200">{v}</span>
                </div>
              ))}
              <div className="flex-between py-2 text-xs font-bold">
                <span className="text-white">Gross</span><span className="text-primary-400">{fmt(selected.gross)}</span>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Deductions</p>
              {[['PF',fmt(selected.pf)],['Income Tax',fmt(selected.tax)],['Other',fmt(selected.deductions-selected.pf-selected.tax)]].map(([l,v])=>(
                <div key={l} className="flex-between text-xs py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{l}</span><span className="text-danger-400">-{v}</span>
                </div>
              ))}
            </div>
            <div className="flex-between p-3 bg-accent-500/10 border border-accent-500/20 rounded-xl mb-4">
              <span className="text-sm font-bold text-white">Net Pay</span>
              <span className="text-xl font-display font-bold text-accent-400">{fmt(selected.net)}</span>
            </div>
            <button className="btn-primary w-full justify-center text-xs"><Download className="w-3.5 h-3.5"/>Download PDF</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
