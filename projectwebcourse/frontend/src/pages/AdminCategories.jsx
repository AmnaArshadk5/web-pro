import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import { Tags, Plus, Power, PowerOff, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', type: 'expense', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategoriesAdmin();
      setCategories(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await categoryService.createCategory(formData);
      setFormData({ name: '', type: 'expense', description: '' });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await categoryService.toggleCategoryStatus(id);
      fetchCategories();
    } catch (err) {
      alert('Failed to toggle status');
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
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-forest-dark flex items-center gap-3">
            <Tags size={32} className="text-secondary" /> Category Management
          </h1>
          <p className="text-forest/60 mt-1">Create and manage transaction and expense categories globally</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <motion.div variants={fadeUp} className="glass-card flex flex-col h-fit">
          <div className="flex items-center gap-2 mb-6 text-forest-dark font-bold text-lg">
            <Plus size={20} className="text-primary"/> Add New Category
          </div>
          
          {error && <div className="mb-4 p-3 bg-error/10 text-error rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Category Name</label>
              <input type="text" className="form-input" placeholder="e.g. Travel" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required />
            </div>
            
            <div>
              <label className="form-label">Type</label>
              <select className="form-input" value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})}>
                <option value="expense">Expense</option>
                <option value="transaction">Transaction</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Description (Optional)</label>
              <textarea className="form-input resize-none" rows="3" placeholder="Category purpose..." value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            
            <button type="submit" className="btn-primary w-full mt-6 py-3" disabled={isSubmitting}>
              {isSubmitting ? <Loader className="animate-spin mx-auto" /> : 'Create Category'}
            </button>
          </form>
        </motion.div>

        {/* Categories List */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-0 overflow-hidden flex flex-col h-full max-h-[600px]">
          <div className="p-6 border-b border-forest/10 flex justify-between items-center bg-white/50">
            <h2 className="text-lg font-bold text-forest-dark">Existing Categories</h2>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white/90 backdrop-blur-md z-10 shadow-sm text-forest/60 text-sm border-b border-forest/10">
                <tr>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-forest/40">
                      No categories found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat._id} className="border-b border-forest/5 hover:bg-white/40 transition-colors">
                      <td className="p-4 font-bold text-forest-dark">{cat.name}</td>
                      <td className="p-4 capitalize text-forest/70">{cat.type}</td>
                      <td className="p-4 text-sm text-forest/50 truncate max-w-[150px]">{cat.description || '-'}</td>
                      <td className="p-4 text-center">
                        {cat.isActive 
                          ? <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold uppercase">Active</span>
                          : <span className="px-3 py-1 bg-error/10 text-error rounded-full text-xs font-bold uppercase">Disabled</span>
                        }
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleToggle(cat._id)} 
                          className={`p-2 rounded-xl transition-all active:scale-95 ${cat.isActive ? 'text-error hover:bg-error/10' : 'text-success hover:bg-success/10'}`}
                          title={cat.isActive ? "Disable Category" : "Enable Category"}
                        >
                          {cat.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminCategories;
