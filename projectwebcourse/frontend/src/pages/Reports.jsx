import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Calendar, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = (import.meta.env.VITE_API_URL || '/api');

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${userData?.token}` } };
        
        const [incomeExpenseRes, budgetUsageRes] = await Promise.all([
          axios.get(`${API_URL}/reports/income-expense`, config),
          axios.get(`${API_URL}/reports/budget-usage`, config)
        ]);

        setData({
          incomeExpense: incomeExpenseRes.data.data,
          budgetUsage: budgetUsageRes.data.data
        });
      } catch (err) {
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const COLORS = ['#1a4331', '#f4a261', '#2a9d8f', '#e76f51', '#264653'];

  const incomeExpenseData = [
    { name: 'Income', value: data.incomeExpense.income },
    { name: 'Expense', value: data.incomeExpense.expense }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-forest-dark">Financial Reports</h1>
          <p className="text-forest/60">Analyze your income, expenses, and budget adherence.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-forest/10 rounded-xl text-forest font-bold flex items-center gap-2 hover:bg-forest/5 transition-all">
          <Download size={18} /> Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Expense Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <h3 className="text-xl font-bold text-forest-dark mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-success"/> Income vs Expense
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#2a9d8f' : '#e76f51'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-success/10 rounded-2xl border border-success/20">
              <p className="text-xs font-bold text-success uppercase tracking-wider mb-1">Total Income</p>
              <p className="text-xl font-black text-forest-dark">Rs. {data.incomeExpense.income.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-error/10 rounded-2xl border border-error/20">
              <p className="text-xs font-bold text-error uppercase tracking-wider mb-1">Total Expense</p>
              <p className="text-xl font-black text-forest-dark">Rs. {data.incomeExpense.expense.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Budget Adherence Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
          <h3 className="text-xl font-bold text-forest-dark mb-6 flex items-center gap-2">
            <PieChart size={24} className="text-secondary"/> Budget Utilization
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.budgetUsage}
                  dataKey="spentAmount"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {data.budgetUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Detailed History Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
        <h3 className="text-xl font-bold text-forest-dark mb-6 px-2 flex items-center gap-2">
          <FileText size={24} className="text-forest"/> Monthly Summaries
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-forest/40 uppercase tracking-widest border-b border-forest/5">
                <th className="px-4 py-4">Month</th>
                <th className="px-4 py-4">Limit</th>
                <th className="px-4 py-4">Spent</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.budgetUsage.map((b, i) => (
                <tr key={i} className="border-b border-forest/5 hover:bg-forest/5 transition-colors group">
                  <td className="px-4 py-4 font-bold text-forest-dark">{b.month}</td>
                  <td className="px-4 py-4 text-forest/70">Rs. {b.totalLimit.toLocaleString()}</td>
                  <td className="px-4 py-4 font-bold text-forest-dark">Rs. {b.spentAmount.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'exceeded' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
