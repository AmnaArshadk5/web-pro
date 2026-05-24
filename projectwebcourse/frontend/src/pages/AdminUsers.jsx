import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (user) => {
    if (user.role === 'admin') {
      alert("Cannot modify admin status");
      return;
    }
    
    try {
      if (user.status === 'active') {
        await adminService.blockUser(user._id);
      } else {
        await adminService.unblockUser(user._id);
      }
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <div className="container" style={{paddingTop:'2rem'}}>Loading Users...</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1 className="auth-title" style={{ marginBottom: '2rem' }}>User Management</h1>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.03)' }}>
            <tr>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Name</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Email</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Role</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: '1rem' }}>{u.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.2rem 0.5rem', background: u.role === 'admin' ? '#dbeafe' : '#f1f5f9', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: u.status === 'active' ? 'var(--success)' : 'var(--error)', fontWeight: 'bold' }}>
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {u.role !== 'admin' && (
                    <button 
                      onClick={() => handleToggleBlock(u)} 
                      style={{
                        background: u.status === 'active' ? '#fee2e2' : '#d1fae5',
                        color: u.status === 'active' ? '#dc2626' : '#059669',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {u.status === 'active' ? <><ShieldAlert size={16}/> Block</> : <><ShieldCheck size={16}/> Unblock</>}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
