import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Wallet, ArrowRightLeft, Receipt, PieChart, Shield, LogOut, Menu, X, Tags, User, CreditCard, Activity, Bell, FileText, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingCrops from './FloatingCrops';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  let navLinks = [];
  
  if (user?.role === 'admin') {
    navLinks = [
      { path: '/admin', label: 'Admin Dashboard', icon: <Shield size={20} /> },
      { path: '/marketplace', label: 'Manage Inventory', icon: <Tags size={20} /> },
      { path: '/admin/financing', label: 'Financing Review', icon: <CreditCard size={20} /> },
      { path: '/admin/flagged', label: 'Fraud Monitoring', icon: <Flag size={20} /> },
      { path: '/admin/wallets', label: 'All Wallets', icon: <CreditCard size={20} /> },
      { path: '/admin/transactions', label: 'All Transactions', icon: <Activity size={20} /> },
      { path: '/admin/categories', label: 'Categories', icon: <Tags size={20} /> },
      { path: '/admin/reports', label: 'System Reports', icon: <FileText size={20} /> },
    ];
  } else if (user?.role === 'retailer') {
    navLinks = [
      { path: '/retailer/dashboard', label: 'Retailer Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/marketplace', label: 'Manage Inventory', icon: <Tags size={20} /> },
      { path: '/transactions', label: 'Sales Activity', icon: <ArrowRightLeft size={20} /> },
      { path: '/profile', label: 'Business Profile', icon: <User size={20} /> },
    ];
  } else {
    navLinks = [
      { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/marketplace', label: 'Marketplace', icon: <Tags size={20} /> },
      { path: '/financing', label: 'My Financing', icon: <CreditCard size={20} /> },
      { path: '/wallet', label: 'Wallet Vault', icon: <Wallet size={20} /> },
      { path: '/transactions', label: 'Activity Log', icon: <ArrowRightLeft size={20} /> },
      { path: '/expenses', label: 'Expenditure', icon: <Receipt size={20} /> },
      { path: '/budgets', label: 'Harvest Budget', icon: <PieChart size={20} /> },
      { path: '/reports', label: 'Wealth Reports', icon: <Activity size={20} /> },
      { path: '/notifications', label: 'Alerts', icon: <Bell size={20} /> },
      { path: '/profile', label: 'Heritage Profile', icon: <User size={20} /> },
    ];
  }

  const sidebarVariants = {
    open: { width: '280px', x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    closed: { 
      width: isMobile ? '280px' : '88px', 
      x: isMobile ? '-120%' : 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex overflow-hidden relative">
      <FloatingCrops count={8} opacity={0.03} />
      {/* Cinematic Background Glows */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-forest/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-terracotta/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
        className={`relative z-50 h-[calc(100vh-2rem)] flex flex-col glass-panel border-white/20 m-4 rounded-[32px] overflow-hidden shadow-2xl bg-white/40 ${isMobile ? 'fixed top-0 left-0 bottom-0 m-2' : ''}`}
      >
        <div className="p-8 flex items-center justify-between">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest to-forest-light flex items-center justify-center shadow-xl border border-white/20 p-2.5 overflow-hidden">
                  <img src="/wheat_logo.png" alt="RuralPay Logo" className="w-full h-full object-contain brightness-110" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-forest-dark tracking-tighter leading-none">RuralPay</h2>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-forest bg-forest/10 px-2.5 py-1 rounded-full mt-1.5 inline-block">{user?.role || 'user'}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-xl hover:bg-forest/5 text-forest transition-all ml-auto hover:rotate-180 duration-500"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="flex-1 px-5 py-6 space-y-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative ${isActive
                    ? 'bg-forest text-wheat shadow-2xl scale-[1.02]'
                    : 'text-forest/60 hover:bg-white/60 hover:text-forest-dark'
                  }`}
                title={!isSidebarOpen ? link.label : ""}
              >
                <div className={`${isActive ? 'text-mint' : 'text-forest/40 group-hover:text-forest transition-colors duration-300'}`}>
                  {link.icon}
                </div>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-bold text-sm whitespace-nowrap tracking-wide"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && isSidebarOpen && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-mint"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-forest/5 bg-white/20 backdrop-blur-md">
          <div className={`flex items-center gap-4 p-4 rounded-[24px] bg-white/40 border border-white/60 mb-3 ${!isSidebarOpen ? 'justify-center p-2' : ''}`}>
            <div className={`w-12 h-12 min-w-[48px] rounded-2xl overflow-hidden bg-gradient-to-br from-peach to-terracotta text-white flex items-center justify-center font-black shadow-lg border-2 border-white/20`}>
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  className="w-full h-full object-cover" 
                  alt={user.name}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }} 
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center" style={{ display: user?.profileImage ? 'none' : 'flex' }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-forest-dark truncate leading-none mb-1">{user?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-forest/40 truncate uppercase tracking-widest">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-error hover:bg-error/10 transition-all duration-300 group ${!isSidebarOpen ? 'justify-center' : ''}`}
            title={!isSidebarOpen ? "Logout" : ""}
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-black text-sm uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto pb-24 lg:pb-12 px-3 sm:px-4 lg:pr-4 lg:pl-0 pt-4 lg:pt-10 relative w-full max-w-[100vw]">

        {/* Mobile Top Bar */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6 px-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 rounded-2xl bg-white/80 border border-white shadow-lg text-forest hover:bg-white transition-all backdrop-blur-md"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-forest to-forest-light flex items-center justify-center shadow-lg p-1.5 overflow-hidden">
                <img src="/wheat_logo.png" alt="RuralPay" className="w-full h-full object-contain brightness-110" />
              </div>
              <span className="text-lg font-black text-forest-dark tracking-tighter">RuralPay</span>
            </div>
            <div className="flex gap-2">
              <Link to="/notifications" className="w-10 h-10 rounded-xl bg-white/60 border border-white/80 flex items-center justify-center text-forest shadow-sm hover:bg-white transition-all">
                <Bell size={18} />
              </Link>
              <Link to="/profile" className="w-10 h-10 rounded-xl overflow-hidden bg-white/60 border border-white/80 flex items-center justify-center text-forest shadow-sm hover:bg-white transition-all">
                {user?.profileImage ? (
                  <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                ) : (
                  <User size={18} />
                )}
              </Link>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <header className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6 mb-12 ml-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="greeting">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-forest/40 mb-3 block">Rural Banking Reimagined</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-forest-dark tracking-tighter">
                Welcome, <span className="text-terracotta italic">{user?.name?.split(' ')[0] || 'Partner'}</span>
              </h1>
              <p className="text-forest/60 mt-2 font-medium text-sm md:text-base">Cultivating your financial future, today.</p>
            </motion.div>
            <div className="flex gap-4 self-end md:self-auto mr-6">
              <Link to="/notifications" className="w-12 h-12 rounded-2xl bg-white/60 border border-white/80 flex items-center justify-center text-forest shadow-sm cursor-pointer hover:bg-white transition-all">
                <Bell size={20} />
              </Link>
              <Link to="/profile" className="w-12 h-12 rounded-2xl overflow-hidden bg-white/60 border border-white/80 flex items-center justify-center text-forest shadow-sm cursor-pointer hover:bg-white transition-all">
                {user?.profileImage ? (
                  <>
                    <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name}
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    <div className="w-full h-full items-center justify-center hidden"><User size={20} /></div>
                  </>
                ) : (
                  <User size={20} />
                )}
              </Link>
            </div>
          </header>
        )}

        <div className="w-full h-full max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-forest/10 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-2 py-2">
            <div className="flex items-center justify-around">
              {navLinks.slice(0, 5).map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 min-w-[52px] ${
                      isActive ? 'bg-forest text-wheat' : 'text-forest/50 hover:text-forest'
                    }`}
                  >
                    <span className={isActive ? 'text-mint' : ''}>{link.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-wide leading-none">{link.label.split(' ')[0]}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl text-forest/50 hover:text-forest transition-all min-w-[52px]"
              >
                <Menu size={20} />
                <span className="text-[9px] font-black uppercase tracking-wide leading-none">More</span>
              </button>
            </div>
          </nav>
        )}
      </main>
    </div>
  );
};

export default Layout;
