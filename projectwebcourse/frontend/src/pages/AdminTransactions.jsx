import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import { Activity, Filter } from 'lucide-react';

const AdminTransactions = () => {
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState('');

  const [updatingId, setUpdatingId] = useState(null);

  const refreshTxns = () => {
    adminService.getAllTransactions().then(res => setTxns(res.data)).catch(console.log);
  };

  useEffect(() => {
    refreshTxns();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await adminService.updateTransactionStatus(id, newStatus);
      refreshTxns();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTxns = txns.filter(t =>
    t.type.toLowerCase().includes(filter.toLowerCase()) ||
    t.status.toLowerCase().includes(filter.toLowerCase()) ||
    t.transactionId.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful': return 'bg-success/10 text-success';
      case 'flagged': return 'bg-error/10 text-error';
      case 'failed': return 'bg-gray-400/10 text-gray-500';
      case 'pending': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto glass-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-forest flex items-center gap-2"><Activity className="text-terracotta" /> All Transactions</h2>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
          <input type="text" placeholder="Filter ID, type, or status..." className="form-input pl-10 py-2 text-sm" value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-forest/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest/5 text-forest/70 font-black uppercase tracking-widest text-[10px]">
            <tr>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4">User</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Manage Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/5">
            {filteredTxns.slice(0, 100).map(t => (
              <tr key={t._id} className="hover:bg-white/40 transition-colors">
                <td className="p-4 font-mono text-[10px] text-forest/60">{t.transactionId}</td>
                <td className="p-4 text-xs font-bold text-forest/80">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="p-4 font-bold text-forest-dark">{t.senderId?.name || t.receiverId?.name || 'System'}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-md bg-forest/5 text-[10px] font-black uppercase tracking-wider text-forest/60">
                    {t.type}
                  </span>
                </td>
                <td className="p-4 font-black text-forest-dark text-right">Rs. {t.amount.toLocaleString()}</td>
                <td className="p-4 text-center">
                  <div className="relative inline-block">
                    {updatingId === t._id ? (
                      <div className="w-24 flex justify-center"><div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin"></div></div>
                    ) : (
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t._id, e.target.value)}
                        className={`appearance-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all border-none ${getStatusColor(t.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="successful">Successful</option>
                        <option value="failed">Failed</option>
                        <option value="flagged">Flagged</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminTransactions;
