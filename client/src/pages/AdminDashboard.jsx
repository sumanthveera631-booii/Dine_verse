import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMenuStore } from '../store/menuStore';
import { useBookingStore } from '../store/bookingStore';
import GlassButton from '../components/GlassButton';
import axios from 'axios';
import io from 'socket.io-client';
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  DollarSign,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  Check,
  X,
  Plus,
  Trash2,
  Edit3,
  Bell,
  CheckSquare,
  AlertTriangle,
  Receipt
} from 'lucide-react';

export const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const { menuItems, fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuStore();
  const {
    reservations,
    privateBookings,
    fetchAllReservations,
    fetchAllPrivateBookings,
    updateReservationStatus,
    updatePrivateBookingStatus
  } = useBookingStore();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'reservations', 'menu', 'revenue', 'reviews'
  const [reviewsList, setReviewsList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [venues, setVenues] = useState([]);
  const [venueEditing, setVenueEditing] = useState(null);
  const [venueTitle, setVenueTitle] = useState('');
  const [venueDescription, setVenueDescription] = useState('');
  const [venueCapacity, setVenueCapacity] = useState('');
  const [venueAcoustics, setVenueAcoustics] = useState('');
  const [venuePanorama, setVenuePanorama] = useState('');
  const [venueDeposit, setVenueDeposit] = useState('');
  const [venueImageUrl, setVenueImageUrl] = useState('');

  // Menu CRUD form states
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Main Dishes');
  const [imageUrl, setImageUrl] = useState('');

  // Socket Connection for Real-Time Alerts
  useEffect(() => {
    // Establish connection to same-origin socket proxy
    const socket = io();

    socket.on('connect', () => {
      console.log('📡 Admin Socket connected');
    });

    socket.on('newReservation', (data) => {
      console.log('📡 Real-time table booking received:', data);
      const newNotification = {
        id: Date.now(),
        type: 'Table Reservation',
        message: `New standard booking placed by ${data.user?.name || 'Patron'} for ${data.guestCount} guests on ${data.date}`,
        details: data
      };
      setNotifications((prev) => [newNotification, ...prev]);
      fetchAllReservations(); // Refresh standard bookings list
    });

    socket.on('newPrivateBooking', (data) => {
      console.log('📡 Real-time private venue booking received:', data);
      const newNotification = {
        id: Date.now(),
        type: 'Sanctuary Hire',
        message: `VVIP Private Suite Hire request for [${data.roomTitle}] on ${data.date}`,
        details: data
      };
      setNotifications((prev) => [newNotification, ...prev]);
      fetchAllPrivateBookings(); // Refresh private bookings list
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchAllReservations, fetchAllPrivateBookings]);

  // Initial Fetch Data
  useEffect(() => {
    fetchMenuItems();
    fetchAllReservations();
    fetchAllPrivateBookings();
    fetchReviewsForModeration();
    fetchVenues();
  }, []);

  const fetchReviewsForModeration = async () => {
    try {
      const response = await axios.get('/api/reviews/all');
      setReviewsList(response.data);
    } catch (err) {
      console.error('Error fetching all reviews:', err);
    }
  };

  const handleReviewAction = async (id, status) => {
    try {
      await axios.patch(`/api/reviews/${id}/status`, { status });
      fetchReviewsForModeration();
    } catch (err) {
      console.error('Error updating review status:', err);
    }
  };

  // Menu Operations
  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    if (!title || !description || !price) {
      alert('Please fill out all required fields.');
      return;
    }
    
    try {
      const itemData = { title, description, price: Number(price), category, imageUrl };
      
      if (editingItem) {
        await updateMenuItem(editingItem._id, itemData);
      } else {
        await addMenuItem(itemData);
      }
      
      // Clean up form
      setEditingItem(null);
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('Main Dishes');
      setImageUrl('');
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
  };

  const handleDeleteClick = async (id) => {
    if (confirm('Are you sure you wish to delete this luxury item?')) {
      try {
        await deleteMenuItem(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Venues CRUD
  const fetchVenues = async () => {
    try {
      const res = await axios.get('/api/venues');
      setVenues(res.data || []);
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  const handleSaveVenue = async (e) => {
    e.preventDefault();
    if (!venueTitle || !venueDescription || !venueCapacity) {
      alert('Please fill title, description and capacity');
      return;
    }
    try {
      const payload = {
        title: venueTitle,
        description: venueDescription,
        capacity: Number(venueCapacity),
        acoustics: venueAcoustics,
        panorama: venuePanorama,
        depositPrice: Number(venueDeposit) || 0,
        imageUrl: venueImageUrl,
      };

      if (venueEditing) {
        await axios.put(`/api/venues/${venueEditing._id}`, payload);
      } else {
        await axios.post('/api/venues', payload);
      }

      // Refresh and clear
      await fetchVenues();
      setVenueEditing(null);
      setVenueTitle('');
      setVenueDescription('');
      setVenueCapacity('');
      setVenueAcoustics('');
      setVenuePanorama('');
      setVenueDeposit('');
      setVenueImageUrl('');
    } catch (err) {
      console.error('Error saving venue:', err);
      alert(err.response?.data?.message || err.message || 'Venue save failed');
    }
  };

  const handleEditVenue = (v) => {
    setVenueEditing(v);
    setVenueTitle(v.title || '');
    setVenueDescription(v.description || '');
    setVenueCapacity(v.capacity || '');
    setVenueAcoustics(v.acoustics || '');
    setVenuePanorama(v.panorama || '');
    setVenueDeposit(v.depositPrice || '');
    setVenueImageUrl(v.imageUrl || '');
  };

  const handleDeleteVenue = async (id) => {
    if (!confirm('This will permanently remove the venue. Continue?')) return;
    try {
      await axios.delete(`/api/venues/${id}`);
      await fetchVenues();
    } catch (err) {
      console.error('Error deleting venue:', err);
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // Clear a notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  // Render Left Vertical Sidebar items
  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays },
    { id: 'menu', label: 'Menu Editing', icon: UtensilsCrossed },
    { id: 'venues', label: 'Venues', icon: Sparkles },
    { id: 'revenue', label: 'Revenue & Bills', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-luxury-black flex relative overflow-hidden">
      
      {/* Background orbs */}
      <div className="glow-orb-amber -top-20 -left-20 opacity-50"></div>
      <div className="glow-orb-orange -bottom-20 -right-20 opacity-55"></div>

      {/* Real-time Notification Banners Overlay */}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-3 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-5 rounded-2xl glass-panel-heavy border-luxury-orange bg-luxury-black/90 shadow-neon-glow flex items-start gap-3.5 pointer-events-auto animate-[slideIn_0.3s_ease-out]"
          >
            <div className="p-2 rounded-lg bg-luxury-orange/20 text-luxury-amber">
              <Bell className="animate-swing" size={16} />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-heading text-luxury-gold uppercase tracking-wider text-[10px]">{n.type} Alert</span>
                <button
                  onClick={() => removeNotification(n.id)}
                  className="text-luxury-cream/40 hover:text-luxury-orange"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-luxury-cream/80 font-light leading-relaxed mb-2">{n.message}</p>
              <span className="text-[8px] uppercase tracking-wider text-luxury-orange font-bold">Real-time socket push</span>
            </div>
          </div>
        ))}
      </div>

      {/* Structural Left Vertical Sidebar Admin Dashboard */}
      <aside className="w-80 border-r border-luxury-gold/15 bg-luxury-black/90 backdrop-blur-xl flex flex-col justify-between p-6 z-30 shrink-0">
        <div className="space-y-12">
          {/* Logo / Branding */}
          <div className="flex items-center gap-2 border-b border-luxury-gold/15 pb-6">
            <span className="font-heading text-2xl text-luxury-gold tracking-widest text-glow-gold">
              DINEVERSE
            </span>
            <span className="text-[8px] uppercase tracking-widest bg-luxury-orange/20 border border-luxury-orange/40 text-luxury-amber px-2 py-0.5 rounded font-extrabold">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-3">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`group relative w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-xs uppercase tracking-widest font-semibold transition-all duration-300 text-left ${
                    isActive
                      ? 'text-luxury-black font-extrabold bg-gradient-to-r from-luxury-orange to-luxury-gold shadow-neon-glow scale-105'
                      : 'text-luxury-cream/70 border border-transparent hover:border-luxury-gold/20 hover:bg-white/5 hover:text-luxury-gold'
                  }`}
                >
                  {/* Highlight Glow Overlay active style */}
                  <Icon size={16} className={isActive ? 'text-luxury-black' : 'text-luxury-gold group-hover:scale-110 transition-transform'} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin info */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-luxury-orange to-luxury-gold flex items-center justify-center font-heading text-luxury-black font-extrabold">
              A
            </div>
            <div>
              <span className="text-xs font-semibold text-luxury-cream uppercase tracking-wider block">Imperial Admin</span>
              <span className="text-[10px] text-luxury-cream/40 block">admin@dineverse.com</span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="w-full py-3 rounded-xl border border-white/10 hover:border-luxury-orange/40 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-luxury-cream hover:text-luxury-orange transition-all duration-300"
          >
            Leave Sanctuary
          </button>
        </div>
      </aside>

      {/* Main Right content area */}
      <main className="flex-1 overflow-y-auto p-12 relative z-10">
        
        {/* VIEW 1: Dashboard Metrics */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            
            {/* Header info */}
            <div>
              <span className="text-xs uppercase tracking-widest text-luxury-orange font-bold text-glow-orange block">Executive Overview</span>
              <h2 className="text-2xl md:text-4xl text-luxury-gold uppercase tracking-widest font-heading hover-glow-text">Sanctuary Command Center</h2>
            </div>

            {/* Metrics stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="p-6 glass-panel rounded-2xl border border-white/5 bg-luxury-black/45">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest font-semibold">Total Revenue</span>
                  <DollarSign className="text-luxury-gold" size={18} />
                </div>
                <h4 className="font-heading text-3xl text-luxury-gold text-glow-gold tracking-wide hover-glow-text">$14,850</h4>
                <div className="flex items-center gap-1 text-[9px] text-emerald-400 mt-2">
                  <TrendingUp size={10} />
                  <span>+18.4% this week</span>
                </div>
              </div>

              <div className="p-6 glass-panel rounded-2xl border border-white/5 bg-luxury-black/45">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest font-semibold">Standard Booking count</span>
                  <CalendarDays className="text-luxury-orange" size={18} />
                </div>
                <h4 className="font-heading text-3xl text-luxury-cream tracking-wide hover-glow-text">{reservations.length}</h4>
                <span className="text-[9px] text-luxury-cream/40 block mt-2">Table seating slots booked</span>
              </div>

              <div className="p-6 glass-panel rounded-2xl border border-white/5 bg-luxury-black/45">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest font-semibold">Private Venue Hire requests</span>
                  <Sparkles className="text-luxury-gold" size={18} />
                </div>
                <h4 className="font-heading text-3xl text-luxury-gold text-glow-gold tracking-wide hover-glow-text">{privateBookings.length}</h4>
                <span className="text-[9px] text-luxury-cream/40 block mt-2">VVIP Sanctuary Hire records</span>
              </div>

              <div className="p-6 glass-panel rounded-2xl border border-white/5 bg-luxury-black/45">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest font-semibold">Active occupancy</span>
                  <Users className="text-luxury-amber" size={18} />
                </div>
                <h4 className="font-heading text-3xl text-luxury-cream tracking-wide hover-glow-text">32 Seats</h4>
                <span className="text-[9px] text-luxury-cream/40 block mt-2">Current dinner patrons onsite</span>
              </div>

            </div>

            {/* Occupancy Progress Metric Bars */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-luxury-black/35 space-y-6">
              <h3 className="text-lg text-luxury-gold uppercase tracking-widest font-heading mb-4 hover-glow-text">Spatial Seat Capacities</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-luxury-cream/80 mb-1">
                    <span className="font-medium uppercase tracking-wider">Main Dining Chateau Lounge</span>
                    <span className="font-semibold text-luxury-gold">78% Full (39/50 Seats)</span>
                  </div>
                  <div className="w-full bg-luxury-black/80 rounded-full h-3 border border-white/5 p-[1px]">
                    <div className="bg-gradient-to-r from-luxury-orange to-luxury-gold h-full rounded-full shadow-neon-glow" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-luxury-cream/80 mb-1">
                    <span className="font-medium uppercase tracking-wider">The Obsidian Lounge (VVIP)</span>
                    <span className="font-semibold text-luxury-orange">50% Full (1/2 Suites)</span>
                  </div>
                  <div className="w-full bg-luxury-black/80 rounded-full h-3 border border-white/5 p-[1px]">
                    <div className="bg-gradient-to-r from-luxury-orange to-luxury-gold h-full rounded-full shadow-neon-glow" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-luxury-cream/80 mb-1">
                    <span className="font-medium uppercase tracking-wider">The Zenith Sky Deck Dome</span>
                    <span className="font-semibold text-luxury-gold">90% Full (9/10 Tables)</span>
                  </div>
                  <div className="w-full bg-luxury-black/80 rounded-full h-3 border border-white/5 p-[1px]">
                    <div className="bg-gradient-to-r from-luxury-orange to-luxury-gold h-full rounded-full shadow-neon-glow" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: Reservations queue moderation tables */}
        {activeTab === 'reservations' && (
          <div className="space-y-12 animate-fadeIn">
            <div>
              <span className="text-xs uppercase tracking-widest text-luxury-orange font-bold text-glow-orange block">Moderation Center</span>
              <h2 className="text-2xl md:text-4xl text-luxury-gold uppercase tracking-widest font-heading hover-glow-text">Bookings queues</h2>
            </div>

            {/* Sub-section 1: Standard Table reservations queue */}
            <div className="space-y-4">
<h3 className="text-lg text-luxury-gold uppercase tracking-widest font-heading border-b border-white/5 pb-2 hover-glow-text">
                 Standard seated reservations
               </h3>
              
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 bg-luxury-black/25">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-luxury-black/80 border-b border-white/5 uppercase text-luxury-gold tracking-widest text-[9px]">
                      <th className="p-4">Patron Name</th>
                      <th className="p-4">Reserved Date</th>
                      <th className="p-4">Slot hour</th>
                      <th className="p-4 text-center">Seating size</th>
                      <th className="p-4 max-w-[200px] truncate">Bespoke requests</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reservations.map((res) => (
                      <tr key={res._id} className="hover:bg-white/5 transition-colors text-luxury-cream">
                        <td className="p-4 font-semibold uppercase">{res.user?.name || 'Julian'}</td>
                        <td className="p-4 text-luxury-gold">{res.date}</td>
                        <td className="p-4 text-luxury-orange">{res.timeSlot}</td>
                        <td className="p-4 text-center font-bold">{res.guestCount}</td>
                        <td className="p-4 max-w-[200px] truncate italic text-luxury-cream/60">"{res.specialRequests}"</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 border text-[9px] uppercase tracking-wider font-semibold rounded-full ${
                            res.status === 'Confirmed' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' : 
                            res.status === 'Cancelled' ? 'border-red-500/40 text-red-400 bg-red-950/20' : 
                            'border-amber-500/40 text-luxury-amber bg-amber-950/20'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => updateReservationStatus(res._id, 'Confirmed')}
                            className="p-1 text-emerald-400 hover:bg-emerald-950/40 rounded border border-emerald-500/20 transition-all"
                            title="Approve table"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => updateReservationStatus(res._id, 'Cancelled')}
                            className="p-1 text-red-400 hover:bg-red-950/40 rounded border border-red-500/20 transition-all"
                            title="Terminate table"
                          >
                            <X size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reservations.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-luxury-cream/40 uppercase tracking-widest text-[10px]">
                          No standard dinner bookings active
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-section 2: VVIP Private room venue bookings */}
            <div className="space-y-4 pt-4">
<h3 className="text-lg text-luxury-orange uppercase tracking-widest font-heading border-b border-white/5 pb-2 hover-glow-text">
                 Private Venue Hire requests
               </h3>

              <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 bg-luxury-black/25">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-luxury-black/80 border-b border-white/5 uppercase text-luxury-gold tracking-widest text-[9px]">
                      <th className="p-4">Suite</th>
                      <th className="p-4">Patron Name</th>
                      <th className="p-4">Hire Date</th>
                      <th className="p-4">Slot Session</th>
                      <th className="p-4">Attendees</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {privateBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-white/5 transition-colors text-luxury-cream">
                        <td className="p-4 font-heading text-luxury-gold uppercase tracking-wider">{b.roomTitle}</td>
                        <td className="p-4 font-semibold uppercase">{b.user?.name || 'Julian'}</td>
                        <td className="p-4">{b.date}</td>
                        <td className="p-4 text-luxury-orange font-medium">{b.timeSlot}</td>
                        <td className="p-4 text-center">{b.guestCount}</td>
                        <td className="p-4 font-mono text-luxury-cream/60">{b.contactNumber}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 border text-[9px] uppercase tracking-wider font-semibold rounded-full ${
                            b.status === 'Confirmed' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' : 
                            b.status === 'Cancelled' ? 'border-red-500/40 text-red-400 bg-red-950/20' : 
                            'border-amber-500/40 text-luxury-amber bg-amber-950/20'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => updatePrivateBookingStatus(b._id, 'Confirmed')}
                            className="p-1 text-emerald-400 hover:bg-emerald-950/40 rounded border border-emerald-500/20 transition-all"
                            title="Confirm Venue"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => updatePrivateBookingStatus(b._id, 'Cancelled')}
                            className="p-1 text-red-400 hover:bg-red-950/40 rounded border border-red-500/20 transition-all"
                            title="Cancel Venue"
                          >
                            <X size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {privateBookings.length === 0 && (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-luxury-cream/40 uppercase tracking-widest text-[10px]">
                          No private suite hire logs active
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: Interactive Menu CRUD panel */}
        {activeTab === 'menu' && (
          <div className="space-y-12 animate-fadeIn">
            <div>
<span className="text-xs uppercase tracking-widest text-luxury-orange font-bold text-glow-orange block">Culinary Administration</span>
               <h2 className="text-2xl md:text-4xl text-luxury-gold uppercase tracking-widest font-heading hover-glow-text">Gastronomy CRUD engine</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              
              {/* CRUD Input Form panel */}
              <div className="lg:col-span-1 glass-panel-heavy p-6 rounded-2xl border border-luxury-gold/20 shadow-neon-glow">
<h3 className="text-lg text-luxury-gold font-heading uppercase tracking-widest mb-6 border-b border-white/5 pb-2 flex items-center gap-2 hover-glow-text">
                   <Plus size={16} className="text-luxury-orange" />
                   <span>{editingItem ? 'Edit Culinary' : 'Add Culinary Plate'}</span>
                 </h3>

                <form onSubmit={handleSaveMenuItem} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Dish Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Volcanic Lobster Flambe"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Sensory description</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Provide raw sensory description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Cost ($)</label>
                      <input
                        type="number"
                        required
                        placeholder="125"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs cursor-pointer bg-luxury-black/90"
                      >
                        <option value="Main Dishes">Main Dishes</option>
                        <option value="Chef Specials">Chef Specials</option>
                        <option value="Mocktails">Mocktails</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave blank for Cloudinary fallback"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                    />
                    <span className="text-[9px] text-luxury-cream/40 block mt-1">Ready for Cloudinary buffer files. Defaults to curated photography.</span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    {editingItem && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setTitle('');
                          setDescription('');
                          setPrice('');
                          setImageUrl('');
                        }}
                        className="flex-1 py-2.5 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-widest text-luxury-cream font-bold hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    <GlassButton
                      type="submit"
                      variant="orange"
                      className="flex-grow py-2.5 uppercase font-bold text-xs"
                    >
                      {editingItem ? 'UPDATE OFFERING' : 'ADD OFFERING'}
                    </GlassButton>
                  </div>
                </form>
              </div>

              {/* Culinary grid table with edit buttons (2 Columns) */}
              <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border border-white/5 bg-luxury-black/20">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-luxury-black/80 border-b border-white/5 uppercase text-luxury-gold tracking-widest text-[9px]">
                      <th className="p-4">Image</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-center">Cost</th>
                      <th className="p-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {menuItems.map((item) => (
                      <tr key={item._id} className="hover:bg-white/5 transition-colors text-luxury-cream">
                        <td className="p-4">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover border border-white/10"
                          />
                        </td>
                        <td className="p-4 font-semibold uppercase">{item.title}</td>
                        <td className="p-4 text-luxury-gold text-[10px] font-bold uppercase">{item.category}</td>
                        <td className="p-4 text-center font-bold text-luxury-orange">${item.price}</td>
                        <td className="p-4 text-right flex justify-end gap-2 mt-1">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1 text-luxury-gold hover:bg-white/5 rounded border border-luxury-gold/20 transition-all"
                            title="Edit specs"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item._id)}
                            className="p-1 text-red-400 hover:bg-red-950/40 rounded border border-red-500/20 transition-all"
                            title="Delete offering"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {menuItems.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-luxury-cream/40 uppercase tracking-widest text-[10px]">
                          Gastronomy items empty
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: Venues CRUD panel */}
        {activeTab === 'venues' && (
          <div className="space-y-12 animate-fadeIn">
            <div>
<span className="text-xs uppercase tracking-widest text-luxury-orange font-bold text-glow-orange block">Venue Management</span>
               <h2 className="text-2xl md:text-4xl text-luxury-gold uppercase tracking-widest font-heading hover-glow-text">Private Venue CRUD</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-1 glass-panel-heavy p-6 rounded-2xl border border-luxury-gold/20 shadow-neon-glow">
<h3 className="text-lg text-luxury-gold font-heading uppercase tracking-widest mb-6 border-b border-white/5 pb-2 flex items-center gap-2 hover-glow-text">
                   <Plus size={16} className="text-luxury-orange" />
                   <span>{venueEditing ? 'Edit Venue' : 'Add Venue'}</span>
                 </h3>

                <form onSubmit={handleSaveVenue} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Venue Title</label>
                    <input type="text" required value={venueTitle} onChange={(e)=>setVenueTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Description</label>
                    <textarea rows={3} required value={venueDescription} onChange={(e)=>setVenueDescription(e.target.value)} className="w-full px-3 py-2.5 rounded-xl glass-input text-xs leading-relaxed" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Capacity</label>
                      <input type="number" required value={venueCapacity} onChange={(e)=>setVenueCapacity(e.target.value)} className="w-full px-3 py-2.5 rounded-xl glass-input text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Deposit ($)</label>
                      <input type="number" value={venueDeposit} onChange={(e)=>setVenueDeposit(e.target.value)} className="w-full px-3 py-2.5 rounded-xl glass-input text-xs" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Acoustics</label>
                    <input type="text" value={venueAcoustics} onChange={(e)=>setVenueAcoustics(e.target.value)} className="w-full px-3 py-2.5 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Panorama</label>
                    <input type="text" value={venuePanorama} onChange={(e)=>setVenuePanorama(e.target.value)} className="w-full px-3 py-2.5 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-medium mb-1">Image URL (optional)</label>
                    <input type="text" value={venueImageUrl} onChange={(e)=>setVenueImageUrl(e.target.value)} className="w-full px-3 py-2.5 rounded-xl glass-input text-xs" />
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    {venueEditing && (
                      <button type="button" onClick={()=>{setVenueEditing(null); setVenueTitle(''); setVenueDescription(''); setVenueCapacity(''); setVenueAcoustics(''); setVenuePanorama(''); setVenueDeposit(''); setVenueImageUrl('');}} className="flex-1 py-2.5 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-widest text-luxury-cream font-bold hover:bg-white/10 transition-all">Cancel</button>
                    )}
                    <GlassButton type="submit" variant="orange" className="flex-grow py-2.5 uppercase font-bold text-xs">{venueEditing ? 'UPDATE VENUE' : 'ADD VENUE'}</GlassButton>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border border-white/5 bg-luxury-black/20">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-luxury-black/80 border-b border-white/5 uppercase text-luxury-gold tracking-widest text-[9px]">
                      <th className="p-4">Image</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Capacity</th>
                      <th className="p-4">Deposit</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {venues.map((v) => (
                      <tr key={v._id} className="hover:bg-white/5 transition-colors text-luxury-cream">
                        <td className="p-4"><img src={v.imageUrl} alt={v.title} className="w-12 h-12 object-cover rounded-lg" /></td>
                        <td className="p-4 font-semibold uppercase">{v.title}</td>
                        <td className="p-4">{v.capacity}</td>
                        <td className="p-4 font-bold text-luxury-gold">${v.depositPrice}</td>
                        <td className="p-4 text-right flex justify-end gap-2 mt-1">
                          <button onClick={()=>handleEditVenue(v)} className="p-1 text-luxury-gold hover:bg-white/5 rounded border border-luxury-gold/20 transition-all" title="Edit venue"><Edit3 size={14} /></button>
                          <button onClick={()=>handleDeleteVenue(v._id)} className="p-1 text-red-400 hover:bg-red-950/40 rounded border border-red-500/20 transition-all" title="Delete venue"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                    {venues.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-luxury-cream/40 uppercase tracking-widest text-[10px]">No venues registered</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Revenue & Bills invoice records */}
        {activeTab === 'revenue' && (
          <div className="space-y-12 animate-fadeIn">
            <div>
              <span className="text-xs uppercase tracking-widest text-luxury-orange font-bold text-glow-orange block">Financial Ledger</span>
              <h2 className="text-2xl md:text-4xl text-luxury-gold uppercase tracking-widest font-heading hover-glow-text">Invoice distributions</h2>
            </div>

            {/* Historical transaction list */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-luxury-black/35 space-y-6">
<h3 className="text-lg text-luxury-gold uppercase tracking-widest font-heading border-b border-white/5 pb-2 flex items-center gap-2 hover-glow-text">
                 <Receipt size={16} className="text-luxury-orange" />
                 <span>Historical Transactions Ledger</span>
               </h3>

              <div className="space-y-4">
                {[
                  { id: 'INV-40192', name: 'Julian Sterling', type: 'Table Dinner Check', cost: 385, date: '29 May 2026', method: 'Amex Centurion' },
                  { id: 'INV-40193', name: 'Dr. Alistair Vance', type: 'Obsidian Suite Deposit', cost: 500, date: '28 May 2026', method: 'Crypto Transfer' },
                  { id: 'INV-40194', name: 'Lady Genevieve Sterling', type: 'Chef Specials Tasting', cost: 680, date: '27 May 2026', method: 'Visa Infinite' },
                  { id: 'INV-40195', name: 'Henri de Valois', type: 'Private Rooftop Reserve', cost: 1250, date: '26 May 2026', method: 'Amex Centurion' }
                ].map((inv) => (
                  <div
                    key={inv.id}
                    className="p-5 rounded-2xl border border-white/5 bg-luxury-black/60 hover:border-luxury-gold/30 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-luxury-gold uppercase tracking-wider">{inv.id}</span>
                        <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-luxury-cream/60">
                          {inv.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-luxury-cream/40 uppercase block font-semibold">
                        Patron: <span className="text-luxury-cream font-medium">{inv.name}</span> &bull; {inv.date}
                      </span>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-start w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 mt-3 sm:mt-0">
                      <span className="font-heading text-base text-luxury-orange tracking-wider text-glow-orange">${inv.cost}</span>
                      <span className="text-[9px] text-luxury-cream/40 uppercase tracking-widest font-semibold mt-0.5">{inv.method}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: Reviews Moderation grid */}
        {activeTab === 'reviews' && (
          <div className="space-y-12 animate-fadeIn">
            <div>
              <span className="text-xs uppercase tracking-widest text-luxury-orange font-bold text-glow-orange block">Customer Testimonials</span>
              <h2 className="text-2xl md:text-4xl text-luxury-gold uppercase tracking-widest font-heading hover-glow-text">Reviews Moderation Board</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsList.map((review) => (
                <div
                  key={review._id}
                  className="p-6 glass-panel rounded-2xl border border-white/5 bg-luxury-black/45 hover:border-luxury-gold/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div>
                        <h4 className="text-xs font-semibold text-luxury-cream uppercase tracking-wide hover-glow-text">{review.name}</h4>
                        <span className="text-[8px] uppercase text-luxury-cream/40 block mt-0.5">Rating star value: {review.ratingValue} / 5</span>
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider font-bold border px-2.5 py-0.5 rounded-full ${
                        review.status === 'Approved' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' : 
                        review.status === 'Flagged' ? 'border-red-500/40 text-red-400 bg-red-950/20' : 
                        'border-amber-500/40 text-luxury-amber bg-amber-950/20'
                      }`}>
                        {review.status}
                      </span>
                    </div>

                    <p className="text-xs text-luxury-cream/75 leading-relaxed font-light italic">
                      "{review.comments}"
                    </p>
                  </div>

                  <div className="flex gap-2 pt-6 mt-6 border-t border-white/5">
                    <button
                      onClick={() => handleReviewAction(review._id, 'Approved')}
                      className="flex-1 py-1.5 rounded-lg border border-emerald-500/20 hover:border-emerald-500 text-[10px] uppercase font-bold text-emerald-400 hover:bg-emerald-950/20 transition-all duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewAction(review._id, 'Flagged')}
                      className="flex-1 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500 text-[10px] uppercase font-bold text-red-400 hover:bg-red-950/20 transition-all duration-200"
                    >
                      Flag/Hide
                    </button>
                  </div>
                </div>
              ))}
              {reviewsList.length === 0 && (
                <div className="col-span-full py-16 text-center text-luxury-cream/40 uppercase tracking-widest text-[10px]">
                  No reviews submitted for moderation
                </div>
              )}
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
export default AdminDashboard;
