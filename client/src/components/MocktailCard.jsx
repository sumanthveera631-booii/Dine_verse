import React from 'react';
import { Heart, GlassWater, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const MocktailCard = ({ item }) => {
  const { wishlist, toggleWishlist } = useAuthStore();
  const isLiked = wishlist.some(fav => fav._id === item._id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item._id);
  };

  return (
    <div className="glass-card group glass-panel rounded-3xl overflow-hidden transition-all duration-500 hover:border-luxury-orange/50 hover:shadow-glass-amber relative flex flex-col h-full bg-luxury-black/40">
      
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-[4/3] w-full bg-luxury-black">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600'}
          alt={item.title}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        {/* Amber lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-brown/20 to-transparent"></div>

        {/* Mixology Category Icon Tag */}
        <span className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest bg-luxury-orange/10 border border-luxury-orange/30 text-luxury-amber px-3 py-1 rounded-full backdrop-blur-md">
          <GlassWater size={10} className="text-luxury-orange" />
          <span>Mixology Crafted</span>
        </span>

        {/* Floating Heart */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isLiked 
              ? 'bg-luxury-orange border-luxury-orange text-white scale-110 shadow-neon-glow'
              : 'bg-luxury-black/75 border-white/10 text-luxury-cream hover:text-luxury-orange hover:border-luxury-orange/40 hover:scale-105'
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Details Area */}
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg text-luxury-cream hover-glow-text group-hover:text-luxury-orange transition-all duration-300 font-semibold tracking-wide uppercase font-body leading-tight">
            {item.title}
          </h3>
          <span className="text-base font-heading text-luxury-orange tracking-wider hover-glow-text pl-2">
            ${item.price}
          </span>
        </div>

        <p className="text-xs text-luxury-cream/60 leading-relaxed mb-6 font-light flex-grow">
          {item.description}
        </p>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(item.rating || 5) ? 'text-luxury-orange fill-luxury-orange' : 'text-luxury-cream/20'}
              />
            ))}
            <span className="text-[10px] text-luxury-cream/40 pl-1 font-medium">({item.rating || '4.9'})</span>
          </div>

          <span className="text-[9px] uppercase font-bold tracking-widest text-luxury-gold hover-glow-text">
            Premium Reserve Only
          </span>
        </div>
      </div>
    </div>
  );
};
export default MocktailCard;
