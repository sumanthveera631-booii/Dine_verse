import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';

export const BookingCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cancelPaymentSession, loading } = useBookingStore();

  const sessionId = searchParams.get('session_id');
  const bookingType = searchParams.get('type') || 'standard_table';

  React.useEffect(() => {
    const doCancel = async () => {
      if (sessionId) {
        try {
          await cancelPaymentSession(sessionId, bookingType);
        } catch (err) {
          console.warn('Failed to cancel booking on server:', err.message);
        }
      }
    };
    doCancel();
  }, [sessionId, bookingType, cancelPaymentSession]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-2xl mx-auto page-entrance">
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        <AlertCircle size={64} className="text-luxury-orange animate-pulse" />
        
        <div className="space-y-2 text-center">
          <h1 className="text-3xl md:text-5xl text-luxury-orange uppercase tracking-widest hover-glow-text">
            Payment Cancelled
          </h1>
          <p className="text-luxury-amber font-semibold">Your booking was not confirmed</p>
        </div>

        <div className="w-full bg-luxury-orange/10 border border-luxury-orange/30 rounded-lg p-6">
          <p className="text-luxury-cream/80 text-center text-sm md:text-base">
            Your payment was cancelled before completion. Your booking reservation has not been processed. 
            <br />
            <span className="text-luxury-orange font-semibold">You can try again anytime without additional charges.</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-luxury-gold/20 border border-luxury-gold/50 text-luxury-gold rounded-full hover:bg-luxury-gold/30 transition-all duration-300 text-sm md:text-base"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-luxury-amber/20 border border-luxury-amber/50 text-luxury-amber rounded-full hover:bg-luxury-amber/30 transition-all duration-300 text-sm md:text-base"
          >
            <Home size={18} />
            Return Home
          </button>
        </div>

        <div className="pt-8 border-t border-luxury-cream/20 w-full max-w-md">
          <p className="text-center text-luxury-cream/50 text-xs md:text-sm">
            Need help? Contact our concierge team at <span className="text-luxury-gold">+91-XXXX-XXXX-XX</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCancel;
