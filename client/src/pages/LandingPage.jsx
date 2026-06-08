import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMenuStore } from '../store/menuStore';
import { ArrowRight, Star, ChevronLeft, ChevronRight, Play, Eye, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import GlassButton from '../components/GlassButton';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { menuItems, fetchMenuItems } = useMenuStore();

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Filter Chef Specials & newly invented premium mocktails for showcases
  const chefInventions = menuItems.filter(item => item.category === 'Chef Specials').slice(0, 4);
  const premiumMocktails = menuItems.filter(item => item.category === 'Mocktails').slice(0, 3);

  const reviewsList = [
    {
      name: 'Vicomte Henri de Valois',
      role: 'Michelin Critic',
      comments: 'DineVerse is a sensory masterclass. The Smoked Truffle Wagyu is a spiritual encounter—culinary theater executed with astronomical precision. Simply unmatched.',
      rating: 5,
    },
    {
      name: 'Lady Genevieve Sterling',
      role: 'Premium Lifestyle Journalist',
      comments: 'Between the complete acoustic isolation of the Obsidian Lounge and the Amber Elixir Glow mixology, my booking was an ethereal sanctuary. Standard dining is officially obsolete.',
      rating: 5,
    },
    {
      name: 'Dr. Alistair Vance',
      role: 'Connoisseur Circular',
      comments: 'The golden borders, the matte black glassmorphism, and the sheer focus on premium comfort. DineVerse is the crowning achievement of luxury hospitality in the modern decade.',
      rating: 5,
    }
  ];

  const handleNextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % reviewsList.length);
  };

  const handlePrevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  const handleSecureNavigation = (path) => {
    if (!isAuthenticated) {
      openAuthModal(path);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-20">
      
      {/* Background radial overlays */}
      <div className="glow-orb-amber top-[10%] -left-20"></div>
      <div className="glow-orb-orange top-[40%] -right-30"></div>

      {/* Cinematic Parallax Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-6 overflow-hidden">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600" 
            alt="DineVerse Luxury Atmosphere" 
            className="w-full h-full object-cover opacity-35 scale-105 animate-[pulse_10s_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 text-luxury-gold text-xs uppercase tracking-widest font-semibold animate-bounce">
            <Sparkles size={12} className="text-luxury-orange animate-spin" />
            <span>On-Premise Culinary Sanctuary</span>
          </div>

<h1 className="text-4xl md:text-7xl text-luxury-gold uppercase leading-tight tracking-widest text-glow-gold hover-glow-text">
             DineVerse
           </h1>
          <p className="text-lg md:text-2xl text-luxury-cream/80 uppercase font-light tracking-widest max-w-2xl mx-auto leading-relaxed border-b border-luxury-gold/20 pb-6">
            Where Culinary Craft Meets Cosmic Elegance
          </p>

          <p className="text-sm md:text-base text-luxury-cream/60 max-w-lg mx-auto font-light leading-relaxed">
            Reserved exclusively for cosmopolitans who demand unmatched sensory perfection. No deliveries. No drivers. Just pure, on-site theatrical luxury.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <GlassButton 
              onClick={() => handleSecureNavigation('/reservations')} 
              variant="orange"
            >
              Reserve A Table
            </GlassButton>
            <GlassButton 
              onClick={() => handleSecureNavigation('/menu')} 
              variant="gold"
            >
              Explore Menu Engine
            </GlassButton>
          </div>
        </div>
      </section>

      {/* The Ambiance & Velvet Speciality Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 relative">
        <div className="glow-orb-amber bottom-10 left-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Images Layout Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden aspect-[3/4] border border-luxury-gold/10 hover:border-luxury-gold/40 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500" 
                  alt="Acoustic lounge design" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="rounded-3xl overflow-hidden aspect-square border border-luxury-gold/10 hover:border-luxury-gold/40 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=500" 
                  alt="Mixology station" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-3xl overflow-hidden aspect-square border border-luxury-gold/10 hover:border-luxury-gold/40 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500" 
                  alt="Executive table layout" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="rounded-3xl overflow-hidden aspect-[3/4] border border-luxury-gold/10 hover:border-luxury-gold/40 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500" 
                  alt="Chef plating details" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Speciality Copywriting */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-luxury-orange font-bold text-glow-orange block">
                The Velvet Architecture
              </span>
<h2 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-wider leading-tight hover-glow-text">
                 Acoustic Isolation & Imperial Comforts
               </h2>
            </div>

            <p className="text-sm text-luxury-cream/70 leading-relaxed font-light">
              DineVerse is crafted around physical luxury. Our dining room lounges integrate micro-acoustic panels, permitting conversations to stay completely private within your circle. Every gold-plated table has ambient glowing spotlights configured for eye comfort.
            </p>

            {/* List features */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2 border-l-2 border-luxury-gold pl-4">
                <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold hover-glow-text">95dB Dampening</h4>
                <p className="text-xs text-luxury-cream/50">Complete structural acoustic shield parameters inside VVIP lounges.</p>
              </div>
              <div className="space-y-2 border-l-2 border-luxury-orange pl-4">
                <h4 className="text-xs uppercase tracking-widest text-luxury-orange font-semibold hover-glow-text">Mixology Grotto</h4>
                <p className="text-xs text-luxury-cream/50">Hand-shaken carbonated tonics infused with smoked Himalayan woods.</p>
              </div>
            </div>

            <div className="pt-6">
              <GlassButton 
                onClick={() => handleSecureNavigation('/private-dining')} 
                variant="gold"
              >
                Tour Sanctuary Venues
              </GlassButton>
            </div>
          </div>
        </div>
      </section>

      {/* Newly Invented Chef Creations Section */}
      <section className="py-24 bg-luxury-black/30 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1 text-xs text-luxury-orange font-bold uppercase tracking-widest">
              <Flame size={12} className="animate-pulse" />
              <span>Newly Invented Masterpieces</span>
            </div>
<h2 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest hover-glow-text">
               From The Chef's Private Crucible
             </h2>
            <p className="text-xs uppercase tracking-widest text-luxury-cream/40 font-light max-w-md mx-auto">
              Limited-run culinary experiments engineered with volcanic elements and 24-karat gold leaf overlays
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {chefInventions.length > 0 ? (
              chefInventions.map((item) => (
                <div key={item._id} className="group relative glass-panel rounded-3xl overflow-hidden flex flex-col h-full hover:border-luxury-gold/40 transition-all duration-300">
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black to-transparent"></div>
                    <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-wider font-bold bg-luxury-orange/20 border border-luxury-orange/40 text-luxury-amber px-2.5 py-0.5 rounded-full">
                      New Invention
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-sm uppercase tracking-wide font-semibold text-luxury-cream group-hover:text-luxury-gold transition-colors duration-300 mb-2 hover-glow-text">
                      {item.title}
                    </h3>
                    <p className="text-xs text-luxury-cream/60 leading-relaxed font-light mb-4 flex-grow line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-auto">
                      <span className="text-xs font-bold text-luxury-gold">${item.price}</span>
                      <button 
                        onClick={() => handleSecureNavigation('/menu')}
                        className="text-[10px] uppercase font-bold tracking-widest text-luxury-orange hover:text-white transition-colors"
                      >
                        RESERVE TO TASTE &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-luxury-cream/40 text-sm uppercase tracking-widest">
                Populating private masterworks from server script...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials horizontal slider deck */}
      <section className="py-24 max-w-4xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold text-glow-gold">
            Critiques & Appraisals
          </span>
        </div>

        <div className="glass-panel-heavy p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-neon-glow flex flex-col items-center text-center">
          {/* Quotes visual accent background */}
          <div className="absolute top-4 left-6 text-7xl font-serif text-luxury-gold/5 pointer-events-none">“</div>
          
          <div className="flex gap-1 mb-6 relative z-10">
            {[...Array(reviewsList[activeReviewIndex].rating)].map((_, i) => (
              <Star key={i} size={16} className="text-luxury-gold fill-luxury-gold" />
            ))}
          </div>

          <p className="text-sm md:text-lg text-luxury-cream/90 italic leading-relaxed mb-8 relative z-10 max-w-2xl font-light">
            "{reviewsList[activeReviewIndex].comments}"
          </p>

          <div className="relative z-10">
<h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-1 hover-glow-text">
               {reviewsList[activeReviewIndex].name}
             </h4>
            <span className="text-[10px] uppercase tracking-wider text-luxury-cream/40 font-medium">
              {reviewsList[activeReviewIndex].role}
            </span>
          </div>

          {/* Left / Right Nav Arrows */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePrevReview}
              className="p-2.5 rounded-full border border-luxury-gold/20 hover:border-luxury-orange text-luxury-gold hover:text-white transition-all duration-300"
              aria-label="Previous Review"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextReview}
              className="p-2.5 rounded-full border border-luxury-gold/20 hover:border-luxury-orange text-luxury-gold hover:text-white transition-all duration-300"
              aria-label="Next Review"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
export default LandingPage;
