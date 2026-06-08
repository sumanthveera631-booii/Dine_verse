import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, X, LogIn, User as UserIcon, LogOut, LayoutDashboard, Compass } from 'lucide-react';
import GlassButton from './GlassButton';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    isAuthenticated, 
    role, 
    authModalOpen, 
    authModalRedirectPath, 
    login, 
    register, 
    logout, 
    openAuthModal, 
    closeAuthModal,
    loading,
    error
  } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Auth Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');

  // Hide horizontal navbar on Admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Menu', path: '/menu' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Private Dining', path: '/private-dining' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Our Story', path: '/our-story' },
  ];

  const handleNavLinkClick = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal(path);
      setMobileMenuOpen(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await register(name, email, password, selectedRole);
      } else {
        await login(email, password);
      }
      
      // Navigate to intended path or relevant dashboard
      const redirect = authModalRedirectPath || (selectedRole === 'admin' ? '/admin' : '/dashboard');
      closeAuthModal();
      navigate(redirect);
      
      // Clean forms
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Authentication Error:', err);
    }
  };

  const handleQuickLogin = async (roleType) => {
    try {
      if (roleType === 'admin') {
        await login('admin@dineverse.com', 'admin123');
        closeAuthModal();
        navigate('/admin');
      } else {
        await login('user@dineverse.com', 'user123');
        closeAuthModal();
        navigate(authModalRedirectPath || '/dashboard');
      }
    } catch (err) {
      console.error('Quick Login Error:', err);
    }
  };

  // Compute avatar initials
  const avatarLetter = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-luxury-black/60 backdrop-blur-md border-b border-luxury-gold/15 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl text-luxury-gold tracking-widest text-glow-gold hover:scale-105 transition-transform duration-300">
              DINEVERSE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavLinkClick(e, link.path)}
                className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-luxury-orange font-semibold text-glow-orange'
                    : 'text-luxury-cream/80 hover:text-luxury-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to={role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 group"
                >
                  {/* Glowing user avatar with email first letter */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-luxury-orange to-luxury-gold flex items-center justify-center font-heading text-luxury-black font-extrabold shadow-neon-glow hover:scale-110 transition-transform duration-300">
                    {avatarLetter}
                  </div>
                  <span className="text-sm font-medium text-luxury-cream group-hover:text-luxury-gold transition-colors duration-300">
                    {user?.name || 'My Profile'}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-luxury-cream/60 hover:text-luxury-orange transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <GlassButton onClick={() => openAuthModal()} variant="gold">
                <LogIn size={14} />
                <span>EXPERIENCE DINEVERSE</span>
              </GlassButton>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {isAuthenticated && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-luxury-orange to-luxury-gold flex items-center justify-center font-heading text-luxury-black font-extrabold shadow-neon-glow">
                {avatarLetter}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-luxury-cream hover:text-luxury-gold p-1"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-luxury-gold/10 flex flex-col gap-4 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavLinkClick(e, link.path)}
                className={`text-sm tracking-wider uppercase py-2 ${
                  location.pathname === link.path ? 'text-luxury-orange' : 'text-luxury-cream'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-luxury-gold/10">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to={role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm text-luxury-gold"
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="flex items-center gap-2 py-2 text-sm text-luxury-orange"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <GlassButton 
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }} 
                  variant="gold"
                  className="w-full"
                >
                  <LogIn size={14} />
                  <span>SIGN IN</span>
                </GlassButton>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Elegant Auth Modal Overlay */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-md glass-panel-heavy p-8 rounded-3xl relative overflow-hidden shadow-neon-glow">
            
            {/* Ambient decorative glowing orbs */}
            <div className="glow-orb-amber -top-20 -left-20"></div>
            <div className="glow-orb-orange -bottom-25 -right-25"></div>

            {/* Close Button */}
            <button
              onClick={() => closeAuthModal()}
              className="absolute top-4 right-4 text-luxury-cream/60 hover:text-luxury-orange p-2 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Headline */}
            <div className="text-center mb-8 relative z-10">
<h3 className="text-3xl text-luxury-gold mb-2 uppercase tracking-wider text-glow-gold hover-glow-text">
                 {isSignUp ? 'Create Legacy' : 'Sanctuary Access'}
               </h3>
              <p className="text-xs text-luxury-cream/60 tracking-wider uppercase font-light">
                {isSignUp ? 'Join the DineVerse Cosmopolitan Dining Circle' : 'Unlock premium seating reservation slots'}
              </p>
            </div>

            {/* Slider Toggle */}
            <div className="relative flex bg-luxury-black/80 border border-luxury-gold/15 p-1 rounded-full mb-6 z-10">
              <div 
                className={`absolute top-1 bottom-1 w-[48%] bg-gradient-to-r from-luxury-orange to-luxury-gold rounded-full transition-all duration-300 ${
                  isSignUp ? 'left-[51%]' : 'left-1'
                }`}
              ></div>
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 text-xs py-2 text-center rounded-full uppercase tracking-widest font-semibold transition-colors duration-300 z-10 ${
                  !isSignUp ? 'text-luxury-black' : 'text-luxury-cream/70'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 text-xs py-2 text-center rounded-full uppercase tracking-widest font-semibold transition-colors duration-300 z-10 ${
                  isSignUp ? 'text-luxury-black' : 'text-luxury-cream/70'
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
              {isSignUp && (
                <div>
                  <label className="block text-xs uppercase tracking-widest text-luxury-gold/80 mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your fine-dining pseudonym"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-widest text-luxury-gold/80 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@luxury.com"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-luxury-gold/80 mb-1 font-medium">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs uppercase tracking-widest text-luxury-gold/80 mb-2 font-medium">System Role (Testing Options)</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-luxury-cream/80">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={selectedRole === 'user'}
                        onChange={() => setSelectedRole('user')}
                        className="accent-luxury-orange"
                      />
                      Standard User
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-luxury-orange">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={selectedRole === 'admin'}
                        onChange={() => setSelectedRole('admin')}
                        className="accent-luxury-orange"
                      />
                      System Admin
                    </label>
                  </div>
                </div>
              )}

              <GlassButton
                type="submit"
                variant="orange"
                className="w-full py-3 mt-4"
                loading={loading}
              >
                {isSignUp ? 'DECLARE MEMBERSHIP' : 'CROSS THE VELVET ROPE'}
              </GlassButton>
            </form>

            {/* Quick Testing Credentials Section */}
            <div className="mt-6 pt-4 border-t border-luxury-gold/15 text-center relative z-10">
              <span className="text-[10px] uppercase tracking-widest text-luxury-cream/40 block mb-3 font-semibold">
                Developer Fast-Pass Access (Highly Recommended)
              </span>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleQuickLogin('user')}
                  className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[11px] uppercase tracking-wider text-luxury-cream hover:bg-luxury-gold/25 hover:border-luxury-gold/30 hover:text-luxury-gold transition-all duration-300"
                >
                  🚀 Quick User
                </button>
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className="px-3 py-1.5 rounded-lg border border-luxury-orange/20 bg-luxury-orange/5 text-[11px] uppercase tracking-wider text-luxury-amber hover:bg-luxury-orange/25 hover:border-luxury-orange/50 hover:text-white transition-all duration-300"
                >
                  👑 Quick Admin
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
