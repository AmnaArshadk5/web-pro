import React, { useState, useEffect } from 'react';
import walletService from '../services/walletService';
import { CreditCard, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle, RefreshCcw, Send, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWallet = async () => {
    try {
      const [walletRes, summaryRes] = await Promise.all([
        walletService.getWallet(),
        walletService.getWalletSummary()
      ]);
      setWallet(walletRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleAction = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'deposit') {
        await walletService.deposit(amount, description);
        setSuccessMsg('Deposit successful!');
      } else if (activeTab === 'withdraw') {
        await walletService.withdraw(amount, description);
        setSuccessMsg('Withdrawal successful!');
      } else if (activeTab === 'transfer') {
        await walletService.transfer(receiverEmail, amount, description);
        setSuccessMsg('Transfer successful!');
      }
      
      setAmount('');
      setReceiverEmail('');
      setDescription('');
      fetchWallet(); // refresh balance
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setIsSubmitting(false);
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
    <motion.div initial="hidden" animate="visible" className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-forest-dark">Digital Wallet</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Balance Card */}
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-[32px] p-10 text-white shadow-2xl bg-gradient-to-br from-forest-dark via-forest to-forest-light">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-mint/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-peach/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[250px]">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <CreditCard className="text-mint" size={28}/>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider border border-white/20">
                {wallet?.status || 'Active'}
              </span>
            </div>
            
            <div className="mt-12">
              <p className="text-mint/80 font-medium mb-2 uppercase tracking-wide text-sm">Available Balance</p>
              <h2 className="text-5xl font-bold tracking-tight mb-2">
                <span className="text-3xl mr-2 text-mint/90">{wallet?.currency}</span>
                {wallet?.balance?.toLocaleString()}
              </h2>
              {wallet?.balance < 1000 && (
                <div className="mt-4 flex items-center gap-2 text-sm font-bold bg-error/20 text-red-200 w-fit px-3 py-1.5 rounded-full border border-error/30 backdrop-blur-md">
                  <AlertCircle size={14}/> Low Balance Warning
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Form */}
        <motion.div variants={fadeUp} className="glass-card flex flex-col">
          {/* Custom Tabs */}
          <div className="flex p-1 bg-gray-100/50 backdrop-blur-sm rounded-2xl mb-8 border border-gray-200/50">
            {['deposit', 'withdraw', 'transfer'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white text-forest shadow-sm border border-gray-200/50' 
                    : 'text-gray-500 hover:text-forest'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-6 flex items-center gap-2 font-medium">
              <AlertCircle size={18}/> {error}
            </motion.div>
          )}
          {successMsg && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="bg-success/10 border border-success/20 text-success p-4 rounded-xl mb-6 flex items-center gap-2 font-medium">
              <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-xs font-bold">✓</div>
              {successMsg}
            </motion.div>
          )}

          <form onSubmit={handleAction} className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 flex-1"
              >
                {activeTab === 'transfer' && (
                  <div>
                    <label className="form-label">Receiver's Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="e.g. friend@example.com"
                      value={receiverEmail} 
                      onChange={(e) => setReceiverEmail(e.target.value)} 
                      required 
                    />
                  </div>
                )}
                
                <div>
                  <label className="form-label">Amount ({wallet?.currency})</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 font-bold">{wallet?.currency}</span>
                    </div>
                    <input 
                      type="number" 
                      className="form-input pl-14 text-lg font-bold" 
                      placeholder="0.00"
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      min="0.01" 
                      step="0.01" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Note (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="What is this for?"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <button type="submit" className="btn-primary mt-8 w-full py-4 text-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>
                  {activeTab === 'deposit' && <ArrowDownRight size={20} />}
                  {activeTab === 'withdraw' && <ArrowUpRight size={20} />}
                  {activeTab === 'transfer' && <Send size={20} />}
                  Confirm {activeTab}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Wallet Summary Section */}
      <motion.div variants={fadeUp} className="glass-card mt-8">
        <h3 className="text-xl font-bold text-forest-dark mb-6 flex items-center gap-2">
          <Activity size={24} className="text-secondary"/> Wallet Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-forest/5 border border-forest/10">
            <p className="text-xs text-forest/60 uppercase font-bold tracking-wider mb-1">Total Deposits</p>
            <p className="text-lg font-bold text-forest-dark text-success">+ Rs. {summary?.totalDeposits?.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-forest/5 border border-forest/10">
            <p className="text-xs text-forest/60 uppercase font-bold tracking-wider mb-1">Total Withdrawals</p>
            <p className="text-lg font-bold text-forest-dark text-error">- Rs. {summary?.totalWithdrawals?.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-forest/5 border border-forest/10">
            <p className="text-xs text-forest/60 uppercase font-bold tracking-wider mb-1">Total Received</p>
            <p className="text-lg font-bold text-forest-dark text-success">+ Rs. {summary?.totalTransfersIn?.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-forest/5 border border-forest/10">
            <p className="text-xs text-forest/60 uppercase font-bold tracking-wider mb-1">Total Sent</p>
            <p className="text-lg font-bold text-forest-dark text-error">- Rs. {summary?.totalTransfersOut?.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Wallet;
