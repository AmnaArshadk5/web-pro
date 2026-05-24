import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCcw, Bell, CreditCard, Activity, ChevronRight, TrendingUp, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = (import.meta.env.VITE_API_URL || '/api');

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loanStats, setLoanStats] = useState({ active: 0, totalDebt: 0, nextInstallment: null });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = userData?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [walletRes, txRes, budgetRes, loanRes] = await Promise.all([
          axios.get(`${API_URL}/wallet`, config),
          axios.get(`${API_URL}/transactions`, config),
          axios.get(`${API_URL}/budgets/current`, config),
          axios.get(`${API_URL}/loans`, config)
        ]);
        setWallet(walletRes.data.data);
        const txArray = txRes.data.data || [];
        setTransactions(txArray.slice(0, 5));
        
        const loanArray = loanRes.data.data || [];
        setLoans(loanArray);
        const activeLoans = loanArray.filter(l => l.status === 'active');
        const totalDebt = activeLoans.reduce((sum, l) => sum + l.remainingAmount, 0);
        const nextLoan = activeLoans.length > 0 ? activeLoans.sort((a,b) => new Date(a.nextInstallmentDate) - new Date(b.nextInstallmentDate))[0] : null;
        setLoanStats({ active: activeLoans.length, totalDebt, nextInstallment: nextLoan });

        const last7Days = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString('en-US', { weekday: 'short' });
        });
        const aggregatedData = last7Days.map(day => ({ name: day, spend: 0 }));
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        txArray.forEach(txn => {
           if ((txn.type === 'withdrawal' || txn.type === 'transfer') && txn.status === 'successful') {
              const txnDateObj = new Date(txn.createdAt);
              if (txnDateObj >= sevenDaysAgo) {
                const txnDate = txnDateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const index = aggregatedData.findIndex(d => d.name === txnDate);
                if(index !== -1) aggregatedData[index].spend += txn.amount;
              }
           }
        });
        setChartData(aggregatedData);
        setBudget(budgetRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={fadeUp} className="lg:col-span-2 relative overflow-hidden rounded-[40px] p-10 text-wheat shadow-2xl bg-gradient-to-br from-forest via-forest-light to-forest-dark border border-white/10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-mint/10 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-peach/10 rounded-full blur-[80px] animate-blob delay-2000"></div>
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[280px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest border border-white/20 mb-4 inline-block">Primary Vault</span>
                <h2 className="text-5xl lg:text-7xl font-black tracking-tighter">
                  <span className="text-3xl mr-2 text-mint/60">Rs.</span>
                  {wallet?.balance?.toLocaleString() || '0'}
                </h2>
                <p className="text-mint/40 mt-4 font-bold flex items-center gap-2">
                   <TrendingUp size={16} className="text-success" /> +12.5% from last month
                </p>
              </div>
              <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
                <CreditCard size={32} className="text-mint" />
              </div>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/wallet" className="px-8 py-4 rounded-2xl bg-wheat text-forest font-black shadow-xl hover:bg-white transition-all active:scale-95 flex items-center gap-2">
                <ArrowUpRight size={20} /> Deposit
              </Link>
              <Link to="/wallet" className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black border border-white/20 hover:bg-white/20 transition-all active:scale-95 flex items-center gap-2">
                <ArrowDownRight size={20} /> Withdraw
              </Link>
              <Link to="/wallet" className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black border border-white/20 hover:bg-white/20 transition-all active:scale-95 flex items-center gap-2">
                <RefreshCcw size={20} /> Transfer
              </Link>
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="glass-card flex flex-col justify-between overflow-hidden">
           <div className="space-y-6">
              <h3 className="text-xl font-black text-forest-dark flex items-center gap-2"><Zap size={24} className="text-peach" /> Quick Insights</h3>
              <div className="p-5 rounded-[24px] bg-gradient-to-br from-white to-wheat/30 border border-forest/5 shadow-sm">
                 <p className="text-[10px] font-black uppercase tracking-widest text-forest/40 mb-2">Active Financing</p>
                 <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-forest-dark">Rs. {loanStats.totalDebt.toLocaleString()}</span>
                    <span className="text-xs font-bold text-terracotta">{loanStats.active} Plans</span>
                 </div>
                 <div className="w-full bg-forest/5 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-terracotta h-full w-[45%] rounded-full"></div>
                 </div>
              </div>
              <div className="p-5 rounded-[24px] bg-gradient-to-br from-white to-mint/20 border border-forest/5 shadow-sm">
                 <p className="text-[10px] font-black uppercase tracking-widest text-forest/40 mb-2">Heritage Score</p>
                 <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-forest-dark">A+ Stable</span>
                    <Shield size={20} className="text-success" />
                 </div>
              </div>
           </div>
           <Link to="/financing" className="w-full py-4 rounded-2xl bg-forest/5 text-forest font-bold text-sm hover:bg-forest/10 transition-all text-center">Manage All Financing</Link>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-forest-dark">Weekly Trajectory</h3>
              <p className="text-sm text-forest/60">Spending patterns for the last 7 days</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-forest/5 border border-forest/10 text-xs font-bold text-forest">Last 7 Days</div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4332" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1B4332" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#1B4332', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px'}} itemStyle={{color: '#1B4332', fontWeight: 800}} />
                <Area type="monotone" dataKey="spend" stroke="#1B4332" strokeWidth={4} fillOpacity={1} fill="url(#colorSpend)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="glass-card flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-forest-dark">History</h3>
            <Link to="/transactions" className="text-forest text-sm font-bold flex items-center gap-1 hover:underline">All <ChevronRight size={16} /></Link>
          </div>
          <div className="space-y-5 flex-1">
            {transactions.length > 0 ? transactions.map((tx, i) => (
              <motion.div key={tx._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${tx.type === 'deposit' || (tx.type === 'transfer' && tx.receiverId?._id === user._id) ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {tx.type === 'deposit' ? <ArrowDownRight size={20}/> : <ArrowUpRight size={20}/>}
                  </div>
                  <div>
                    <p className="text-sm font-black text-forest-dark capitalize">{tx.type}</p>
                    <p className="text-[10px] text-forest/40 font-bold uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${tx.type === 'deposit' || (tx.type === 'transfer' && tx.receiverId?._id === user._id) ? 'text-success' : 'text-forest-dark'}`}>
                    {tx.type === 'deposit' || (tx.type === 'transfer' && tx.receiverId?._id === user._id) ? '+' : '-'} Rs. {tx.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-forest/40 font-black uppercase tracking-widest">{tx.status}</p>
                </div>
              </motion.div>
            )) : <div className="text-center py-10 opacity-40 italic">No transactions yet</div>}
          </div>
        </motion.div>
      </div>
      <motion.div variants={fadeUp} className="glass-card">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
               <h3 className="text-2xl font-black text-forest-dark mb-2">Financial Health</h3>
               <p className="text-forest/60 mb-6">Based on your spending and budget adherence this month.</p>
               <div className="flex items-center gap-10">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                     <svg className="w-full h-full -rotate-90">
                        <circle cx="64" cy="64" r="58" fill="transparent" stroke="rgba(27,67,50,0.05)" strokeWidth="12" />
                        <circle cx="64" cy="64" r="58" fill="transparent" stroke="#1B4332" strokeWidth="12" strokeDasharray="364" strokeDashoffset={364 - (364 * 0.85)} strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-forest-dark">85</span>
                        <span className="text-[10px] font-black uppercase text-forest/40">Score</span>
                     </div>
                  </div>
                  <div className="space-y-4 flex-1">
                     <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-forest/60">Budget Utilization</span>
                        <span className="font-black text-forest-dark">Good</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-forest/60">Savings Consistency</span>
                        <span className="font-black text-success">Excellent</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-forest/60">Credit Score</span>
                        <span className="font-black text-forest-dark">780</span>
                     </div>
                  </div>
               </div>
            </div>
            <div className="bg-forest/5 p-8 rounded-[32px] flex flex-col justify-between border border-forest/10">
               <h4 className="text-lg font-black text-forest-dark mb-4">Upcoming Harvest</h4>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-peach"></div>
                    <p className="text-sm font-bold text-forest/70">
                      Next Installment: <span className="text-forest-dark font-black">Rs. {loanStats.nextInstallment?.installmentAmount.toLocaleString() || '0'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <p className="text-sm font-bold text-forest/70">
                      Due Date: <span className="text-forest-dark font-black">{loanStats.nextInstallment ? new Date(loanStats.nextInstallment.nextInstallmentDate).toLocaleDateString() : 'N/A'}</span>
                    </p>
                  </div>
               </div>
               <Link to="/financing" className="mt-8 btn-primary py-3 text-sm text-center">View Schedule</Link>
            </div>
         </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
