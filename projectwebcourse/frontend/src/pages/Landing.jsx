import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Shield, Zap, TrendingUp, Users, ArrowRight, Play, CheckCircle, Globe, Leaf, Landmark, X } from 'lucide-react';

const Landing = () => {
  const containerRef = useRef(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scale = useTransform(smoothProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setShowVideoModal(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div ref={containerRef} className="relative bg-cream selection:bg-forest/20">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Parallax Image */}
        <motion.div
          style={{ scale }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/ruralpay_hero.png"
            alt="RuralPay Hero"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-forest-dark/40 to-cream"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-lg">
              Heritage Fintech Platform
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-black text-white mb-6 sm:mb-8 leading-[0.9] [text-shadow:0_10px_30px_rgba(0,0,0,0.5)]">
              The Digital Harvest<br />
              <span className="text-[#D4A373] italic">is Finally Here.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white mb-8 sm:mb-12 font-semibold [text-shadow:0_4px_10px_rgba(0,0,0,0.3)]">
              Growing community prosperity with modern technology.
              Secure wallets, instant micro-financing, and a platform built for your growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register" className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 w-full sm:w-auto">
                Start Your Heritage <ArrowRight size={20} />
              </Link>
              <button
                onClick={() => setShowVideoModal(true)}
                className="btn-secondary text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 w-full sm:w-auto"
              >
                Watch the Vision <Play size={20} fill="currentColor" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-forest/40"
        >
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-current rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Storytelling Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-forest-dark mb-6 sm:mb-8 leading-tight">
              A Digital Wallet<br />
              <span className="text-terracotta">Handcrafted for You.</span>
            </h2>
            <p className="text-base sm:text-xl text-forest-dark mb-8 sm:mb-12 leading-relaxed font-medium">
              We've blended the tactile warmth of traditional rural life with the speed of modern technology.
              Our platform feels like a well-worn leather wallet, but works at the speed of light.
            </p>
            <div className="space-y-6">
              {[
                { icon: <Leaf className="text-success" />, title: "Sustainable Growth", desc: "Eco-friendly credit for solar kits and irrigation." },
                { icon: <Landmark className="text-terracotta" />, title: "Community Banking", desc: "Built on trust, verified by the blockchain." },
                { icon: <Globe className="text-secondary" />, title: "Borderless Access", desc: "Send and receive funds from anywhere, instantly." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 sm:gap-6 p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-white border border-forest/5 hover:border-forest/20 hover:shadow-[0_20px_50px_-15px_rgba(27,67,50,0.15)] transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(item.icon, { size: 28 })}
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-forest-dark text-xl mb-1">{item.title}</h4>
                    <p className="text-forest/70 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-forest/5 rounded-[48px] rotate-3 -z-10 blur-2xl"></div>
            <img
              src="/ruralpay_wallet_3d.png"
              alt="3D Handcrafted Wallet"
              className="w-full h-auto rounded-[48px] shadow-[0_50px_100px_-20px_rgba(27,67,50,0.3)] hover:rotate-2 transition-all duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* Feature Grid with Glassmorphism */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-forest-dark relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-[120px] animate-blob delay-2000"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white mb-4 sm:mb-6">Fintech Features, Rural Soul.</h2>
          <p className="text-base sm:text-xl text-white/60">Everything you need to thrive in the modern rural economy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
          {[
            { icon: <Zap />, title: "Instant BNPL", desc: "Buy farming tools today, pay later with flexible harvests.", color: "text-peach" },
            { icon: <Shield />, title: "Military Grade", desc: "Your assets are protected by top-tier encryption.", color: "text-success" },
            { icon: <TrendingUp />, title: "Smart Yields", desc: "Automated savings that grow with your crops.", color: "text-mint" },
            { icon: <Users />, title: "Group Loans", desc: "Collateral-free loans for village cooperatives.", color: "text-secondary" },
            { icon: <CheckCircle />, title: "Easy KyC", desc: "Register with just your ID and a thumbprint.", color: "text-wheat" },
            { icon: <Activity />, title: "Live Tracking", desc: "Monitor every rupee with cinematic charts.", color: "text-sunset" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card bg-white/5 border-white/10 hover:bg-white/10"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 md:p-24 max-w-5xl mx-auto bg-[#081C15] rounded-[32px] sm:rounded-[48px] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>

          <h2 className="relative z-10 text-3xl sm:text-5xl md:text-7xl font-heading font-black text-white mb-6 sm:mb-8 leading-tight [text-shadow:0_10px_30px_rgba(0,0,0,0.5)]">
            Ready to cultivate<br /><span className="text-[#D4A373]">your financial future?</span>
          </h2>
          <p className="relative z-10 text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Join 50,000+ farmers and artisans already growing with RuralPay.
            Free to start, built to last.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/register" className="btn-primary bg-[#D4A373] text-[#081C15] hover:bg-white px-12 py-5 text-lg border-none">
              Get Started for Free
            </Link>
            <Link to="/login" className="text-white font-black hover:text-[#D4A373] transition-colors underline decoration-2 underline-offset-8 uppercase tracking-widest text-xs">
              Already a Member? Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-forest/5 text-center text-forest/40">
        <p className="text-sm font-bold uppercase tracking-widest">© 2026 RuralPay Fintech Platform. A Heritage Innovation.</p>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowVideoModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-[32px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] border border-white/10 bg-[#081C15]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest to-forest-light flex items-center justify-center">
                  <Play size={14} fill="white" className="text-white" />
                </div>
                <span className="text-white font-black text-sm uppercase tracking-widest">The RuralPay Vision</span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Embed */}
            <div className="aspect-video w-full bg-black">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
                title="RuralPay Vision"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Footer note */}
            <div className="px-8 py-4 border-t border-white/10">
              <p className="text-white/40 text-xs font-medium text-center uppercase tracking-widest">
                RuralPay — Heritage Fintech Platform · 2026
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Placeholder for Activity icon
const Activity = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export default Landing;
