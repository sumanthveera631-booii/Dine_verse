import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Page imports
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import ReservationsPage from './pages/ReservationsPage';
import PrivateDiningPage from './pages/PrivateDiningPage';
import ReviewsPage from './pages/ReviewsPage';
import OurStoryPage from './pages/OurStoryPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookingSuccess from './pages/BookingSuccess';
import BookingCancel from './pages/BookingCancel';

// Unified standard layout with horizontal navbar and operational footer
const StandardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-luxury-black text-luxury-cream">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <Routes>
        
        {/* Standard Client-Side routes with Horizontal Navbar */}
        <Route 
          path="/" 
          element={
            <StandardLayout>
              <LandingPage />
            </StandardLayout>
          } 
        />
        
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute>
              <StandardLayout>
                <MenuPage />
              </StandardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reservations" 
          element={
            <ProtectedRoute>
              <StandardLayout>
                <ReservationsPage />
              </StandardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/private-dining" 
          element={
            <ProtectedRoute>
              <StandardLayout>
                <PrivateDiningPage />
              </StandardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reviews" 
          element={
            <ProtectedRoute>
              <StandardLayout>
                <ReviewsPage />
              </StandardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/our-story" 
          element={
            <ProtectedRoute>
              <StandardLayout>
                <OurStoryPage />
              </StandardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StandardLayout>
                <UserDashboard />
              </StandardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/booking/success" 
          element={
            <ProtectedRoute>
              <StandardLayout>
                <BookingSuccess />
              </StandardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/booking/cancel" 
          element={
            <ProtectedRoute>
              <StandardLayout>
                <BookingCancel />
              </StandardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Executive Admin Panel Command Center - completely replaces horizontal layout with Left Sidebar */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback 404 Route */}
        <Route 
          path="*" 
          element={
            <StandardLayout>
              <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <span className="font-heading text-6xl text-luxury-orange text-glow-orange mb-4">404</span>
                <h2 className="text-xl uppercase tracking-widest text-luxury-gold mb-2 font-semibold hover-glow-text">Sanctuary Entrance Sealed</h2>
                <p className="text-xs text-luxury-cream/50 max-w-xs mx-auto leading-relaxed">
                  The coordinate you entered is currently out of luxury boundaries. Verify details or return home.
                </p>
                <a 
                  href="/" 
                  className="mt-6 px-5 py-2.5 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 text-xs text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black font-semibold uppercase tracking-wider transition-all"
                >
                  Return to Chateau
                </a>
              </div>
            </StandardLayout>
          } 
        />

      </Routes>
    </Router>
  );
};

export default App;
