import React from 'react';

export const GlassButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'gold', // 'gold', 'orange', 'dark'
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseStyle = 'relative inline-flex items-center justify-center px-6 py-3 font-medium rounded-full overflow-hidden transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none tracking-wide text-sm';
  
  const variants = {
    gold: 'border border-luxury-gold/30 bg-luxury-black/40 hover:bg-luxury-gold/20 text-luxury-gold hover:text-white shadow-glass-gold hover:shadow-gold-glow',
    orange: 'border border-luxury-orange/30 bg-luxury-black/40 hover:bg-luxury-orange/20 text-luxury-amber hover:text-white shadow-glass-amber hover:shadow-neon-glow',
    dark: 'border border-white/10 bg-luxury-black/60 hover:bg-white/5 text-luxury-cream hover:text-white'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
        ) : null}
        {children}
      </span>
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></span>
    </button>
  );
};
export default GlassButton;
