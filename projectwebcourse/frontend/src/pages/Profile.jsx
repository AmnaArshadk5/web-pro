import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Activity, CheckCircle, Lock, Upload, Camera } from 'lucide-react';
import axios from 'axios';
const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/auth/';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', profileImage: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passMsg, setPassMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(API_URL + 'me', config);
        setProfileData(res.data.data);
        setFormData({ 
          name: res.data.data.name || '', 
          phone: res.data.data.phone || '', 
          profileImage: res.data.data.profileImage || ''
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        setMsg('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?.token) return;
    
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.put(API_URL + 'profile', formData, config);
      
      // Update local storage and context
      const updatedUser = { ...user, ...res.data.data };
      updateUser(updatedUser);
      
      setProfileData(res.data.data);
      setMsg('Profile updated successfully!');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user?.token) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassMsg('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(API_URL + 'change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, config);
      
      setPassMsg('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Increased to 5MB
        setMsg('File size too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="p-10 text-center text-forest">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Read-Only Information Panel */}
      <div className="md:col-span-1 space-y-6">
        <div className="glass-card flex flex-col items-center text-center p-8 group">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-forest to-mint flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-2xl border-4 border-white transition-all group-hover:scale-105">
              {formData?.profileImage ? (
                <>
                  <img 
                    src={formData.profileImage} 
                    className="w-full h-full object-cover" 
                    alt={profileData?.name}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }} 
                  />
                  <div className="w-full h-full items-center justify-center hidden bg-gradient-to-br from-forest to-mint">
                    {profileData?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </>
              ) : (
                profileData?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <label className="absolute bottom-4 right-0 w-10 h-10 bg-forest text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-forest-dark transition-all border-4 border-white">
              <Camera size={18} />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          <h3 className="text-xl font-black text-forest-dark tracking-tight">{profileData?.name}</h3>
          <p className="text-[10px] font-black text-forest/40 uppercase tracking-widest flex items-center gap-1 justify-center mt-2 border border-forest/5 px-3 py-1 rounded-full"><Shield size={10}/> {profileData?.role} Account</p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h4 className="text-sm font-bold text-forest-dark uppercase tracking-wider mb-4 border-b border-forest/10 pb-2">Account Details</h4>
          
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-terracotta"/>
            <div className="flex-1 truncate text-forest/70 font-medium">{profileData?.email}</div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Activity size={16} className="text-success"/>
            <div className="flex-1 font-bold text-success capitalize flex items-center gap-2">
              {profileData?.status} <CheckCircle size={14}/>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-secondary"/>
            <div className="flex-1 text-forest/70 font-medium">Joined {new Date(profileData?.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Edit Form Panel */}
      <div className="md:col-span-2 glass-card p-8">
        <h2 className="text-2xl font-bold text-forest-dark flex items-center gap-3 mb-6">
           Profile Settings
        </h2>
        
        {msg && <p className={`mb-6 text-sm font-bold p-3 rounded-xl ${msg.includes('successfully') ? 'text-success bg-success/10' : 'text-error bg-error/10'}`}>{msg}</p>}
        
        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} required />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-input" placeholder="+1 234 567 8900" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
             <button type="submit" className="btn-primary px-8 py-3">Update Details</button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-forest/10">
          <h3 className="text-xl font-bold text-forest-dark flex items-center gap-3 mb-6">
            <Lock size={20} className="text-terracotta"/> Security Settings
          </h3>
          
          {passMsg && <p className={`mb-6 text-sm font-bold p-3 rounded-xl ${passMsg.includes('successfully') ? 'text-success bg-success/10' : 'text-error bg-error/10'}`}>{passMsg}</p>}
          
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label className="form-label">Current Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter your current password" 
                value={passwordData.currentPassword} 
                onChange={e=>setPasswordData({...passwordData, currentPassword: e.target.value})} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="At least 6 characters" 
                  value={passwordData.newPassword} 
                  onChange={e=>setPasswordData({...passwordData, newPassword: e.target.value})} 
                  required 
                  minLength="6"
                />
              </div>
              <div>
                <label className="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Repeat new password" 
                  value={passwordData.confirmPassword} 
                  onChange={e=>setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                  required 
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
               <button type="submit" className="btn-primary bg-forest text-wheat px-8 py-3">Change Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;
