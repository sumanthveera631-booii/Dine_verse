import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPaymentSession, loading, error } = useBookingStore();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [bookingDetails, setBookingDetails] = useState(null);
  const sessionId = searchParams.get('session_id');
  const bookingType = searchParams.get('type') || 'standard_table';

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setVerificationStatus('error');
        return;
      }

      try {
        const result = await verifyPaymentSession(sessionId, bookingType);
        setBookingDetails(result);
        setVerificationStatus('success');
        
        // Redirect after 4 seconds
        setTimeout(() => {
          navigate(bookingType === 'standard_table' ? '/reservations' : '/private-dining');
        }, 4000);
      } catch (err) {
        setVerificationStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId, bookingType, verifyPaymentSession, navigate]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-2xl mx-auto page-entrance">
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {verificationStatus === 'verifying' && (
          <>
            <Loader size={48} className="text-luxury-gold animate-spin" />
            <h1 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest text-center hover-glow-text">
              Verifying Payment
            </h1>
            <p className="text-center text-luxury-cream/60 max-w-md text-sm md:text-base">
              Please wait while we confirm your payment and finalize your luxurious dining experience...
            </p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <CheckCircle2 size={64} className="text-luxury-gold animate-bounce" />
            <div className="space-y-2 text-center">
              <h1 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest hover-glow-text">
                Payment Confirmed
              </h1>
              <p className="text-luxury-orange font-semibold">Your booking has been secured</p>
            </div>
            <div className="w-full bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg p-6 space-y-3">
              <p className="text-luxury-cream/80 text-sm">
                <span className="text-luxury-gold font-semibold">Booking Reference:</span> #{bookingDetails?._id?.slice(-8).toUpperCase()}
              </p>
              <p className="text-luxury-cream/80 text-sm">
                <span className="text-luxury-gold font-semibold">Date:</span> {bookingDetails?.date}
              </p>
              <p className="text-luxury-cream/80 text-sm">
                <span className="text-luxury-gold font-semibold">Time:</span> {bookingDetails?.timeSlot}
              </p>
              <p className="text-luxury-cream/80 text-sm">
                <span className="text-luxury-gold font-semibold">Status:</span> <span className="text-emerald-400">Confirmed</span>
              </p>
            </div>
            <p className="text-center text-luxury-cream/60 max-w-md text-sm">
              Redirecting to your reservations in a moment...
            </p>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <AlertCircle size={64} className="text-luxury-orange" />
            <h1 className="text-3xl md:text-5xl text-luxury-orange uppercase tracking-widest text-center hover-glow-text">
              Verification Failed
            </h1>
            <p className="text-center text-luxury-cream/60 max-w-md text-sm md:text-base">
              {error || 'We couldn\'t verify your payment. Please try again or contact our concierge team for assistance.'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-luxury-gold/20 border border-luxury-gold/50 text-luxury-gold rounded-full hover:bg-luxury-gold/30 transition-all duration-300 text-sm md:text-base"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-luxury-orange/20 border border-luxury-orange/50 text-luxury-orange rounded-full hover:bg-luxury-orange/30 transition-all duration-300 text-sm md:text-base"
              >
                Return Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;
