import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, Share2, ArrowLeft, CheckCircle, Clock, AlertCircle, FileText, User, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = (import.meta.env.VITE_API_URL || '/api');

const TransactionReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${userData?.token}` } };
        const response = await axios.get(`${API_URL}/transactions/${id}`, config);
        setTransaction(response.data.data);
      } catch (err) {
        setError('Transaction not found or unauthorized');
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !transaction) return (
    <div className="glass-card text-center py-12">
      <AlertCircle size={48} className="mx-auto text-error mb-4" />
      <h2 className="text-xl font-bold text-forest-dark">{error || 'Something went wrong'}</h2>
      <button onClick={() => navigate(-1)} className="btn-primary mt-6">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-forest/60 hover:text-forest mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to History
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden shadow-2xl rounded-[32px] bg-white print:shadow-none print:border-0"
      >
        {/* Header Decor */}
        <div className={`h-4 ${transaction.status === 'successful' ? 'bg-success' : 'bg-error'}`} />
        
        <div className="p-8 lg:p-12">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${transaction.status === 'successful' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
              {transaction.status === 'successful' ? <CheckCircle size={40} /> : <Clock size={40} />}
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-sm font-bold text-forest/40 uppercase tracking-[0.2em] mb-2">Transaction Receipt</h2>
            <h1 className="text-4xl font-black text-forest-dark">
              Rs. {transaction.amount.toLocaleString()}
            </h1>
            <p className="text-forest/60 mt-2 capitalize font-medium">{transaction.type} • {transaction.status}</p>
          </div>

          {/* Details Table */}
          <div className="space-y-6 border-y border-forest/5 py-8 my-8">
            <div className="flex justify-between items-center">
              <span className="text-forest/60 flex items-center gap-2"><FileText size={16}/> Transaction ID</span>
              <span className="font-mono font-bold text-forest-dark">{transaction.transactionId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-forest/60 flex items-center gap-2"><Calendar size={16}/> Date & Time</span>
              <span className="font-bold text-forest-dark">{new Date(transaction.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-forest/60 flex items-center gap-2"><User size={16}/> {transaction.type === 'transfer' ? 'Receiver' : 'User'}</span>
              <span className="font-bold text-forest-dark">{transaction.receiverId?.name || transaction.senderId?.name || 'Self'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-forest/60 flex items-center gap-2"><Tag size={16}/> Category</span>
              <span className="px-3 py-1 bg-forest/5 rounded-full text-xs font-bold text-forest capitalize">{transaction.category || 'General'}</span>
            </div>
          </div>

          {transaction.description && (
            <div className="bg-forest/5 p-4 rounded-2xl mb-10 italic text-forest/70 text-sm text-center">
              "{transaction.description}"
            </div>
          )}

          {/* Actions - Hidden in Print */}
          <div className="grid grid-cols-2 gap-4 print:hidden">
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-forest text-white font-bold hover:shadow-lg transition-all active:scale-95"
            >
              <Download size={18} /> Download PDF
            </button>
            <button className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-forest/10 text-forest font-bold hover:bg-forest/5 transition-all active:scale-95">
              <Share2 size={18} /> Share Receipt
            </button>
          </div>
        </div>

        {/* Footer Decor */}
        <div className="bg-forest/5 p-6 text-center text-[10px] text-forest/40 uppercase tracking-widest font-bold">
          RuralPay - Secure Rural Financial Platform
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionReceipt;
