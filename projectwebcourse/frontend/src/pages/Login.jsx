import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Loader, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingCrops from '../components/FloatingCrops';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await login(formData);
      const userRole = res.data?.data?.role || res.data?.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'retailer') {
        navigate('/retailer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingCrops count={10} opacity={0.05} />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card w-full max-w-md relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-mint/30 rounded-bl-full blur-2xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-peach/20 rounded-tr-full blur-2xl -z-10"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest to-forest-light rounded-[20px] flex items-center justify-center mx-auto mb-6 shadow-[0_20px_40px_rgba(27,67,50,0.4)] border border-white/20 p-3 overflow-hidden">
            <img src="/wheat_logo.png" alt="RuralPay Logo" className="w-full h-full object-contain brightness-110" />
          </div>
          <h1 className="text-3xl font-bold text-forest-dark mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-forest/60">Sign in to your RuralPay account</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-medium flex items-center gap-2">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                className="form-input pl-11"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" size={20} />
              <input
                type="password"
                id="password"
                name="password"
                className="form-input pl-11"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full mt-8 group" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 w-full"><Loader className="animate-spin" size={20}/> Signing In...</span>
            ) : (
              <span className="flex items-center justify-center gap-2 w-full">Sign In <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20}/></span>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-forest/60 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-forest-dark hover:text-forest underline decoration-forest/30 underline-offset-4 transition-colors">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
