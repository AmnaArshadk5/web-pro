import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search, Filter, ArrowRight, User, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';

const API_URL = (import.meta.env.VITE_API_URL || '/api');

const AdminFinancing = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchLoans = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const res = await axios.get(`${API_URL}/loans/admin`, config);
      setLoans(res.data.data);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setProcessingId(id);
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      
      const res = await axios.post(`${API_URL}/loans/${id}/${action}`, {}, config);
      
      setMessage({ type: 'success', text: res.data.message });
      fetchLoans();
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || `Failed to ${action} loan` });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredLoans = loans.filter(l => filter === 'all' || l.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-forest-dark">Financing Queue</h1>
          <p className="text-forest/60">Review and approve pending Buy Now Pay Later applications.</p>
        </div>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={`p-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl ${message.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {message.text}
        </motion.div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card bg-white/50 border-white/80 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest/10 flex items-center justify-center text-forest">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-forest/40 uppercase tracking-widest">Pending Review</p>
            <p className="text-2xl font-black text-forest-dark">{loans.filter(l => l.status === 'pending').length}</p>
          </div>
        </div>
        <div className="glass-card bg-white/50 border-white/80 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-forest/40 uppercase tracking-widest">Active Loans</p>
            <p className="text-2xl font-black text-forest-dark">{loans.filter(l => l.status === 'active').length}</p>
          </div>
        </div>
        <div className="glass-card bg-white/50 border-white/80 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-forest/40 uppercase tracking-widest">Rejected</p>
            <p className="text-2xl font-black text-forest-dark">{loans.filter(l => l.status === 'rejected').length}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 w-fit">
        {['pending', 'active', 'rejected', 'all'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-forest text-wheat shadow-lg' : 'text-forest/40 hover:text-forest'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Applications Table/Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredLoans.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center glass-card border-dashed">
              <p className="text-forest/40 font-bold uppercase tracking-widest">No applications found in this queue</p>
            </motion.div>
          ) : (
            filteredLoans.map((loan) => (
              <motion.div
                key={loan._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card group overflow-hidden border-white/80"
              >
                <div className="flex flex-col lg:flex-row items-stretch">
                  {/* User & Product Info */}
                  <div className="lg:w-1/3 p-8 border-b lg:border-b-0 lg:border-r border-forest/5 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-terracotta text-white flex items-center justify-center font-black text-xl shadow-lg">
                        {loan.userId?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-forest/40 uppercase tracking-widest mb-1">Applicant</p>
                        <h3 className="text-lg font-black text-forest-dark leading-none">{loan.userId?.name}</h3>
                        <p className="text-xs font-bold text-forest/60 mt-1">{loan.userId?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-forest/5 border border-forest/5">
                      <ShoppingBag className="text-forest/40" size={24} />
                      <div>
                        <p className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-1">Requested For</p>
                        <p className="font-black text-forest-dark leading-none">{loan.productId?.name || 'Unknown Product'}</p>
                        <p className="text-[10px] font-bold text-forest/60 mt-1 uppercase tracking-widest">{loan.productId?.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Terms - Flow Layout to prevent congestion */}
                  <div className="flex-1 p-8 flex flex-wrap items-center gap-x-12 gap-y-8 bg-white/20">
                    <div className="min-w-[140px]">
                      <p className="text-[10px] font-black text-forest/40 uppercase tracking-[0.2em] mb-1">Total Price</p>
                      <p className="text-xl font-black text-forest-dark">Rs. {loan.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="min-w-[140px]">
                      <p className="text-[10px] font-black text-success uppercase tracking-[0.2em] mb-1">Down Payment</p>
                      <p className="text-xl font-black text-success">Rs. {loan.downPayment.toLocaleString()}</p>
                    </div>
                    <div className="min-w-[140px]">
                      <p className="text-[10px] font-black text-forest/40 uppercase tracking-[0.2em] mb-1">Installment</p>
                      <p className="text-xl font-black text-forest-dark">Rs. {loan.installmentAmount.toLocaleString()}<span className="text-xs opacity-40">/mo</span></p>
                    </div>
                    <div className="min-w-[100px]">
                      <p className="text-[10px] font-black text-forest/40 uppercase tracking-[0.2em] mb-1">Duration</p>
                      <p className="text-xl font-black text-forest-dark">{loan.totalInstallments} Months</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:w-64 p-8 bg-forest/5 flex flex-col justify-center gap-4">
                    {loan.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => handleAction(loan._id, 'approve')}
                          disabled={processingId === loan._id}
                          className="w-full py-4 bg-success text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-success/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          {processingId === loan._id ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle size={16} /> Approve</>}
                        </button>
                        <button 
                          onClick={() => handleAction(loan._id, 'reject')}
                          disabled={processingId === loan._id}
                          className="w-full py-4 bg-white text-error border border-error/20 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-error/5 transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                         <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${
                           loan.status === 'active' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                         }`}>
                           {loan.status}
                         </span>
                         <p className="text-[10px] font-bold text-forest/40 text-center">Process completed on {new Date(loan.updatedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminFinancing;
