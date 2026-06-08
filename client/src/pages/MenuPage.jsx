import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuStore } from '../store/menuStore';
import { useAuthStore } from '../store/authStore';
import FoodCard from '../components/FoodCard';
import MocktailCard from '../components/MocktailCard';
import { ChefHat, Sparkles } from 'lucide-react';

export const MenuPage = () => {
  const { menuItems, loading, categoryFilter, setCategoryFilter, fetchMenuItems } = useMenuStore();
  const { wishlist, fetchWishlist, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchMenuItems();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [fetchMenuItems, fetchWishlist, isAuthenticated]);

  const categories = ['All', 'Mocktails', 'Desserts', 'Main Dishes', 'Chef Specials'];

  const filteredItems = categoryFilter === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === categoryFilter);

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      
      {/* Glow ambient design backdrops */}
      <div className="glow-orb-amber -top-10 right-10"></div>
      <div className="glow-orb-orange bottom-10 left-10"></div>

      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-16 space-y-4 page-entrance">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold font-bold hover-glow-text">
          <ChefHat size={14} className="text-luxury-orange animate-bounce" />
          <span>The DineVerse Gastronomy</span>
        </div>
        <h1 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest leading-none hover-glow-text">
          The Culinary Canvas
        </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/40 font-light hover-glow-text alt">
          On-Premise curated sensory experiences formulated with hand-selected seasonal harvests
        </p>
      </div>

      {/* Interactive Luxury Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`relative px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all duration-300 ${
              categoryFilter === category
                ? 'border-luxury-orange text-white shadow-neon-glow'
                : 'border-white/5 bg-luxury-black/60 text-luxury-cream/70 hover:text-luxury-gold hover:border-luxury-gold/30'
            }`}
          >
            {categoryFilter === category && (
              <motion.span 
                layoutId="activeTabGlow"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-luxury-orange/10 to-luxury-gold/10 -z-10"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="flex items-center gap-1.5">
              {category === 'Chef Specials' && <Sparkles size={10} className="text-luxury-gold animate-spin" />}
              {category}
            </span>
          </button>
        ))}
      </div>

      {/* Menu Cards Display Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-luxury-cream/40 font-semibold">Resolving Culinary Vault...</span>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                {item.category === 'Mocktails' ? (
                  <MocktailCard item={item} />
                ) : (
                  <FoodCard item={item} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-20 border border-white/5 bg-luxury-black/35 rounded-3xl">
          <p className="text-sm uppercase tracking-widest text-luxury-cream/40 font-medium mb-2">No luxury items populated</p>
          <p className="text-xs text-luxury-cream/30">The Chef is currently formulating next week's micro-inventions.</p>
        </div>
      )}

    </div>
  );
};
export default MenuPage;
