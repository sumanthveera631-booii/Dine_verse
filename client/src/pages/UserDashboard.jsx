import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMenuStore } from '../store/menuStore';
import FoodCard from '../components/FoodCard';
import MocktailCard from '../components/MocktailCard';
import { Calendar, Clock, Ticket, Sparkles, Heart, Compass, ShieldAlert, Award } from 'lucide-react';

export const UserDashboard = () => {
  const { 
    user, 
    wishlist, 
    userReservations, 
    userVenueBookings, 
    fetchWishlist, 
    fetchUserReservations, 
    fetchUserVenueBookings,
    logout
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations', 'venues', 'wishlist'

  useEffect(() => {
    fetchWishlist();
    fetchUserReservations();
    fetchUserVenueBookings();
  }, [fetchWishlist, fetchUserReservations, fetchUserVenueBookings]);

  const tabsList = [
    { id: 'reservations', label: 'My Reservations', icon: Ticket },
    { id: 'venues', label: 'My Venue Bookings', icon: Calendar },
    { id: 'wishlist', label: 'My Wishlist Collection', icon: Heart }
  ];

  // Helper to color badge based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400';
      case 'Cancelled':
        return 'bg-red-950/40 border-red-500/40 text-red-400';
      default:
        return 'bg-amber-950/40 border-amber-500/40 text-luxury-amber';
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      
      {/* Ambient background glows */}
      <div className="glow-orb-amber -top-20 -left-10"></div>
      <div className="glow-orb-orange bottom-10 right-10"></div>

      {/* Profile Header */}
      <div className="glass-panel p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 shadow-glass-gold border-luxury-gold/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-luxury-orange to-luxury-gold flex items-center justify-center font-heading text-luxury-black font-extrabold text-3xl shadow-neon-glow">
            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl text-luxury-gold uppercase tracking-wider font-heading leading-tight hover-glow-text">{user?.name}</h1>
              <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold bg-luxury-orange/20 border border-luxury-orange/40 text-luxury-amber px-2.5 py-0.5 rounded-full">
                <Award size={10} className="animate-pulse" />
                <span>Cosmopolitan Member</span>
              </span>
            </div>
            <p className="text-xs text-luxury-cream/50 tracking-wider font-light mt-1">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          className="px-5 py-2.5 rounded-full border border-luxury-orange/20 bg-luxury-orange/5 text-xs text-luxury-orange font-bold uppercase tracking-widest hover:bg-luxury-orange/25 transition-all duration-300"
        >
          Sign Out of Sanctuary
        </button>
      </div>

      {/* Dynamic structural Tabs Navigation */}
      <div className="flex border-b border-white/5 mb-10 relative z-10 gap-8">
        {tabsList.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all duration-300 border-b-2 relative ${
                activeTab === tab.id
                  ? 'border-luxury-orange text-luxury-orange font-bold text-glow-orange'
                  : 'border-transparent text-luxury-cream/60 hover:text-luxury-gold'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard Sub-Views Layout Area */}
      <div className="relative z-10">

        {/* Tab 1: Standard Dinner Reservations */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            {userReservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userReservations.map((res) => (
                  <div
                    key={res._id}
                    className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luxury-gold/30 hover:shadow-glass-gold transition-all duration-300 bg-luxury-black/35 relative overflow-hidden"
                  >
                    {/* Glowing status top corner */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-luxury-gold/5 to-transparent pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                      <span className="font-heading text-sm text-luxury-gold tracking-widest uppercase">Table reservation</span>
                      <span className={`text-[9px] uppercase tracking-wider font-bold border px-2.5 py-0.5 rounded-full ${getStatusColor(res.status)}`}>
                        {res.status}
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs text-luxury-cream/80">
                      <div className="flex justify-between">
                        <span className="text-luxury-cream/40 uppercase tracking-wider text-[9px]">Reserved Date</span>
                        <span className="font-semibold text-luxury-cream">{res.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-luxury-cream/40 uppercase tracking-wider text-[9px]">Seating Hour</span>
                        <span className="font-semibold text-luxury-orange">{res.timeSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-luxury-cream/40 uppercase tracking-wider text-[9px]">Table Seats</span>
                        <span className="font-semibold text-luxury-gold">{res.guestCount} Guests</span>
                      </div>
                      <div className="flex flex-col pt-2 border-t border-white/5 mt-2">
                        <span className="text-luxury-cream/40 uppercase tracking-wider text-[9px] mb-1">Bespoke Directives</span>
                        <span className="font-light italic text-luxury-cream/60 bg-luxury-black p-2 rounded-xl text-[11px] leading-relaxed">
                          "{res.specialRequests || 'No bespoke requests specified'}"
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-white/5 bg-luxury-black/35 rounded-3xl space-y-4">
                <p className="text-sm uppercase tracking-widest text-luxury-cream/40 font-medium">Reservations queue is empty</p>
                <a 
                  href="/reservations" 
                  className="inline-block px-5 py-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 text-xs text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black font-semibold uppercase tracking-wider transition-all"
                >
                  Book Dinner Table
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: VVIP Private Venue Hires */}
        {activeTab === 'venues' && (
          <div className="space-y-6">
            {userVenueBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userVenueBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luxury-gold/30 hover:shadow-glass-gold transition-all duration-300 bg-luxury-black/35 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-luxury-orange/5 to-transparent pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                      <span className="font-heading text-sm text-luxury-gold tracking-widest uppercase truncate max-w-[170px]" title={booking.roomTitle}>
                        {booking.roomTitle}
                      </span>
                      <span className={`text-[9px] uppercase tracking-wider font-bold border px-2.5 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs text-luxury-cream/80">
                      <div className="flex justify-between">
                        <span className="text-luxury-cream/40 uppercase tracking-wider text-[9px]">Reserved Date</span>
                        <span className="font-semibold text-luxury-cream">{booking.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-luxury-cream/40 uppercase tracking-wider text-[9px]">Hire Time Slot</span>
                        <span className="font-semibold text-luxury-orange">{booking.timeSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-luxury-cream/40 uppercase tracking-wider text-[9px]">Attendee Guests</span>
                        <span className="font-semibold text-luxury-gold">{booking.guestCount} Attendees</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-luxury-cream/40 uppercase tracking-wider text-[9px]">Callback VVIP Phone</span>
                        <span className="font-mono text-luxury-cream">{booking.contactNumber}</span>
                      </div>
                      <div className="flex flex-col pt-2 border-t border-white/5 mt-2">
                        <span className="text-luxury-cream/40 uppercase tracking-wider text-[9px] mb-1">Directives</span>
                        <span className="font-light italic text-luxury-cream/60 bg-luxury-black p-2 rounded-xl text-[11px] leading-relaxed">
                          "{booking.specialRequests || 'None'}"
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-white/5 bg-luxury-black/35 rounded-3xl space-y-4">
                <p className="text-sm uppercase tracking-widest text-luxury-cream/40 font-medium">Private Room bookings empty</p>
                <a 
                  href="/private-dining" 
                  className="inline-block px-5 py-2 rounded-full border border-luxury-orange/30 bg-luxury-orange/5 text-xs text-luxury-amber hover:bg-luxury-orange hover:text-white font-semibold uppercase tracking-wider transition-all"
                >
                  Hire Private Room Venue
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Persistent Wishlist Grid */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {wishlist.map((item) => (
                  <div key={item._id} className="h-full">
                    {item.category === 'Mocktails' ? (
                      <MocktailCard item={item} />
                    ) : (
                      <FoodCard item={item} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-white/5 bg-luxury-black/35 rounded-3xl space-y-4">
                <p className="text-sm uppercase tracking-widest text-luxury-cream/40 font-medium">Wishlist Collection is empty</p>
                <p className="text-xs text-luxury-cream/30 max-w-xs mx-auto">Explore our menu engine and click floating hearts to persistent likes inside the platform ecosystem.</p>
                <a 
                  href="/menu" 
                  className="inline-block px-5 py-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 text-xs text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black font-semibold uppercase tracking-wider transition-all"
                >
                  Explore Gastronomy
                </a>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
export default UserDashboard;
