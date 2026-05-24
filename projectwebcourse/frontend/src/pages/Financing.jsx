import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Calendar, CheckCircle, Clock, AlertCircle, ArrowRight, Download, Receipt, Loader2, Info, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';
import loanService from '../services/loanService';

const Financing = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchLoans = async () => {
    try {
      const res = await loanService.getMyLoans();
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDownloadStatement = () => {
    const doc = new jsPDF();
    const user = JSON.parse(localStorage.getItem('user'));

    // Header
    doc.setFontSize(22);
    doc.setTextColor(42, 68, 60); // Forest Color
    doc.text('RuralPay Financing Statement', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Customer: ${user?.name || 'Valued Client'} (${user?.email})`, 14, 35);

    const tableData = loans.map(loan => [
      loan.productId?.name || 'Product',
      `Rs. ${(loan.totalAmount || 0).toLocaleString()}`,
      `Rs. ${(loan.remainingAmount || 0).toLocaleString()}`,
      `${loan.paidInstallments || 0}/${loan.totalInstallments || 0}`,
      (loan.status || 'Pending').toUpperCase()
    ]);

    try {
      autoTable(doc, {
        startY: 45,
        head: [['Product', 'Total Value', 'Remaining', 'Installments', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [42, 68, 60] },
        styles: { fontSize: 9 }
      });

      doc.save(`RuralPay_Statement_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setMessage({ type: 'error', text: 'Failed to generate PDF. Please try again.' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handlePay = async (id) => {
    try {
      setPayingId(id);
      await loanService.payInstallment(id);
      setMessage({ type: 'success', text: 'Installment paid successfully!' });
      fetchLoans();
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Payment failed' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setPayingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'completed': return 'bg-forest/10 text-forest';
      case 'defaulted': return 'bg-error/10 text-error';
      case 'rejected': return 'bg-error/10 text-error';
      default: return 'bg-gray-100 text-gray-500';
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
    <div className="space-y-8">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl ${message.type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
          {message.text}
        </motion.div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-forest-dark">My Financing</h1>
          <p className="text-forest/60">Manage your Buy Now Pay Later plans and installments.</p>
        </div>
        <button
          onClick={handleDownloadStatement}
          className="btn-secondary text-sm px-6 py-3 flex items-center gap-2 !text-black font-black"
        >
          Download Statement <Download size={16} />
        </button>
      </div>

      {loans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loans.map((loan) => (
            <motion.div
              key={loan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-forest/5 flex items-center justify-center text-forest">
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-forest-dark">{loan.productId?.name || 'Product'}</h3>
                    <p className="text-xs font-bold text-forest/40 uppercase tracking-widest mt-1">Loan ID: {loan._id}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(loan.status)}`}>
                  {loan.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs font-bold text-forest/40 uppercase mb-2">Remaining</p>
                  <p className="text-3xl font-black text-forest-dark">Rs. {loan.remainingAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-forest/40 uppercase mb-2">Total Value</p>
                  <p className="text-xl font-bold text-forest/60 text-decoration-line-through">Rs. {loan.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold text-forest-dark mb-2">
                  <span>Progress: {loan.paidInstallments}/{loan.totalInstallments} Installments</span>
                  <span>{Math.round((loan.paidInstallments / loan.totalInstallments) * 100)}%</span>
                </div>
                <div className="h-3 w-full bg-forest/5 rounded-full overflow-hidden border border-forest/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(loan.paidInstallments / loan.totalInstallments) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-forest to-mint rounded-full"
                  />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-cream/50 border border-forest/5 space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 text-forest-dark">
                    <Clock size={20} className="text-terracotta" />
                    <span className="font-bold">Next Installment</span>
                  </div>
                  <span className="font-black text-lg text-forest">Rs. {loan.installmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-forest/60">Due Date</span>
                  <span className="font-bold text-forest-dark">{loan.nextInstallmentDate ? new Date(loan.nextInstallmentDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePay(loan._id)}
                  disabled={payingId === loan._id || loan.status !== 'active'}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
                >
                  {payingId === loan._id ? <Loader2 className="animate-spin" size={16} /> : 'Pay Now'}
                </button>
                <button
                  onClick={() => setSelectedLoan(loan)}
                  className="btn-secondary w-full"
                >
                  View Schedule
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 glass-card">
          <div className="w-20 h-20 bg-forest/5 rounded-full flex items-center justify-center mx-auto mb-6 text-forest/20">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-forest-dark">No active financing</h2>
          <p className="text-forest/50 mb-8">You don't have any active Buy Now Pay Later plans.</p>
          <Link to="/marketplace" className="btn-primary">Browse Marketplace</Link>
        </div>
      )}

      {/* Repayment Schedule Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLoan(null)}
              className="absolute inset-0 bg-forest-dark/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card max-h-[80vh] flex flex-col p-0 overflow-hidden"
            >
              <div className="p-8 border-b border-forest/5 flex justify-between items-center bg-forest text-white">
                <div>
                  <h2 className="text-2xl font-black">Repayment Schedule</h2>
                  <p className="text-wheat/60 text-xs font-bold uppercase tracking-widest mt-1">{selectedLoan.productId?.name}</p>
                </div>
                <button onClick={() => setSelectedLoan(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-forest/40 uppercase tracking-[0.2em] border-b border-forest/5">
                      <th className="pb-4">Installment</th>
                      <th className="pb-4">Due Date</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/5">
                    {selectedLoan.repaymentSchedule.map((item, index) => (
                      <tr key={index} className="group">
                        <td className="py-4 font-black text-forest-dark">#{index + 1}</td>
                        <td className="py-4 text-sm font-bold text-forest/60">
                          {new Date(item.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 font-black text-forest-dark">Rs. {item.amount.toLocaleString()}</td>
                        <td className="py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'paid' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-8 bg-cream/50 border-t border-forest/5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-1">Remaining Balance</p>
                  <p className="text-2xl font-black text-forest-dark">Rs. {selectedLoan.remainingAmount.toLocaleString()}</p>
                </div>
                <div className="text-right text-xs font-bold text-forest/60">
                  {selectedLoan.paidInstallments} of {selectedLoan.totalInstallments} Paid
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Financing;

