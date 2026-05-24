import React, { useState, useEffect } from 'react';
import transactionService from '../services/transactionService';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Eye, X, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    startDate: ''
  });

  // Receipt Modal
  const [selectedTxn, setSelectedTxn] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Build query string
      const query = new URLSearchParams();
      if (filters.search) query.append('search', filters.search);
      if (filters.type) query.append('type', filters.type);
      if (filters.status) query.append('status', filters.status);
      if (filters.startDate) query.append('startDate', filters.startDate);

      const res = await transactionService.getTransactions(`?${query.toString()}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'successful': return <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold uppercase flex items-center gap-1 w-max"><CheckCircle size={12}/> Success</span>;
      case 'failed': return <span className="px-3 py-1 bg-error/10 text-error rounded-full text-xs font-bold uppercase flex items-center gap-1 w-max"><X size={12}/> Failed</span>;
      case 'flagged': return <span className="px-3 py-1 bg-pink-500/10 text-pink-600 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-max"><ShieldAlert size={12}/> Flagged</span>;
      default: return <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-max"><Clock size={12}/> Pending</span>;
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="max-w-7xl mx-auto space-y-6">
      
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-forest-dark flex items-center gap-3">
             Transaction History
          </h1>
          <p className="text-forest/60 mt-1">Review and filter your past financial activities</p>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div variants={fadeUp} className="glass-card p-6 flex flex-wrap gap-4 items-center bg-white/40">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
          <input 
            type="text" 
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search ID or description..." 
            className="form-input pl-11 w-full bg-white/80"
          />
        </div>
        
        <select name="type" value={filters.type} onChange={handleFilterChange} className="form-input w-auto bg-white/80 cursor-pointer">
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="transfer">Transfer</option>
        </select>
        
        <select name="status" value={filters.status} onChange={handleFilterChange} className="form-input w-auto bg-white/80 cursor-pointer">
          <option value="">All Statuses</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="flagged">Flagged</option>
        </select>

        <input 
          type="date" 
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="form-input w-auto bg-white/80 cursor-pointer" 
        />
      </motion.div>

      {/* Table Section */}
      <motion.div variants={fadeUp} className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-forest/5 text-forest/60 text-sm border-b border-forest/10">
              <tr>
                <th className="p-5 font-semibold">Transaction Details</th>
                <th className="p-5 font-semibold">Type</th>
                <th className="p-5 font-semibold">Amount</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-forest/40">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-forest/40">No transactions found matching criteria.</td></tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn._id} className="border-b border-forest/5 hover:bg-white/40 transition-colors group">
                    <td className="p-5">
                      <p className="font-bold text-forest-dark">{txn.description}</p>
                      <p className="text-xs text-forest/50 mt-1">{new Date(txn.createdAt).toLocaleString()} • ID: {txn.transactionId}</p>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold capitalize ${txn.type === 'deposit' ? 'bg-success/10 text-success' : txn.type === 'withdrawal' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'}`}>
                        {txn.type === 'deposit' ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>} {txn.type}
                      </span>
                    </td>
                    <td className="p-5 font-bold text-forest-dark text-lg">
                      {txn.type === 'deposit' ? '+' : '-'}Rs. {txn.amount.toLocaleString()}
                    </td>
                    <td className="p-5">{getStatusBadge(txn.status)}</td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => setSelectedTxn(txn)}
                        className="p-2 rounded-xl bg-forest/5 text-forest hover:bg-forest hover:text-white transition-all active:scale-95"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Receipt Modal (Req 11) */}
      <AnimatePresence>
        {selectedTxn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-forest-dark/40 backdrop-blur-sm"
              onClick={() => setSelectedTxn(null)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card relative z-10 w-full max-w-lg overflow-hidden bg-cream p-0 shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-forest to-peach"></div>
              <button onClick={() => setSelectedTxn(null)} className="absolute top-6 right-6 text-forest/40 hover:text-error transition-colors">
                <X size={24} />
              </button>

              <div className="p-8 pb-4">
                <div className="text-center mb-8 pt-4">
                  <h2 className="text-2xl font-bold text-forest-dark uppercase tracking-widest mb-1">Receipt</h2>
                  <p className="text-sm text-forest/50 font-mono">{selectedTxn.transactionId}</p>
                </div>

                <div className="flex justify-between items-end mb-8 pb-8 border-b border-forest/10 border-dashed">
                  <div>
                    <p className="text-xs font-bold text-forest/40 uppercase tracking-wide mb-1">Amount</p>
                    <p className="text-4xl font-black text-forest-dark">Rs. {selectedTxn.amount.toLocaleString()}</p>
                  </div>
                  <div>{getStatusBadge(selectedTxn.status)}</div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-forest/60 text-sm">Date & Time</span>
                    <span className="font-semibold text-forest-dark">{new Date(selectedTxn.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60 text-sm">Transaction Type</span>
                    <span className="font-semibold text-forest-dark capitalize">{selectedTxn.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60 text-sm">Description</span>
                    <span className="font-semibold text-forest-dark">{selectedTxn.description}</span>
                  </div>
                  
                  {selectedTxn.type === 'transfer' && selectedTxn.receiverId && (
                    <div className="flex justify-between">
                      <span className="text-forest/60 text-sm">Recipient</span>
                      <span className="font-semibold text-forest-dark">{selectedTxn.receiverId.email || selectedTxn.receiverId}</span>
                    </div>
                  )}

                  {selectedTxn.suspiciousFlag && (
                    <div className="mt-6 p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                      <p className="text-sm font-bold text-pink-600 flex items-center gap-2 mb-2"><ShieldAlert size={16}/> Security Flag Triggered</p>
                      <ul className="list-disc pl-5 text-xs text-pink-600/80 space-y-1">
                        {selectedTxn.suspiciousReasons?.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-forest/10 flex justify-center">
                  <p className="text-xs text-forest/40 font-bold uppercase tracking-widest">RuralPay Secure Platform</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </motion.div>
  );
};

export default Transactions;
