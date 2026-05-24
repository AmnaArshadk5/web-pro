import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Users, CreditCard, FileText, Download, Search, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = (import.meta.env.VITE_API_URL || '/api');

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminReports = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${userData?.token}` } };
        
        const [volRes, balRes, logsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/reports/transaction-volume`, config),
          axios.get(`${API_URL}/admin/reports/system-balance`, config),
          axios.get(`${API_URL}/admin/audit-logs`, config)
        ]);

        setReports({
          volume: volRes.data.data,
          balance: balRes.data.data,
          logs: logsRes.data.data
        });
      } catch (err) {
        console.error('Failed to load admin reports');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminReports();
  }, []);

  const downloadCSV = () => {
    if (!reports?.logs) return;
    const headers = ['Action', 'Actor', 'Target', 'Details', 'Date'];
    const rows = reports.logs.map(log => [
      log.action,
      log.actorId?.name || 'System',
      `${log.targetType} (${log.targetId})`,
      JSON.stringify(log.details || {}).replace(/,/g, ';'),
      new Date(log.createdAt).toLocaleString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RuralPay_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const filteredLogs = reports.logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.actorId?.name || 'System').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Capital', value: `Rs. ${reports.volume.volume.toLocaleString()}`, icon: <Activity />, color: 'text-forest', bg: 'bg-forest/10' },
    { label: 'System Liquidity', value: `Rs. ${reports.balance.balance.toLocaleString()}`, icon: <CreditCard />, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Platform Users', value: reports.balance.count, icon: <Users />, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Audit Records', value: reports.logs.length, icon: <History />, color: 'text-peach', bg: 'bg-peach/10' },
  ];

  const pieData = [
    { name: 'Held Balance', value: reports.balance.balance },
    { name: 'Available Liquidity', value: Math.max(0, reports.volume.volume - reports.balance.balance) }
  ];

  const COLORS = ['#1a4331', '#d4a373'];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-forest-dark tracking-tight">Financial Intelligence</h1>
          <p className="text-forest/60 font-medium mt-1">Real-time platform health and administrative oversight.</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-3 px-6 py-4 bg-white border border-forest/10 text-forest font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-forest hover:text-white transition-all shadow-xl"
        >
          <Download size={16} /> Export Audit Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col gap-4 group"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
              {React.cloneElement(stat.icon, { size: 24 })}
            </div>
            <div>
              <p className="text-[10px] font-black text-forest/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-forest-dark tracking-tighter">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 glass-card p-0 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-forest/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-forest/5">
            <h3 className="text-xl font-black text-forest-dark flex items-center gap-3 italic">
              <FileText size={20} className="text-terracotta" /> System Audit Trail
            </h3>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/30" size={16} />
              <input 
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-forest/10 rounded-xl text-xs font-bold focus:outline-none focus:border-forest/30"
              />
            </div>
          </div>
          
          <div className="p-4 space-y-3 max-h-[550px] overflow-y-auto custom-scrollbar bg-white/30">
            <AnimatePresence>
              {filteredLogs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-5 rounded-[24px] bg-white border border-forest/5 hover:border-forest/20 hover:shadow-xl transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-forest-dark bg-mint px-3 py-1.5 rounded-lg shadow-sm">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-forest/40 font-bold font-mono">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-black text-forest-dark group-hover:text-forest transition-colors">By: {log.actorId?.name || 'System'}</p>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="px-3 py-2 bg-forest/5 rounded-xl">
                      <p className="text-[8px] font-black text-forest/40 uppercase mb-0.5 tracking-tighter">Target Resource</p>
                      <p className="text-[10px] font-bold text-forest-dark truncate italic">{log.targetType}</p>
                    </div>
                    <div className="px-3 py-2 bg-forest/5 rounded-xl">
                      <p className="text-[8px] font-black text-forest/40 uppercase mb-0.5 tracking-tighter">Resource ID</p>
                      <p className="text-[10px] font-bold text-forest-dark truncate font-mono">{log.targetId}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 glass-card flex flex-col h-fit">
          <div className="p-8 pb-0 text-center">
            <h3 className="text-xl font-black text-forest-dark italic">Liquidity Analysis</h3>
            <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest mt-2">Fund Distribution & Availability</p>
          </div>
          
          <div className="h-[350px] relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                    data={pieData}
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                 />
                 <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-[10px] font-black text-forest/30 uppercase tracking-[0.2em] mb-1">Total</p>
               <p className="text-2xl font-black text-forest-dark tracking-tighter">Rs. {reports.volume.volume.toLocaleString()}</p>
             </div>
          </div>
          
          <div className="px-8 pb-8">
            <div className="p-6 bg-forest-dark rounded-[32px] text-wheat shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <p className="text-[11px] font-medium text-white/70 leading-relaxed italic relative z-10">
                "The platform currently maintains a stable reserve of Rs. {reports.balance.balance.toLocaleString()} across {reports.balance.count} verified wallets, supporting decentralized community growth."
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReports;
