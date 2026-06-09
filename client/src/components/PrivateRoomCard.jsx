import React from 'react';
import { Users, ShieldCheck, Eye, Sparkles } from 'lucide-react';
import GlassButton from './GlassButton';

export const PrivateRoomCard = ({ room, onBook }) => {
  return (
    <div className="glass-card group glass-panel rounded-3xl overflow-hidden transition-all duration-500 hover:border-luxury-gold hover:shadow-glass-gold flex flex-col h-full bg-luxury-black/30">
      
      {/* Venue Room Image */}
      <div className="relative overflow-hidden aspect-[16/10] w-full">
        <img
          src={room.imageUrl || 'https://images.unsplash.com/photo-1570129476589-94f50b8aaeb4?auto=format&fit=crop&q=80&w=600'}
          alt={room.title}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-transparent"></div>

        {/* Ambient top glowing status tag */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold px-3 py-1 rounded-full backdrop-blur-md">
          <Sparkles size={10} className="text-luxury-gold animate-pulse" />
          <span>VVIP Suite</span>
        </div>
      </div>

      {/* Specifications */}
      <div className="p-6 flex flex-col flex-grow relative">
        <h3 className="text-xl text-luxury-gold hover-glow-text transition-all duration-300 uppercase tracking-widest font-heading mb-4 border-b border-white/5 pb-2">
          {room.title}
        </h3>

        <p className="text-xs text-luxury-cream/70 leading-relaxed font-light mb-6">
          {room.description}
        </p>

        {/* Specification Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-3 bg-luxury-black/55 border border-white/5 rounded-2xl text-center">
            <Users size={14} className="text-luxury-orange mx-auto mb-1.5" />
            <span className="text-[10px] text-luxury-cream/40 uppercase block mb-0.5 tracking-wider font-semibold">Capacity</span>
            <span className="text-xs font-semibold text-luxury-cream">{room.capacity} Guests</span>
          </div>

          <div className="p-3 bg-luxury-black/55 border border-white/5 rounded-2xl text-center">
            <ShieldCheck size={14} className="text-luxury-gold mx-auto mb-1.5" />
            <span className="text-[10px] text-luxury-cream/40 uppercase block mb-0.5 tracking-wider font-semibold">Acoustics</span>
            <span className="text-xs font-semibold text-luxury-cream" title="Acoustic Noise Isolation Floor Limit">{room.acoustics}</span>
          </div>

          <div className="p-3 bg-luxury-black/55 border border-white/5 rounded-2xl text-center">
            <Eye size={14} className="text-luxury-amber mx-auto mb-1.5" />
            <span className="text-[10px] text-luxury-cream/40 uppercase block mb-0.5 tracking-wider font-semibold">Panorama</span>
            <span className="text-xs font-semibold text-luxury-cream truncate block" title={room.panorama}>{room.panorama}</span>
          </div>
        </div>

        {/* Booking buttons */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-luxury-cream/40 block">Corporate Deposit</span>
            <span className="text-base font-heading text-luxury-gold tracking-wider hover-glow-text">${room.depositPrice}</span>
          </div>

          <GlassButton 
            onClick={() => onBook(room)}
            variant="gold"
            className="px-5 py-2.5 text-xs uppercase font-semibold"
          >
            BOOK NOW
          </GlassButton>
        </div>
      </div>
    </div>
  );
};
export default PrivateRoomCard;
