import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingCart, Tag, Info, CheckCircle, ArrowRight, Star, Loader2, Plus, X, Edit, Trash2 } from 'lucide-react';
import productService from '../services/productService';
import loanService from '../services/loanService';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSpecsId, setShowSpecsId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Agricultural Equipment',
    imageUrl: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const isRetailer = user?.role === 'retailer';
  const canManageProducts = isAdmin || isRetailer;

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await productService.updateProduct(editId, newProduct);
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        await productService.createProduct(newProduct);
        setMessage({ type: 'success', text: 'Product added successfully!' });
      }
      setShowAddModal(false);
      setEditId(null);
      setNewProduct({ name: '', description: '', price: '', category: 'Agricultural Equipment', imageUrl: '' });
      fetchProducts();
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        fetchProducts();
        setTimeout(() => setMessage(null), 5000);
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete product' });
      }
    }
  };

  const openEditModal = (product) => {
    setEditId(product._id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl
    });
    setShowAddModal(true);
  };

  const fetchProducts = async () => {
    try {
      const res = await productService.getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApply = async (product) => {
    try {
      setApplyingId(product._id);
      // Artificial delay for smooth premium transition
      await new Promise(resolve => setTimeout(resolve, 2000));

      const downPayment = product.price * 0.2;
      await loanService.applyForLoan({
        productId: product._id,
        downPayment,
        totalInstallments: 12
      });
      setMessage({ type: 'success', text: `Financing applied for ${product.name}! Rs. ${downPayment.toLocaleString()} deducted as down payment.` });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to apply for financing' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setApplyingId(null);
    }
  };

  const categories = ['All', 'Agricultural Equipment', 'Home Appliance', 'Tools'];

  const filteredProducts = products.filter(p =>
    (filter === 'All' || p.category === filter) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Hero Section */}
      <div className="relative h-80 rounded-[40px] overflow-hidden bg-forest-dark flex items-center px-12 group">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[3000ms]"
            alt="Rural Finance"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark via-forest-dark/80 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="px-4 py-1.5 bg-wheat/10 text-wheat rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block border border-wheat/20">Premium Selection</span>
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
                Durable Goods <span className="text-wheat italic">Financing</span>
              </h1>
              <p className="text-white/60 text-lg font-medium max-w-lg leading-relaxed">
                Invest in your legacy today. Get premium tools and essential appliances with flexible, interest-free BNPL plans.
              </p>
            </motion.div>
          </div>
          {canManageProducts && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-10 py-5 bg-wheat text-forest-dark rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 shadow-3xl hover:shadow-wheat/20 transition-all shimmer"
            >
              <Plus size={24} /> Add New Asset
            </motion.button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex gap-3 overflow-x-auto pb-4 w-full md:w-auto custom-scrollbar px-2">
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${filter === cat ? 'bg-forest text-wheat shadow-2xl shadow-forest/30' : 'bg-white/60 text-forest/40 border border-white/80 hover:bg-white hover:text-forest hover:border-forest/20'}`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-forest/30" size={18} />
          <input
            type="text"
            placeholder="Search our catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-8 py-5 bg-white/80 border border-white/60 rounded-[24px] focus:outline-none focus:border-forest/20 transition-all font-medium text-forest-dark shadow-xl backdrop-blur-md"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card group flex flex-col min-h-[600px] p-5 hover:shadow-[0_40px_80px_-20px_rgba(27,67,50,0.15)]"
            >
              {/* Product Image Wrapper */}
              <div className="relative h-64 overflow-hidden rounded-[28px] bg-forest/5 shadow-inner">
                <img
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[8px] font-black text-forest-dark uppercase tracking-widest shadow-lg border border-white/50 whitespace-nowrap">
                    {product.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Product Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-forest-dark tracking-tighter leading-tight group-hover:text-forest transition-colors line-clamp-2 h-12">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-mint/30 rounded-full text-success">
                    <Star size={14} fill="currentColor" />
                    <span className="text-[11px] font-black tracking-widest">4.9</span>
                  </div>
                </div>

                {/* Finance Overview Panel */}
                <div className="bg-forest-dark rounded-[32px] p-5 mb-4 shadow-xl relative overflow-hidden group/price">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Total Asset Price</p>
                    <p className="text-2xl font-black text-wheat tracking-tighter mb-4">Rs. {product.price.toLocaleString()}</p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">Monthly</p>
                        <p className="text-xs font-black text-white tracking-tight">Rs. {(product.price / 12).toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">Down Pay</p>
                        <p className="text-xs font-black text-success tracking-tight">Rs. {(product.price * 0.2).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Info Bar */}
                <div className="grid grid-cols-2 items-center px-5 py-3 bg-forest/5 rounded-2xl mb-5">
                  <span className="text-[9px] font-black text-forest/50 uppercase tracking-[0.1em]">Financing Term</span>
                  <span className="text-[9px] font-black text-forest-dark uppercase tracking-[0.1em] text-right">12 Mo. (0% Int.)</span>
                </div>

                {/* Action Controls */}
                <div className="mt-auto space-y-4">
                  {!canManageProducts ? (
                    <button
                      onClick={() => handleApply(product)}
                      disabled={applyingId === product._id}
                      className="btn-primary w-full py-5 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-forest/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      {applyingId === product._id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>Apply for BNPL <ArrowRight size={20} /></>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 px-4 py-4 bg-white border border-forest/10 rounded-2xl flex items-center gap-3 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                        <span className="text-[10px] font-black text-forest-dark uppercase tracking-widest">Active Status</span>
                      </div>
                      {(isAdmin || product.retailerId?._id === user._id) && (
                        <>
                          <button
                            onClick={() => openEditModal(product)}
                            className="w-12 h-12 bg-white border border-forest/10 rounded-2xl flex items-center justify-center text-forest/40 hover:text-forest hover:bg-forest/5 transition-all shadow-sm group/btn"
                          >
                            <Edit size={20} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="w-12 h-12 bg-white border border-error/10 rounded-2xl flex items-center justify-center text-error/40 hover:text-error hover:bg-error/5 transition-all shadow-sm group/btn"
                          >
                            <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => setShowSpecsId(product._id)}
                    className="w-full text-[10px] font-black text-forest/20 hover:text-forest transition-colors uppercase tracking-[0.2em] py-2"
                  >
                    View Specifications
                  </button>
                </div>
                {/* Status Overlay */}
                <AnimatePresence>
                  {applyingId === product._id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-forest/20 backdrop-blur-sm z-20 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white p-6 rounded-[32px] shadow-2xl flex flex-col items-center gap-4"
                      >
                        <Loader2 className="animate-spin text-forest" size={40} />
                        <p className="font-black text-forest text-sm uppercase tracking-widest text-center">Verifying<br />Eligibility</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white/30 rounded-[40px] border-2 border-dashed border-forest/10">
          <div className="w-20 h-20 bg-forest/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-forest/20" />
          </div>
          <h2 className="text-2xl font-bold text-forest-dark">No products found</h2>
          <p className="text-forest/50">Try adjusting your filters or search term.</p>
        </div>
      )}
      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-forest-dark/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden p-10"
            >
              <button
                onClick={() => { setShowAddModal(false); setEditId(null); }}
                className="absolute top-8 right-8 text-forest/20 hover:text-forest transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-forest-dark tracking-tight">
                  {editId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-forest/60">
                  {editId ? 'Update product details in the catalog.' : 'Create a new durable good for financing.'}
                </p>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-2 block">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-6 py-4 bg-forest/5 border border-forest/10 rounded-2xl focus:outline-none focus:border-forest/30 transition-all font-medium text-forest-dark"
                      placeholder="e.g. Solar Irrigation Pump"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-2 block">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-6 py-4 bg-forest/5 border border-forest/10 rounded-2xl focus:outline-none focus:border-forest/30 transition-all font-medium text-forest-dark"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-2 block">Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-6 py-4 bg-forest/5 border border-forest/10 rounded-2xl focus:outline-none focus:border-forest/30 transition-all font-medium text-forest-dark"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-3 block">Product Visual</label>
                    <div className="flex items-center gap-6 p-6 bg-forest/5 rounded-[28px] border border-dashed border-forest/20">
                      <div className="w-24 h-24 rounded-2xl bg-white overflow-hidden flex-shrink-0 border border-forest/10 shadow-inner">
                        {newProduct.imageUrl ? (
                          <>
                            <img 
                              src={newProduct.imageUrl} 
                              className="w-full h-full object-cover" 
                              alt="Preview"
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }} 
                            />
                            <div className="w-full h-full items-center justify-center text-forest/20 italic text-[10px] hidden text-center px-2">
                              Broken Image
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-forest/20 italic text-[10px]">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="inline-flex items-center gap-3 px-6 py-3 bg-white text-forest text-xs font-black uppercase tracking-widest rounded-xl cursor-pointer hover:bg-forest hover:text-white transition-all shadow-sm border border-forest/10">
                          <Plus size={16} /> Select Photo
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setNewProduct({ ...newProduct, imageUrl: reader.result });
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <p className="mt-2 text-[9px] text-forest/40 font-medium italic">High-quality PNG or JPG (max 5MB)</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-2 block">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-6 py-4 bg-forest/5 border border-forest/10 rounded-2xl focus:outline-none focus:border-forest/30 transition-all font-medium text-forest-dark resize-none"
                      placeholder="Describe the product and its benefits..."
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-5 text-xs font-black uppercase tracking-[0.3em] mt-4">
                  {editId ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Specifications Modal */}
      <AnimatePresence>
        {showSpecsId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSpecsId(null)}
              className="absolute inset-0 bg-forest-dark/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="h-64 relative">
                <img
                  src={products.find(p => p._id === showSpecsId)?.imageUrl || 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'}
                  className="w-full h-full object-cover"
                  alt="Specs Header"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <button
                  onClick={() => setShowSpecsId(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-forest-dark shadow-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-3 py-1 bg-forest/5 text-forest text-[10px] font-black uppercase tracking-widest rounded-full">
                      {products.find(p => p._id === showSpecsId)?.category}
                    </span>
                    <h2 className="text-3xl font-black text-forest-dark mt-3">
                      {products.find(p => p._id === showSpecsId)?.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-1">Price</p>
                    <p className="text-2xl font-black text-forest">Rs. {products.find(p => p._id === showSpecsId)?.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-forest-dark uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-forest/70 leading-relaxed">
                      {products.find(p => p._id === showSpecsId)?.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 p-6 bg-forest/5 rounded-[24px] border border-forest/5">
                    <div>
                      <p className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-1">Availability</p>
                      <p className="font-bold text-success flex items-center gap-2 text-sm"><CheckCircle size={14} /> In Stock (Immediate)</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-forest/40 uppercase tracking-widest mb-1">Financing</p>
                      <p className="font-bold text-forest text-sm">Up to 12 Months BNPL</p>
                    </div>
                  </div>
                </div>

                {!canManageProducts && (
                  <button
                    onClick={() => { handleApply(products.find(p => p._id === showSpecsId)); setShowSpecsId(null); }}
                    className="btn-primary w-full py-5 text-xs font-black uppercase tracking-[0.3em] mt-8"
                  >
                    Apply for Financing
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
