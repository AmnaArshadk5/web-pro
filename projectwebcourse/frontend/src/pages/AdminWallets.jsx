import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import { Wallet } from 'lucide-react';

const AdminWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const refreshWallets = () => {
    adminService.getAllWallets().then(res => setWallets(res.data)).catch(console.log);
  };

  useEffect(() => {
    refreshWallets();
  }, []);

  const handleToggle = async (id) => {
    try {
      setLoadingId(id);
      await adminService.toggleWalletStatus(id);
      refreshWallets();
    } catch (err) {
      alert('Failed to update wallet status');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto glass-card">
      <h2 className="text-2xl font-black text-forest mb-6 flex items-center gap-2 tracking-tighter">
        <Wallet className="text-terracotta"/> Platform Wallets
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-forest/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest/5 text-forest/70 font-black uppercase tracking-widest text-[10px]">
            <tr>
              <th className="p-4">User Email</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Currency</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/5">
            {wallets.map(w => (
              <tr key={w._id} className="hover:bg-white/40 transition-colors">
                <td className="p-4 font-bold text-forest-dark">{w.userId?.email || 'N/A'}</td>
                <td className="p-4 font-black text-forest-dark text-lg">Rs. {w.balance.toLocaleString()}</td>
                <td className="p-4 font-bold text-forest/40">{w.currency}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${w.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {w.status === 'active' ? 'ACTIVE' : 'FROZEN'}
                  </span>
                </td>
                <td className="p-4 text-center">
                   <button 
                    disabled={loadingId === w._id}
                    onClick={() => handleToggle(w._id)}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      w.status === 'active' ? 'bg-error text-white hover:bg-error-dark' : 'bg-success text-white hover:bg-success-dark'
                    } ${loadingId === w._id ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                   >
                     {loadingId === w._id ? '...' : (w.status === 'active' ? 'Freeze' : 'Unfreeze')}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminWallets;
