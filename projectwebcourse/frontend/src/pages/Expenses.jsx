import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import { PlusCircle, Trash2, Receipt, Tags, Edit, Filter, PieChart, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', amount: '', categoryId: 'General', date: new Date().toISOString().split('T')[0]
  });

  const [filters, setFilters] = useState({ category: '', search: '' });

  const fetchExpenses = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);

      const [expRes, sumRes] = await Promise.all([
        expenseService.getExpenses(queryParams.toString()),
        expenseService.getExpenseSummary()
      ]);
      setExpenses(expRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await expenseService.updateExpense(editingId, formData);
        setEditingId(null);
      } else {
        await expenseService.createExpense(formData);
      }
      setFormData({ title: '', amount: '', categoryId: 'General', date: new Date().toISOString().split('T')[0] });
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setFormData({
      title: exp.title,
      amount: exp.amount,
      categoryId: exp.categoryId,
      date: new Date(exp.date).toISOString().split('T')[0]
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', amount: '', categoryId: 'General', date: new Date().toISOString().split('T')[0] });
  };

  if (loading && expenses.length === 0) return <div className="p-10 text-center text-forest">Loading Expenses...</div>;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-forest-dark flex items-center gap-3">
            <Receipt size={32} className="text-secondary" /> Expense Tracker
          </h1>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} className="glass-card flex items-center gap-4 bg-gradient-to-r from-forest/5 to-transparent">
            <div className="p-4 bg-white/60 rounded-2xl"><Calendar className="text-terracotta"/></div>
            <div>
              <p className="text-xs font-bold text-forest/60 uppercase">This Month</p>
              <h3 className="text-2xl font-bold text-forest-dark">Rs. {summary.currentMonthTotal.toLocaleString()}</h3>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-card flex items-center gap-4 bg-gradient-to-r from-forest/5 to-transparent">
            <div className="p-4 bg-white/60 rounded-2xl"><Receipt className="text-forest"/></div>
            <div>
              <p className="text-xs font-bold text-forest/60 uppercase">Total Lifetime</p>
              <h3 className="text-2xl font-bold text-forest-dark">Rs. {summary.totalAmount.toLocaleString()}</h3>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-card flex items-center gap-4 bg-gradient-to-r from-forest/5 to-transparent">
            <div className="p-4 bg-white/60 rounded-2xl"><PieChart className="text-secondary"/></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-forest/60 uppercase mb-1">Top Category</p>
              {Object.entries(summary.categoryTotals).length > 0 ? (
                <div className="flex justify-between items-center text-sm font-bold text-forest-dark">
                  <span>{Object.entries(summary.categoryTotals).sort((a,b)=>b[1]-a[1])[0][0]}</span>
                  <span>Rs. {Object.entries(summary.categoryTotals).sort((a,b)=>b[1]-a[1])[0][1].toLocaleString()}</span>
                </div>
              ) : <p className="text-sm font-bold">N/A</p>}
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Add/Edit Form */}
        <motion.div variants={fadeUp} className="glass-card flex flex-col h-fit">
          <div className="flex items-center gap-2 mb-6 text-forest-dark font-bold text-lg">
            {editingId ? <Edit size={20} className="text-secondary"/> : <PlusCircle size={20} className="text-primary"/>} 
            {editingId ? 'Edit Expense' : 'Add New Expense'}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="form-label">Title</label><input type="text" className="form-input" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required /></div>
            <div><label className="form-label">Amount (Rs.)</label><input type="number" min="0.01" step="0.01" className="form-input" value={formData.amount} onChange={e=>setFormData({...formData, amount: e.target.value})} required /></div>
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" value={formData.categoryId} onChange={e=>setFormData({...formData, categoryId: e.target.value})}>
                <option value="General">General</option>
                <option value="Agriculture">Agriculture Tools</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>
            <div><label className="form-label">Date</label><input type="date" className="form-input" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} required /></div>
            
            <div className="pt-4 flex gap-3">
              {editingId && <button type="button" onClick={cancelEdit} className="btn-secondary flex-1">Cancel</button>}
              <button type="submit" className="btn-primary flex-1">{editingId ? 'Update' : 'Save'} Expense</button>
            </div>
          </form>
        </motion.div>

        {/* Expense Table */}
        <motion.div variants={fadeUp} className="xl:col-span-2 glass-card p-0 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-white/50">
            <h2 className="text-lg font-bold text-forest-dark">Expense History</h2>
            <div className="flex gap-2">
              <input type="text" placeholder="Search title..." className="form-input py-1.5 text-sm w-40" value={filters.search} onChange={e=>setFilters({...filters, search: e.target.value})} />
              <select className="form-input py-1.5 text-sm w-36" value={filters.category} onChange={e=>setFilters({...filters, category: e.target.value})}>
                <option value="">All Categories</option>
                <option value="General">General</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-forest/5 text-forest/70 text-sm">
                <tr><th className="p-4">Date</th><th className="p-4">Title</th><th className="p-4">Category</th><th className="p-4 text-right">Amount</th><th className="p-4 text-center">Action</th></tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr><td colSpan="5" className="p-12 text-center text-gray-400">No expenses found.</td></tr>
                ) : (
                  expenses.map(exp => (
                    <tr key={exp._id} className="border-b border-forest/5 hover:bg-white/40 group">
                      <td className="p-4 text-sm text-gray-500">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="p-4 font-medium text-forest-dark">{exp.title}</td>
                      <td className="p-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest/10 text-forest">{exp.categoryId}</span></td>
                      <td className="p-4 font-bold text-forest-dark text-right">Rs. {exp.amount.toLocaleString()}</td>
                      <td className="p-4 text-center flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(exp)} className="p-1.5 text-terracotta hover:bg-terracotta/10 rounded-lg"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(exp._id)} className="p-1.5 text-error hover:bg-error/10 rounded-lg"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default Expenses;
