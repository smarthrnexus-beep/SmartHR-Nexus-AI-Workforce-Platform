import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const LEAVE_BALANCE = [
  { type:'Annual',    total:21, used:7,  remaining:14, color:'#6366f1' },
  { type:'Sick',      total:10, used:3,  remaining:7,  color:'#10b981' },
  { type:'Casual',    total:7,  used:2,  remaining:5,  color:'#f59e0b' },
  { type:'Maternity', total:180,used:0,  remaining:180,color:'#8b5cf6' },
];

const LEAVE_HISTORY = [
  { id:1, type:'Annual',  from:'2025-11-20', to:'2025-11-22', days:3, reason:'Family vacation',       status:'approved', approvedBy:'Alex Morgan',  comments:'Enjoy your trip!' },
  { id:2, type:'Sick',    from:'2025-10-08', to:'2025-10-08', days:1, reason:'Fever and cold',        status:'approved', approvedBy:'Alex Morgan',  comments:'Get well soon.'   },
  { id:3, type:'Casual',  from:'2025-09-15', to:'2025-09-16', days:2, reason:'Personal work',         status:'approved', approvedBy:'Alex Morgan',  comments:'Approved.'        },
  { id:4, type:'Annual',  from:'2025-12-26', to:'2025-12-27', days:2, reason:'Holiday extended',      status:'pending',  approvedBy:'—',             comments:''               },
  { id:5, type:'Sick',    from:'2025-08-02', to:'2025-08-02', days:1, reason:'Medical appointment',   status:'rejected', approvedBy:'Alex Morgan',  comments:'Insufficient balance at that time.' },
];

const STATUS_MAP = {
  approved: { cls:'badge-success', icon: CheckCircle, color:'text-accent-400' },
  pending:  { cls:'badge-warning', icon: Clock,       color:'text-warning-400' },
  rejected: { cls:'badge-danger',  icon: XCircle,     color:'text-danger-400' },
};

const LEAVE_TYPES = ['Annual','Sick','Casual','Maternity','Paternity','Unpaid'];

export default function MyLeaves() {
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ type:'Annual', from:'', to:'', reason:'' });
  const [history, setHistory] = useState(LEAVE_HISTORY);

  const calcDays = () => {
    if (!form.from || !form.to) return 0;
    const diff = (new Date(form.to) - new Date(form.from)) / 86400000 + 1;
    return Math.max(0, diff);
  };

  const handleSubmit = () => {
    if (!form.from || !form.to || !form.reason) return;
    setHistory(prev => [{
      id: prev.length + 1, ...form,
      days: calcDays(), status:'pending', approvedBy:'—', comments:'',
    }, ...prev]);
    setForm({ type:'Annual', from:'', to:'', reason:'' });
    setShowApply(false);
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">My Leaves</h1>
          <p className="text-slate-400 text-sm mt-0.5">Track and manage your leave requests</p>
        </div>
        <button onClick={()=>setShowApply(true)} className="btn-primary text-xs">
          <Plus className="w-3.5 h-3.5"/>Apply for Leave
        </button>
      </motion.div>

      {/* Leave balance cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {LEAVE_BALANCE.map((lb,i) => (
          <motion.div key={lb.type} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            className="glass-card p-4">
            <div className="flex-between mb-3">
              <p className="text-xs font-semibold text-white">{lb.type} Leave</p>
              <span className="text-[10px] text-slate-500">{lb.used}/{lb.total}</span>
            </div>
            <p className="text-3xl font-display font-bold" style={{color:lb.color}}>{lb.remaining}</p>
            <p className="text-[10px] text-slate-500 mb-2">days remaining</p>
            <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{width:`${(lb.remaining/lb.total)*100}%`, background:lb.color}}/>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leave history */}
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex-between">
          <h3 className="font-semibold text-white text-sm">Leave History</h3>
          <span className="text-xs text-slate-500">{history.length} records</span>
        </div>
        <div className="divide-y divide-white/5">
          {history.map((leave) => {
            const s = STATUS_MAP[leave.status];
            const StatusIcon = s.icon;
            return (
              <div key={leave.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-primary-400"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex-between flex-wrap gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{leave.type} Leave</span>
                        <span className={clsx('badge text-[10px]', s.cls)}>{leave.status}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{leave.days} day{leave.days>1?'s':''}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">
                      {new Date(leave.from).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                      {leave.from !== leave.to && ` → ${new Date(leave.to).toLocaleDateString('en-US',{month:'short',day:'numeric'})}`}
                      {' · '}{leave.reason}
                    </p>
                    {leave.comments && (
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <StatusIcon className={clsx('w-3 h-3', s.color)}/>{leave.approvedBy}: "{leave.comments}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Apply modal */}
      <AnimatePresence>
        {showApply && (
          <div className="fixed inset-0 bg-black/60 z-50 flex-center p-4" onClick={()=>setShowApply(false)}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-md p-6"
              onClick={e=>e.stopPropagation()}>
              <div className="flex-between mb-5">
                <h3 className="font-display font-bold text-white">Apply for Leave</h3>
                <button onClick={()=>setShowApply(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Leave Type</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="input-field text-sm">
                    {LEAVE_TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">From Date</label>
                    <input type="date" value={form.from} onChange={e=>setForm({...form,from:e.target.value})} className="input-field text-sm"/>
                  </div>
                  <div>
                    <label className="input-label">To Date</label>
                    <input type="date" value={form.to} onChange={e=>setForm({...form,to:e.target.value})} className="input-field text-sm"/>
                  </div>
                </div>
                {calcDays() > 0 && (
                  <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl text-xs text-primary-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0"/>
                    {calcDays()} working day{calcDays()>1?'s':''} will be deducted from your {form.type} leave balance.
                  </div>
                )}
                <div>
                  <label className="input-label">Reason</label>
                  <textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}
                    placeholder="Brief reason for your leave..." rows={3}
                    className="input-field text-sm resize-none"/>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={()=>setShowApply(false)} className="btn-secondary flex-1 justify-center text-xs">Cancel</button>
                <button onClick={handleSubmit} className="btn-primary flex-1 justify-center text-xs">
                  <CheckCircle className="w-3.5 h-3.5"/>Submit Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
