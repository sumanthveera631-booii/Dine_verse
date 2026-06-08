import React from 'react';
import { ChefHat, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export const OurStoryPage = () => {
  const timelineEvents = [
    {
      year: '2016',
      title: 'The Crucible Genesis',
      description: 'Founders Julian Sterling and Chef Imperia establish a micro-dining cellar in the ancient brick vault vaults of Old Star Avenue, limiting seating to just 6 patrons a night.'
    },
    {
      year: '2019',
      title: 'The Acoustic Masterclass',
      description: 'DineVerse is awarded its first Michelin stars, pioneering structural soundproofing integration by adding carbon-fiber dampeners inside all lounge ceilings.'
    },
    {
      year: '2022',
      title: 'Rooftop Retractable Shell',
      description: 'The Zenith Sky Deck is constructed, featuring dynamic retractable high-altitude glass shields to facilitate stargazing during fine-dining midnight hours.'
    },
    {
      year: '2025',
      title: 'Cosmopolitan expansion',
      description: 'Upgrading to DineVerse Residence. An active ecosystem combining handcrafted culinary art, mixology grottos, and structural privacy.'
    }
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-6 max-w-6xl mx-auto">
      
      {/* Background glow backdrops */}
      <div className="glow-orb-amber -top-20 -left-10"></div>
      <div className="glow-orb-orange bottom-10 right-10"></div>

      {/* Editorial Header */}
      <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold font-bold">
          <Trophy size={14} className="text-luxury-orange animate-bounce" />
          <span>Awarded Michelin Lineage</span>
        </div>
<h1 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest leading-none hover-glow-text">
           Our Legacy
         </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/40 font-light">
          Celebrating a decade of astronomical culinary craft and premium structural hospitality
        </p>
      </div>

      {/* Parallax Editorial Layout Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-luxury-orange font-bold text-glow-orange block">
            THE PHILOSOPHY
          </span>
<h2 className="text-2xl md:text-4xl text-luxury-gold uppercase tracking-wider font-heading leading-tight hover-glow-text">
             Gastronomy Shielded In Silent Sovereignty
           </h2>
          <p className="text-sm text-luxury-cream/70 leading-relaxed font-light">
            We believe that fine dining is not merely about ingredients; it is an act of sovereign escape. In a hyper-connected world, true luxury is absolute privacy, quietude, and time.
          </p>
          <p className="text-sm text-luxury-cream/60 leading-relaxed font-light">
            Every dish we formulate undergoes weeks of kinetic and thermal calibration. Our active acoustic architecture isolates your table, ensuring that the only auditory inputs you experience are the soft music score, the sound of crystal clinking, and private whispers.
          </p>
        </div>

        {/* Cinematic editorial layout */}
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-luxury-gold/25 hover:border-luxury-gold transition-all duration-500 shadow-glass-gold group">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" 
            alt="Seared premium steaks" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 flex items-center gap-2 text-xs bg-luxury-black/85 border border-luxury-gold/30 text-luxury-gold px-3.5 py-1.5 rounded-full font-bold uppercase backdrop-blur-md">
            <Sparkles size={10} className="animate-spin" />
            <span>Volcanic Searing Calibration</span>
          </div>
        </div>
      </div>

      {/* Culinary Timelines Grid */}
      <div className="mb-24">
<h3 className="text-xl text-luxury-gold font-heading uppercase tracking-widest text-center mb-12 border-b border-white/5 pb-4 max-w-xs mx-auto hover-glow-text">
           Culinary Lineage Timelines
         </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {timelineEvents.map((event, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luxury-gold/20 transition-all duration-300 relative bg-luxury-black/35 flex flex-col h-full">
              <span className="font-heading text-4xl text-luxury-orange tracking-widest text-glow-orange block mb-2">
                {event.year}
              </span>
              <h4 className="text-xs uppercase font-semibold text-luxury-gold mb-3 tracking-wide hover-glow-text">{event.title}</h4>
              <p className="text-xs text-luxury-cream/60 leading-relaxed font-light flex-grow">{event.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Features highlighting Executive Chefs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Chef Portrait */}
        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-luxury-orange/25 hover:border-luxury-orange transition-all duration-500 shadow-glass-amber group">
          <img 
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800" 
            alt="Chef Imperia" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <span className="text-[10px] text-luxury-orange uppercase font-bold tracking-widest block mb-0.5">Founding Gastronomist</span>
            <h4 className="text-lg text-luxury-gold font-heading uppercase tracking-widest hover-glow-text">Master Chef Imperia Vance</h4>
          </div>
        </div>

        {/* Chef details */}
        <div className="space-y-6">
          <div className="flex items-center gap-1.5 text-xs text-luxury-orange font-bold uppercase tracking-widest">
            <ChefHat size={14} />
            <span>Executive Culinary Guild</span>
          </div>
<h3 className="text-2xl md:text-4xl text-luxury-gold uppercase tracking-wider font-heading leading-tight hover-glow-text">
             Crafted by the Hands of Visionaries
           </h3>
          <p className="text-sm text-luxury-cream/70 leading-relaxed font-light">
            Chef Imperia Vance stands at the absolute pinnacle of luxury food design. Having trained under historical French masters and Japanese molecular physicists, her plates represent canvas artwork.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 flex items-center justify-center text-luxury-gold flex-shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-xs uppercase font-semibold text-luxury-cream mb-0.5 tracking-wide hover-glow-text">Chemical Calibration standards</h4>
                <p className="text-xs text-luxury-cream/55 font-light">Every single stock and sauce reduction is tested using digital refractometers for flavor concentration.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 flex items-center justify-center text-luxury-gold flex-shrink-0 mt-0.5">
                <ChefHat size={16} />
              </div>
              <div>
                <h4 className="text-xs uppercase font-semibold text-luxury-cream mb-0.5 tracking-wide hover-glow-text">Sustainable Star Harvesting</h4>
                <p className="text-xs text-luxury-cream/55 font-light">Working exclusively with biodynamic small-scale farms harvesting wild chanterelles and saffron plants.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default OurStoryPage;
