import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, DollarSign, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, readStatus: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, readStatus: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.readStatus).length;

  const getIcon = (type) => {
    switch (type) {
      case 'security': return <ShieldAlert className="text-error" />;
      case 'budget': return <AlertTriangle className="text-amber-500" />;
      case 'transaction': return <DollarSign className="text-success" />;
      default: return <Info className="text-secondary" />;
    }
  };

  if (loading) return <div className="p-10 text-center text-forest">Loading Notifications...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-forest-dark flex items-center gap-3">
          <Bell size={28} className="text-mint" /> 
          Notifications 
          {unreadCount > 0 && <span className="text-sm bg-error text-white px-2.5 py-0.5 rounded-full">{unreadCount} Unread</span>}
        </h2>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
            <CheckCircle size={16}/> Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="glass-card p-10 text-center text-forest/60">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>You have no notifications.</p>
          </div>
        ) : (
          notifications.map(n => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
              key={n._id} 
              className={`glass-card p-5 flex gap-4 items-start transition-all ${!n.readStatus ? 'border-l-4 border-l-mint bg-mint/5' : 'opacity-70'}`}
            >
              <div className="p-3 bg-white rounded-full shadow-sm">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold ${!n.readStatus ? 'text-forest-dark' : 'text-forest/70'}`}>{n.title}</h3>
                  <span className="text-xs text-forest/50 flex items-center gap-1"><Clock size={12}/> {new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-forest/80 mb-3">{n.message}</p>
                {!n.readStatus && (
                  <button onClick={() => handleMarkAsRead(n._id)} className="text-xs font-bold text-mint hover:underline">Mark as read</button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
export default Notifications;
