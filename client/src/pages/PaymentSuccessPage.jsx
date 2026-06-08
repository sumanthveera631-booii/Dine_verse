import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export const PaymentSuccessPage = ({ bookingType = 'standard_table' }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPaymentSession, loading, error } = useBookingStore();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setVerificationStatus('error');
        return;
      }

      try {
        const result = await verifyPaymentSession(sessionId, bookingType);
        setVerificationStatus('success');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          if (bookingType === 'standard_table') {
            navigate('/reservations');
          } else if (bookingType === 'private_venue') {
            navigate('/private-dining');
          }
        }, 3000);
      } catch (err) {
        setVerificationStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId, bookingType, verifyPaymentSession, navigate]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-2xl mx-auto">
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {verificationStatus === 'verifying' && (
          <>
            <Loader size={48} className="text-luxury-gold animate-spin" />
            <h1 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest text-center">
              Verifying Payment
            </h1>
            <p className="text-center text-luxury-cream/60 max-w-md">
              Please wait while we confirm your payment and complete your booking...
            </p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <CheckCircle2 size={64} className="text-luxury-gold animate-bounce" />
            <h1 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest text-center">
              Payment Confirmed
            </h1>
            <p className="text-center text-luxury-cream/60 max-w-md">
              Your booking has been successfully confirmed. Redirecting you to your reservations...
            </p>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <AlertCircle size={64} className="text-luxury-orange" />
            <h1 className="text-3xl md:text-5xl text-luxury-orange uppercase tracking-widest text-center">
              Payment Verification Failed
            </h1>
            <p className="text-center text-luxury-cream/60 max-w-md">
              {error || 'We couldn\'t verify your payment. Please try again or contact support.'}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-luxury-gold/20 border border-luxury-gold/50 text-luxury-gold rounded-full hover:bg-luxury-gold/30 transition-all duration-300"
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
