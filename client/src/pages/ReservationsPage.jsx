import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import GlassButton from '../components/GlassButton';
import { Calendar, Clock, Users, Gift, Ticket, BadgeAlert, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ReservationsPage = () => {
  const navigate = useNavigate();
  const { createReservation, initiateReservationPayment, loading, error } = useBookingStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [ticketDetails, setTicketDetails] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      date: '',
      timeSlot: '',
      guestCount: 2,
      specialRequests: '',
    }
  });

  const selectedDate = watch('date');
  const selectedTimeSlot = watch('timeSlot');
  const selectedGuestCount = watch('guestCount');
  const specialRequestsVal = watch('specialRequests');

  const timeSlots = ['17:00', '18:30', '20:00', '21:30', '23:00'];
  const guestCapacities = [1, 2, 4, 6, 8, 12, 16];

  const handleNextStep = () => {
    if (step === 1 && (!selectedDate || !selectedTimeSlot)) {
      alert('Please select both a dining date and a premium time slot.');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    try {
      // Step 1: Create reservation
      const response = await createReservation({
        date: data.date,
        timeSlot: data.timeSlot,
        guestCount: Number(data.guestCount),
        specialRequests: data.specialRequests || 'None',
      });
      setTicketDetails(response);
      setStep(4); // Success step
      
      // Step 2: Initiate payment (this will redirect to Stripe)
      setTimeout(() => {
        initiateReservationPayment(response._id);
      }, 800);
    } catch (err) {
      console.error('Reservation Error:', err);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-6 max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* Decorative glows */}
      <div className="glow-orb-amber -top-20 -left-20"></div>
      <div className="glow-orb-orange -bottom-20 -right-20"></div>

      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <span className="text-xs uppercase tracking-widest text-luxury-orange font-bold text-glow-orange block">
          Secure Seating Slot
        </span>
<h1 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest leading-none hover-glow-text">
           Avant-Garde Booking
         </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/40 font-light">
          Securing a tablespace seals a luxury gastronomic engagement
        </p>
      </div>

      {/* Wizard Progress Indicators */}
      {step < 4 && (
        <div className="flex justify-between items-center max-w-md mx-auto mb-12 relative z-10">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className="flex items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-heading text-sm transition-all duration-300 ${
                    step >= num 
                      ? 'bg-gradient-to-r from-luxury-orange to-luxury-gold text-luxury-black font-extrabold shadow-neon-glow'
                      : 'border border-white/10 bg-luxury-black text-luxury-cream/40'
                  }`}
                >
                  {num}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                  step >= num ? 'text-luxury-gold' : 'text-luxury-cream/40'
                }`}>
                  {num === 1 ? 'Timeline' : num === 2 ? 'Details' : 'Confirm'}
                </span>
              </div>
              {num < 3 && <div className={`flex-grow h-[1px] mx-4 border-t transition-all duration-500 ${
                step > num ? 'border-luxury-gold' : 'border-white/5'
              }`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Main Reservation Wizard Container */}
      <div className="glass-panel-heavy rounded-3xl p-8 md:p-12 relative z-10 shadow-neon-glow overflow-hidden">
        
        {/* Ambient interior glowing orbs */}
        <div className="glow-orb-amber -top-40 -right-40 opacity-50"></div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            
            {/* Step 1: Calendar & Slot Scheduler */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
<h3 className="text-xl text-luxury-gold font-heading uppercase tracking-widest mb-4 flex items-center gap-2 hover-glow-text">
                     <Calendar size={18} className="text-luxury-orange" />
                     <span>Select Dining Date</span>
                   </h3>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    {...register('date', { required: true })}
                    className="w-full px-5 py-4 rounded-2xl glass-input text-sm text-luxury-cream focus:ring-1 focus:ring-luxury-orange"
                  />
                  {errors.date && <span className="text-xs text-red-400 mt-1 block">Please select a calendar date.</span>}
                </div>

                <div>
<h3 className="text-xl text-luxury-gold font-heading uppercase tracking-widest mb-4 flex items-center gap-2 hover-glow-text">
                     <Clock size={18} className="text-luxury-orange animate-spin" />
                     <span>Select Fine-Dining Hour</span>
                   </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setValue('timeSlot', slot)}
                        className={`py-3.5 rounded-2xl text-xs uppercase tracking-widest font-bold border transition-all duration-300 ${
                          selectedTimeSlot === slot
                            ? 'bg-gradient-to-r from-luxury-orange to-luxury-gold border-transparent text-luxury-black font-extrabold shadow-neon-glow'
                            : 'border-white/5 bg-luxury-black/70 text-luxury-cream/80 hover:border-luxury-gold/30 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {errors.timeSlot && <span className="text-xs text-red-400 mt-1 block">Please choose a dining slot.</span>}
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <GlassButton onClick={handleNextStep} variant="orange">
                    <span>Choose Circle Details</span>
                    <ArrowRight size={14} />
                  </GlassButton>
                </div>
              </motion.div>
            )}

            {/* Step 2: Circle Capacity & Custom Requests */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
<h3 className="text-xl text-luxury-gold font-heading uppercase tracking-widest mb-4 flex items-center gap-2 hover-glow-text">
                     <Users size={18} className="text-luxury-orange" />
                     <span>Table Size / Capacity</span>
                   </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
                    {guestCapacities.map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => setValue('guestCount', cap)}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all duration-300 ${
                          selectedGuestCount === cap
                            ? 'bg-gradient-to-r from-luxury-orange to-luxury-gold border-transparent text-luxury-black font-extrabold shadow-neon-glow'
                            : 'border-white/5 bg-luxury-black/70 text-luxury-cream/80 hover:border-luxury-gold/30 hover:text-white'
                        }`}
                      >
                        {cap} {cap === 1 ? 'Guest' : 'Guests'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
<h3 className="text-xl text-luxury-gold font-heading uppercase tracking-widest mb-4 flex items-center gap-2 hover-glow-text">
                     <Gift size={18} className="text-luxury-orange" />
                     <span>Concierge Requests Box</span>
                   </h3>
                  <textarea
                    rows={4}
                    placeholder="Provide bespoke details: raw food exclusions, allergies, or request champagne bottles chilled at tableside..."
                    {...register('specialRequests')}
                    className="w-full px-5 py-4 rounded-2xl glass-input text-xs text-luxury-cream font-light focus:ring-1 focus:ring-luxury-orange leading-relaxed"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <GlassButton onClick={handlePrevStep} variant="dark">
                    <span>Back</span>
                  </GlassButton>
                  <GlassButton onClick={handleNextStep} variant="orange">
                    <span>Seal Engagement Review</span>
                  </GlassButton>
                </div>
              </motion.div>
            )}

            {/* Step 3: Seal Confirmation Review */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
<h3 className="text-xl text-luxury-gold font-heading uppercase tracking-widest mb-6 text-center hover-glow-text">
                     Verify Luxury Reservation Summary
                   </h3>
                  
                  {/* Summary ticket */}
                  <div className="border border-luxury-gold/25 bg-luxury-black/60 rounded-3xl p-6 relative overflow-hidden max-w-md mx-auto">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-luxury-orange/10 to-transparent pointer-events-none"></div>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase tracking-wider text-luxury-cream/40">Patron Name</span>
                        <span className="text-xs font-semibold text-luxury-cream uppercase">{user?.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase tracking-wider text-luxury-cream/40">Reserved Date</span>
                        <span className="text-xs font-semibold text-luxury-gold">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase tracking-wider text-luxury-cream/40">Seated Hour</span>
                        <span className="text-xs font-semibold text-luxury-orange">{selectedTimeSlot}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase tracking-wider text-luxury-cream/40">Dining Circle</span>
                        <span className="text-xs font-semibold text-luxury-cream">{selectedGuestCount} Guests</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-luxury-cream/40 mb-1">Concierge Requests</span>
                        <span className="text-xs font-light text-luxury-cream/70 italic bg-luxury-black p-3 rounded-xl border border-white/5 leading-relaxed">
                          "{specialRequestsVal || 'No bespoke requests specified'}"
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-950/30 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-center gap-2 justify-center">
                    <BadgeAlert size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <GlassButton onClick={handlePrevStep} variant="dark">
                    <span>Modify Choices</span>
                  </GlassButton>
                  <GlassButton 
                    type="submit" 
                    variant="orange"
                    loading={loading}
                  >
                    <span>SEAL TICKET ENGAGEMENT</span>
                  </GlassButton>
                </div>
              </motion.div>
            )}

            {/* Step 4: Successful Ticket Card */}
            {step === 4 && ticketDetails && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-8"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-luxury-orange/20 text-luxury-gold border border-luxury-gold/50 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={36} className="text-luxury-orange" />
                  </div>
                </div>

                <div className="space-y-2">
<h3 className="text-2xl text-luxury-gold uppercase tracking-wider font-heading hover-glow-text">
             Reservation Sealed Successfully
           </h3>
                  <p className="text-xs text-luxury-cream/60 max-w-sm mx-auto leading-relaxed">
                    Your luxury seating slot has been registered. The Imperial Concierge desk has been notified via real-time Socket lines.
                  </p>
                </div>

                {/* Elegant Ticket card mockup */}
                <div className="border border-luxury-gold/30 bg-luxury-black/90 rounded-3xl max-w-md mx-auto p-8 relative overflow-hidden shadow-neon-glow text-left">
                  
                  {/* Decorative tickets borders cuts */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-luxury-brown border-r border-luxury-gold/30 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-luxury-brown border-l border-luxury-gold/30 -translate-y-1/2"></div>
                  
                  <div className="flex justify-between items-center border-b border-luxury-gold/20 pb-4 mb-6">
                    <span className="font-heading text-lg text-luxury-gold tracking-widest">DINEVERSE ENGAGEMENT</span>
                    <span className="text-[10px] bg-luxury-orange/10 border border-luxury-orange/40 text-luxury-amber px-2.5 py-0.5 rounded-full font-bold uppercase">
                      {ticketDetails.status || 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest block mb-0.5">Booking ID</span>
                        <span className="font-mono text-luxury-cream">{ticketDetails._id?.substring(0, 10).toUpperCase()}...</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest block mb-0.5">Dining Patron</span>
                        <span className="text-luxury-cream truncate block uppercase font-medium">{user?.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest block mb-0.5">Reserved Date</span>
                        <span className="text-luxury-gold font-semibold">{ticketDetails.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest block mb-0.5">Seating Hour</span>
                        <span className="text-luxury-orange font-semibold">{ticketDetails.timeSlot}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest block mb-0.5">Capacity Seatings</span>
                      <span className="text-luxury-cream font-medium">{ticketDetails.guestCount} Guests Premium Allocation</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-dashed border-luxury-gold/20 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-luxury-gold/60 font-semibold flex items-center gap-1 justify-center">
                      <Ticket size={10} className="animate-pulse" />
                      <span>PRESENT TICKET TO CONCIERGE UPON ARRIVAL</span>
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <GlassButton onClick={() => setStep(1)} variant="dark">
                    <span>Book Another Space</span>
                  </GlassButton>
                  <GlassButton onClick={() => navigate('/dashboard')} variant="gold">
                    <span>Manage My Bookings</span>
                  </GlassButton>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>
      </div>

    </div>
  );
};
export default ReservationsPage;
