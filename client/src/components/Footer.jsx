import React from 'react';
import { Mail, Instagram, MessageSquare, Compass, PhoneCall } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-luxury-black border-t border-luxury-gold/15 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative ambient subtle lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-brown/10 to-luxury-black pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Branding Block */}
        <div className="md:col-span-2">
          <span className="font-heading text-3xl text-luxury-gold tracking-widest text-glow-gold block mb-4">
            DINEVERSE
          </span>
          <p className="text-sm text-luxury-cream/60 max-w-sm leading-relaxed mb-6 font-light">
            An premium fine-dining space where celestial craft meets cosmic luxury. Experience handcrafted culinary art, curated mixology collections, and acoustic-private dining sanctuaries.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-luxury-gold/25 bg-luxury-black flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 hover:scale-110 shadow-glass-gold"
              title="Chat with Concierge on WhatsApp"
            >
              <MessageSquare size={18} />
            </a>
            <a 
              href="https://instagram.com/dineverse_luxury" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-luxury-gold/25 bg-luxury-black flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 hover:scale-110 shadow-glass-gold"
              title="Follow us on Instagram"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="mailto:concierge@dineverse.com" 
              className="w-10 h-10 rounded-full border border-luxury-gold/25 bg-luxury-black flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 hover:scale-110 shadow-glass-gold"
              title="Email Reservation Concierge"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Operational hours block */}
        <div>
<h4 className="text-xs uppercase tracking-widest text-luxury-gold mb-6 font-semibold border-b border-luxury-gold/15 pb-2 hover-glow-text">
             OPERATIONAL TIMINGS
           </h4>
          <ul className="space-y-3 text-xs text-luxury-cream/80">
            <li className="flex justify-between">
              <span className="font-light uppercase">Monday - Thursday</span>
              <span className="text-luxury-gold font-medium">17:00 – 23:30</span>
            </li>
            <li className="flex justify-between">
              <span className="font-light uppercase">Friday - Saturday</span>
              <span className="text-luxury-orange font-medium">17:00 – 01:00</span>
            </li>
            <li className="flex justify-between">
              <span className="font-light uppercase">Sunday Brunch</span>
              <span className="text-luxury-gold font-medium">11:30 – 16:00</span>
            </li>
            <li className="flex justify-between border-t border-white/5 pt-2 mt-2">
              <span className="font-light uppercase text-luxury-cream/60">Midnight Lounge</span>
              <span className="text-luxury-cream/60">Daily till 02:00</span>
            </li>
          </ul>
        </div>

        {/* Location & Policies */}
        <div>
<h4 className="text-xs uppercase tracking-widest text-luxury-gold mb-6 font-semibold border-b border-luxury-gold/15 pb-2 hover-glow-text">
             THE CHATEAU
           </h4>
          <p className="text-xs text-luxury-cream/80 leading-relaxed mb-4 font-light uppercase">
            Avenue de L'Étoile 42,<br />
            Cosmopolitan Skyway Heights
          </p>
          <div className="flex items-center gap-2 text-xs text-luxury-gold mb-4">
            <PhoneCall size={12} />
            <span className="font-medium">+1 (800) DINE-VERSE</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-luxury-orange font-medium block">
            * Strict Velvet Formal Dress Code Enforced
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-luxury-cream/40 tracking-wider">
          &copy; {new Date().getFullYear()} DINEVERSE RESIDENCE. ALL RIGHTS RESERVED. DESIGNED FOR CULINARY COSMOPOLITANS.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
