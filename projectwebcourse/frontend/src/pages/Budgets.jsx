import React, { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import { Target, CheckCircle, AlertCircle, AlertTriangle, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring' } }
};

const Budgets = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ limit: '' });

  const fetchBudget = async () => {
    try {
      const res = await budgetService.getCurrentBudget();
      setBudget(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    try {
      await budgetService.createBudget({
        month: currentMonth,
        totalLimit: parseFloat(formData.limit)
      });
      fetchBudget();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to set budget');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'safe': return 'bg-success text-white shadow-success/30';
      case 'nearLimit': return 'bg-amber-500 text-white shadow-amber-500/30';
      case 'exceeded': return 'bg-error text-white shadow-error/30';
      default: return 'bg-primary text-white shadow-primary/30';
    }
  };

  const getStatusGradient = (status) => {
    switch(status) {
      case 'safe': return 'from-emerald-400 to-emerald-600';
      case 'nearLimit': return 'from-amber-400 to-amber-600';
      case 'exceeded': return 'from-red-500 to-red-700';
      default: return 'from-emerald-400 to-emerald-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'safe': return <CheckCircle size={20} className="mr-2" />;
      case 'nearLimit': return <AlertTriangle size={20} className="mr-2" />;
      case 'exceeded': return <AlertCircle size={20} className="mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Target size={32} className="text-secondary" />
        <div>
          <h1 className="text-3xl font-bold text-forest-dark">Budget Planner</h1>
          <p className="text-gray-500 mt-1">Set limits and track your monthly spending</p>
        </div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        {!budget ? (
          <div className="glass-card max-w-lg mx-auto p-10 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Crosshair size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-forest-dark mb-2">Set this month's budget</h2>
            <p className="text-gray-500 mb-8">Take control of your finances by setting a hard limit for the current month.</p>
            
            <form onSubmit={handleSubmit} className="text-left space-y-6">
              <div>
                <label className="form-label">Monthly Limit (Rs.)</label>
                <input 
                  type="number" 
                  min="1" 
                  className="form-input text-lg font-bold text-center py-4" 
                  placeholder="e.g. 50000"
                  value={formData.limit} 
                  onChange={e=>setFormData({limit: e.target.value})} 
                  required 
                />
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-lg">Lock Budget</button>
            </form>
          </div>
        ) : (
          <div className="glass-card max-w-2xl mx-auto p-10 relative overflow-hidden group">
            {/* Background Blob matching status */}
            <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${getStatusGradient(budget.status)} transition-all duration-1000`}></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Budget for {new Date(budget.month).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                  <h2 className="text-5xl font-extrabold text-forest-dark">
                    <span className="text-2xl mr-1 text-gray-400">Rs.</span>{budget.totalLimit.toLocaleString()}
                  </h2>
                </div>
                
                <div className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-lg uppercase tracking-wide ${getStatusColor(budget.status)}`}>
                  {getStatusIcon(budget.status)} {budget.status}
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="mb-6 relative">
                <div className="flex justify-between text-sm font-bold text-forest-dark mb-3">
                  <span>Spent: Rs. {budget.spentAmount.toLocaleString()}</span>
                  <span className="text-gray-400">{Math.min(100, Math.round((budget.spentAmount / budget.totalLimit) * 100))}%</span>
                </div>
                
                <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${getStatusGradient(budget.status)} relative overflow-hidden`}
                    style={{ 
                      width: `${Math.min((budget.spentAmount / budget.totalLimit) * 100, 100)}%`,
                      transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                  >
                    {/* Shimmer effect inside progress bar */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-forest-dark">Rs. {budget.spentAmount.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Remaining Safely</p>
                  <p className="text-xl font-bold text-forest-dark">Rs. {Math.max(budget.totalLimit - budget.spentAmount, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Budgets;
