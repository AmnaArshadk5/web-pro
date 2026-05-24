import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import { Flag, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminFlagged = () => {
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchFlagged = async () => {
    try {
      const res = await adminService.getFlaggedTransactions();
      setFlagged(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlagged();
  }, []);

  const handleResolve = async (id, newStatus) => {
    try {
      setProcessingId(id);
      await adminService.updateTransactionStatus(id, newStatus);
      setFlagged(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-forest-dark flex items-center gap-3">
            <Flag size={32} className="text-error" /> Flagged Transactions
          </h1>
          <p className="text-forest/60 mt-1 font-medium">Review and resolve suspicious system activity</p>
        </div>
        <div className="px-6 py-2 bg-error/10 border border-error/20 rounded-2xl">
          <span className="text-error font-black text-sm uppercase tracking-widest">{flagged.length} Urgent Alerts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {flagged.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card text-center py-20"
            >
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-success" />
              </div>
              <h3 className="text-xl font-black text-forest-dark">System Clear</h3>
              <p className="text-forest/40 mt-2">No suspicious transactions requiring attention.</p>
            </motion.div>
          ) : (
            flagged.map((txn, i) => (
              <motion.div
                key={txn._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card flex flex-col md:flex-row gap-8 items-center border-error/10 hover:border-error/30 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error flex-shrink-0">
                  <AlertTriangle size={32} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-error text-white rounded-full">High Risk</span>
                    <span className="text-xs font-bold text-forest/40">{new Date(txn.createdAt).toLocaleString()}</span>
                  </div>
                  <h3 className="text-lg font-black text-forest-dark truncate">
                    {txn.senderId?.name || 'System'} → {txn.receiverId?.name || 'External'}
                  </h3>
                  <p className="text-xs text-forest/60 font-mono">{txn.transactionId}</p>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-forest/40 mb-1">Amount</p>
                  <p className="text-2xl font-black text-forest-dark">Rs. {txn.amount.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-error uppercase tracking-wider">{txn.type}</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    disabled={processingId === txn._id}
                    onClick={() => handleResolve(txn._id, 'successful')}
                    className="flex-1 md:flex-none px-6 py-4 bg-success text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {processingId === txn._id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle size={18} />}
                    Approve
                  </button>
                  <button
                    disabled={processingId === txn._id}
                    onClick={() => handleResolve(txn._id, 'failed')}
                    className="flex-1 md:flex-none px-6 py-4 bg-white border border-error text-error rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-error/5 transition-all disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminFlagged;
