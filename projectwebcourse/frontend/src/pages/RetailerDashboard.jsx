import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Tags, TrendingUp, Package, CheckCircle, Activity, ArrowRight, DollarSign } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import productService from '../services/productService';
import { Link } from 'react-router-dom';

const RetailerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await productService.getProducts();
        // Filter products where retailerId matches current user
        const myProducts = res.data.filter(p => p.retailerId?._id === user._id);
        setProducts(myProducts);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchMyProducts();
  }, [user]);

  // Mock Sales Data for the dashboard
  const totalSales = products.length * 45000; 
  const activeLoans = Math.floor(products.length * 0.6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="relative h-64 rounded-[40px] overflow-hidden bg-forest-dark flex items-center px-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-mint/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-terracotta/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        </div>
        
        <div className="relative z-10">
          <span className="px-4 py-1.5 bg-wheat/10 text-wheat rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block border border-wheat/20">Business Overview</span>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter">
            Retailer <span className="text-wheat italic">Command Center</span>
          </h1>
          <p className="text-white/60 text-lg font-medium max-w-lg">
            Manage your inventory, track sales, and grow your business with RuralPay.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex flex-col h-full border-t-4 border-t-peach relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Package size={64} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-peach/20 text-peach flex items-center justify-center mb-6">
            <Tags size={24} />
          </div>
          <h3 className="text-sm font-black text-forest/40 uppercase tracking-widest mb-1">Active Listings</h3>
          <p className="text-4xl font-black text-forest-dark">{products.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex flex-col h-full border-t-4 border-t-mint relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <DollarSign size={64} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-mint/20 text-mint flex items-center justify-center mb-6">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-sm font-black text-forest/40 uppercase tracking-widest mb-1">Total Sales Vol.</h3>
          <p className="text-4xl font-black text-forest-dark">Rs. {totalSales.toLocaleString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 flex flex-col h-full border-t-4 border-t-success relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Activity size={64} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-success/20 text-success flex items-center justify-center mb-6">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-sm font-black text-forest/40 uppercase tracking-widest mb-1">Active BNPL Loans</h3>
          <p className="text-4xl font-black text-forest-dark">{activeLoans}</p>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-forest-dark">Your Recent Inventory</h3>
            <Link to="/marketplace" className="text-sm font-bold text-forest hover:text-forest-dark flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12 bg-forest/5 rounded-3xl border-2 border-dashed border-forest/10">
              <Package size={32} className="text-forest/20 mx-auto mb-4" />
              <p className="text-forest/60 font-medium">You haven't listed any products yet.</p>
              <Link to="/marketplace" className="btn-primary inline-block mt-4 px-6 py-3 text-xs">
                List First Product
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 4).map((product) => (
                <div key={product._id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 border border-transparent hover:border-forest/10 transition-all">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-forest/5 shrink-0">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-forest-dark truncate">{product.name}</h4>
                    <p className="text-xs text-forest/50 font-medium truncate">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-forest">Rs. {product.price.toLocaleString()}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-success">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 bg-forest-dark text-white text-center rounded-[32px]">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tags size={28} className="text-wheat" />
            </div>
            <h3 className="text-xl font-bold mb-2">Ready to expand?</h3>
            <p className="text-white/60 text-sm mb-6">List more durable goods to increase your sales pipeline.</p>
            <Link to="/marketplace" className="btn-primary bg-wheat text-forest-dark w-full py-4 text-xs">
              Add New Product
            </Link>
          </div>

          <div className="glass-card p-6 rounded-[32px] border border-forest/10">
            <h4 className="text-sm font-black text-forest-dark uppercase tracking-widest mb-4">System Alerts</h4>
            <div className="space-y-3">
              <div className="p-3 bg-mint/20 text-mint-dark rounded-xl text-sm font-medium flex gap-3">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                <p>Your account is verified and ready for sales.</p>
              </div>
              <div className="p-3 bg-peach/10 text-peach-dark rounded-xl text-sm font-medium flex gap-3">
                <Activity size={18} className="shrink-0 mt-0.5" />
                <p>Market demand for Solar Pumps is up 12% this week.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;
