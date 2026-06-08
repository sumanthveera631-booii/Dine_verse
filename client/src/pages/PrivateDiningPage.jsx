import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import PrivateRoomCard from '../components/PrivateRoomCard';
import GlassButton from '../components/GlassButton';
import { X, Calendar, Clock, Phone, FileText, CheckCircle2, Star, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export const PrivateDiningPage = () => {
  const { createPrivateBooking, initiateVenuePayment, loading, error } = useBookingStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      date: '',
      timeSlot: '',
      guestCount: 2,
      contactNumber: '',
      specialRequests: '',
    }
  });

  const selectedTimeSlot = watch('timeSlot');

  const fallbackRooms = [
    {
      id: 'obsidian',
      title: 'The Obsidian Lounge',
      description: 'Encased in charcoal matte basalt rock with complete physical sound dampening. Ideal for low-profile diplomatic and executive engagements.',
      capacity: 12,
      acoustics: '96dB Soundproof',
      panorama: 'Skyline East View',
      depositPrice: 500,
      imageUrl: 'https://images.unsplash.com/photo-1570129476589-94f50b8aaeb4?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'zenith',
      title: 'The Zenith Rooftop',
      description: 'Suspended 80 stories high under a dynamic tempered retractable glass shell. Features panoramic viewscopes to gaze at celestial stellar paths.',
      capacity: 20,
      acoustics: 'Acoustic Glass Dome',
      panorama: '360° Star Sky Deck',
      depositPrice: 800,
      imageUrl: 'https://images.unsplash.com/photo-1500522714194-8ea0824f4662?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'vault',
      title: 'The Imperial Vault',
      description: 'Repurposed underground bank sanctuary lined with authentic historical brass sheets, housing DineVerse\'s rare vintage reserves.',
      capacity: 8,
      acoustics: '104dB Soundproof',
      panorama: 'Aged Wine Casks',
      depositPrice: 600,
      imageUrl: 'https://images.unsplash.com/photo-1525238413002-c4538320e098?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'crimson',
      title: 'The Crimson Salon',
      description: 'Adorned in royal red silk damask draperies and mahogany furniture. Evokes classical 19th-century salon dining theater.',
      capacity: 6,
      acoustics: '92dB Soundproof',
      panorama: 'Fountain Grotto',
      depositPrice: 400,
      imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'glasshouse',
      title: 'The Gilded Glasshouse',
      description: 'Lush tropical botanical sanctuary surrounded by thin gold-mesh grids and glowing fireflies. Perfect for private family circles.',
      capacity: 10,
      acoustics: 'Raindrop Isolation',
      panorama: 'Cosmic Conservatory',
      depositPrice: 450,
      imageUrl: 'https://images.unsplash.com/photo-1631504866246-ab2151c8e89c?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'celestial',
      title: 'The Celestial Deck',
      description: 'Constructed directly adjacent to our chef kitchen. Features a heat-resistant viewing shield to inspect culinary fires.',
      capacity: 15,
      acoustics: 'Acoustic Dampening',
      panorama: 'Zenith Constellations',
      depositPrice: 750,
      imageUrl: 'https://images.unsplash.com/photo-1552566626-7ee31b080d1a?auto=format&fit=crop&q=80&w=800',
    }
  ];

  const [privateRooms, setPrivateRooms] = useState(fallbackRooms);
  const [roomsLoading, setRoomsLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setRoomsLoading(true);
      try {
        const res = await axios.get('/api/venues');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPrivateRooms(res.data);
        } else {
          setPrivateRooms(fallbackRooms);
        }
      } catch (err) {
        console.warn('Could not fetch venues, falling back to local set');
        setPrivateRooms(fallbackRooms);
      } finally {
        setRoomsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleOpenDrawer = (room) => {
    if (!isAuthenticated) {
      openAuthModal('/private-dining');
      return;
    }
    setSelectedRoom(room);
    reset({
      date: '',
      timeSlot: '',
      guestCount: Math.min(2, room.capacity),
      contactNumber: '',
      specialRequests: '',
    });
    setShowSuccess(false);
  };

  const handleCloseDrawer = () => {
    setSelectedRoom(null);
  };

  const onSubmit = async (data) => {
    try {
      // Step 1: Create private booking
      const response = await createPrivateBooking({
        roomTitle: selectedRoom.title,
        date: data.date,
        timeSlot: data.timeSlot,
        guestCount: Number(data.guestCount),
        contactNumber: data.contactNumber,
        specialRequests: data.specialRequests || 'None',
      });
      setShowSuccess(true);
      
      // Step 2: Initiate payment (this will redirect to Stripe)
      setTimeout(() => {
        initiateVenuePayment(response._id);
      }, 800);
    } catch (err) {
      console.error('Private Booking Error:', err);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      
      {/* Background glow structures */}
      <div className="glow-orb-amber top-[15%] left-[20%]"></div>
      <div className="glow-orb-orange bottom-[20%] right-[10%]"></div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 page-entrance">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold font-bold hover-glow-text">
          <Star size={12} className="text-luxury-orange animate-spin" />
          <span>Architectural Sanctuary Suites</span>
        </div>
        <h1 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest leading-none hover-glow-text">
          Private Dining Hires
        </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/40 font-light hover-glow-text alt">
          Bespoke high-end spatial enclosures featuring custom audio-proof parameters and panoramic lookouts
        </p>
      </div>

      {/* Rooms Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {roomsLoading ? (
          <div className="col-span-full text-center py-8 text-luxury-cream/60">Loading sanctuaries...</div>
        ) : (
          privateRooms.map((room) => (
            <PrivateRoomCard 
              key={room._id || room.id || room.title} 
              room={room} 
              onBook={handleOpenDrawer} 
            />
          ))
        )}
      </div>

      {/* Animated Slide-out Side Drawer Overlay */}
      <AnimatePresence>
        {selectedRoom && (
          <>
            {/* Backdrop Blur Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-luxury-black z-40 backdrop-blur-md"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-lg bg-luxury-dark border-l border-luxury-gold/20 shadow-2xl z-50 overflow-y-auto p-8 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div>
                  <span className="text-[10px] text-luxury-orange uppercase tracking-widest block font-bold mb-0.5">Sanctuary Hire Portal</span>
                  <h3 className="text-xl text-luxury-gold uppercase tracking-widest font-heading">{selectedRoom.title}</h3>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 text-luxury-cream/60 hover:text-luxury-orange transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {!showSuccess ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-grow flex flex-col">
                  
                  {/* Quick specs info banner */}
                  <div className="p-4 bg-luxury-black/50 border border-white/5 rounded-2xl flex items-center justify-between text-xs text-luxury-cream/80">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-luxury-cream/40 block">Room Capacity Limit</span>
                      <span className="font-semibold">{selectedRoom.capacity} guests max</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-luxury-cream/40 block">Sound Isolation Floor</span>
                      <span className="font-semibold">{selectedRoom.acoustics}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-luxury-cream/40 block">Panorama Lookout</span>
                      <span className="font-semibold text-luxury-gold">{selectedRoom.panorama}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-luxury-gold mb-1 font-medium">Select Hire Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 text-luxury-orange" size={16} />
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        {...register('date', { required: true })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-luxury-cream"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-luxury-gold mb-2 font-medium">Select Premium Hire Hour</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['17:00 – 19:30', '20:00 – 22:30', '23:00 – 01:30'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setValue('timeSlot', slot)}
                          className={`py-3 px-2 rounded-xl text-[10px] uppercase font-bold border transition-all duration-300 ${
                            selectedTimeSlot === slot
                              ? 'bg-gradient-to-r from-luxury-orange to-luxury-gold border-transparent text-luxury-black font-extrabold shadow-neon-glow'
                              : 'border-white/5 bg-luxury-black/60 text-luxury-cream/80 hover:border-luxury-gold/30'
                          }`}
                        >
                          {slot.split(' – ')[0]}
                        </button>
                      ))}
                    </div>
                    {errors.timeSlot && <span className="text-xs text-red-400 mt-1 block">Please choose a slot hour.</span>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-luxury-gold mb-1 font-medium">Attendee Guests Count</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={selectedRoom.capacity}
                      {...register('guestCount', { required: true, max: selectedRoom.capacity })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    <span className="text-[10px] text-luxury-cream/40 mt-1 block">Must not exceed the room limit of {selectedRoom.capacity} guests.</span>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-luxury-gold mb-1 font-medium">Secure VVIP Callback Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 text-luxury-orange" size={16} />
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2834"
                        {...register('contactNumber', { required: true })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-luxury-gold mb-1 font-medium">Venue Custom Directives</label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 text-luxury-orange" size={16} />
                      <textarea
                        rows={3}
                        placeholder="Detail any acoustic requirements, private catering preferences, or secure entrance alerts..."
                        {...register('specialRequests')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-300 text-xs rounded-xl text-center flex items-center gap-1.5 justify-center">
                      <ShieldAlert size={14} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="pt-6 mt-auto border-t border-white/5">
                    <GlassButton
                      type="submit"
                      variant="orange"
                      className="w-full py-3.5 uppercase font-bold"
                      loading={loading}
                    >
                      REQUEST SANCTUARY HIRE
                    </GlassButton>
                  </div>

                </form>
              ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-luxury-orange/20 border border-luxury-gold/50 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={36} className="text-luxury-orange" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg text-luxury-gold uppercase font-heading tracking-widest">Hire Request Initiated</h4>
                    <p className="text-xs text-luxury-cream/60 leading-relaxed max-w-xs">
                      Your VVIP private booking request for <span className="text-luxury-orange font-semibold">{selectedRoom.title}</span> has been dispatched. The Imperial Concierge is validating scheduling records and will contact you shortly.
                    </p>
                  </div>

                  <GlassButton onClick={handleCloseDrawer} variant="gold" className="px-6 py-2.5 text-xs">
                    CONCLUDE VENUE PORTAL
                  </GlassButton>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
export default PrivateDiningPage;
