import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const FoodCard = ({ item }) => {
  const { wishlist, toggleWishlist, isAuthenticated } = useAuthStore();
  
  const isLiked = wishlist.some(fav => fav._id === item._id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item._id);
  };

  const defaultImage = 'https://via.placeholder.com/1200x800?text=Dish+Image';
  const [imageSrc, setImageSrc] = useState(item.imageUrl || defaultImage);

  return (
    <div className="glass-card group glass-panel rounded-3xl overflow-hidden transition-all duration-500 hover:border-luxury-gold/50 hover:shadow-glass-amber relative flex flex-col h-full bg-luxury-black/40">
      {/* Product Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] w-full">
        <img
          src={imageSrc}
          alt={item.title}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            if (e?.target && e.target.src !== defaultImage) setImageSrc(defaultImage);
          }}
        />
        {/* Soft shadow gradients overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-transparent"></div>

        {/* Floating Category Tag */}
        <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-widest bg-luxury-black/80 border border-luxury-gold/20 text-luxury-gold px-3 py-1 rounded-full backdrop-blur-md">
          {item.category}
        </span>

        {/* Floating Heart Wishlist Trigger */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isLiked 
              ? 'bg-luxury-orange border-luxury-orange text-white scale-110 shadow-neon-glow'
              : 'bg-luxury-black/75 border-white/10 text-luxury-cream hover:text-luxury-orange hover:border-luxury-orange/40 hover:scale-105'
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} className="transition-transform duration-300" />
        </button>
      </div>

      {/* Content details */}
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg text-luxury-cream hover-glow-text group-hover:text-luxury-gold transition-all duration-300 font-semibold tracking-wide uppercase font-body leading-tight">
            {item.title}
          </h3>
          <span className="text-base font-heading text-luxury-gold tracking-wider hover-glow-text pl-2">
            ${item.price}
          </span>
        </div>

        <p className="text-xs text-luxury-cream/60 leading-relaxed mb-6 font-light flex-grow">
          {item.description}
        </p>

        {/* Ratings & Call to actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(item.rating || 5) ? 'text-luxury-gold fill-luxury-gold' : 'text-luxury-cream/20'}
              />
            ))}
            <span className="text-[10px] text-luxury-cream/40 pl-1 font-medium">({item.rating || '5.0'})</span>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-luxury-orange hover-glow-text group-hover:translate-x-1 transition-transform duration-300">
            Dine-In Exclusive &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
export default FoodCard;
