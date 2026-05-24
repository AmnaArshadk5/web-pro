import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Activity, Flag, Shield, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, flaggedRes] = await Promise.all([
          adminService.getDashboardAnalytics(),
          adminService.getFlaggedTransactions()
        ]);
        setStats(statsRes.data);
        setFlagged(flaggedRes.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: (stats?.totalUsers || 0), icon: <Users />, color: 'bg-forest/10 text-forest' },
          { label: 'Platform Volume', value: `Rs. ${(stats?.transactionVolume || 0).toLocaleString()}`, icon: <CreditCard />, color: 'bg-secondary/10 text-secondary' },
          { label: 'Active Sessions', value: stats?.activeSessions || 42, icon: <Activity />, color: 'bg-success/10 text-success' },
          { label: 'Flagged', value: flagged?.length || 0, icon: <Flag />, color: 'bg-error/10 text-error' }
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>{item.icon}</div>
            <div><p className="text-[10px] font-black uppercase tracking-widest text-forest/40">{item.label}</p><p className="text-xl font-black text-forest-dark">{item.value}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-forest-dark flex items-center gap-2"><Shield size={24} className="text-forest" /> Fraud Monitoring Heatmap</h3>
            <div className="flex gap-2"><div className="px-3 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold">SYSTEM SECURE</div></div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{n:'Mon',v:400},{n:'Tue',v:300},{n:'Wed',v:600},{n:'Thu',v:800},{n:'Fri',v:500},{n:'Sat',v:900},{n:'Sun',v:700}]}>
                <XAxis dataKey="n" hide /><YAxis hide /><Tooltip />
                <Area type="monotone" dataKey="v" stroke="#E07A5F" fill="#E07A5F" fillOpacity={0.1} strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card flex flex-col">
           <h3 className="text-xl font-black text-forest-dark mb-6 flex items-center gap-2"><AlertTriangle size={20} className="text-error" /> Urgent Alerts</h3>
           <div className="space-y-4 flex-1">
              {flagged.slice(0, 4).map((f, i) => (
                <div key={i} className="p-4 rounded-2xl bg-error/5 border border-error/10 flex flex-col gap-1">
                   <p className="text-xs font-black text-error">SUSPICIOUS {f.type.toUpperCase()}</p>
                   <p className="text-sm font-bold text-forest-dark">Rs. {(f.amount || 0).toLocaleString()}</p>
                   <p className="text-[10px] text-forest/40">{f.transactionId}</p>
                </div>
              ))}
              {flagged.length === 0 && <div className="text-center py-10 text-forest/40 italic">No threats detected</div>}
           </div>
           <Link to="/admin/flagged">
             <button className="w-full mt-6 py-4 rounded-2xl bg-error text-white font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-error/20">Review All Threats</button>
           </Link>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-black text-forest-dark">System Liquidity</h3>
           <div className="flex items-center gap-2 text-success font-bold text-sm"><TrendingUp size={16} /> +4.2% Growth</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-6 rounded-[24px] bg-forest-dark text-wheat shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Reserved Capital</p>
              <p className="text-3xl font-black tracking-tighter">Rs. {(stats?.systemBalance || 0).toLocaleString()}</p>
           </div>
           <div className="p-6 rounded-[24px] bg-white border border-forest/5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-forest/40 mb-2">Outstanding BNPL</p>
              <p className="text-3xl font-black text-forest-dark tracking-tighter">Rs. 450k</p>
           </div>
           <div className="p-6 rounded-[24px] bg-white border border-forest/5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-forest/40 mb-2">Community Fund</p>
              <p className="text-3xl font-black text-forest-dark tracking-tighter">Rs. 89k</p>
           </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
