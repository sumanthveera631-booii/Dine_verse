// Tiered pricing based on restaurant type and booking tier
const PRICING_TIERS = {
  CASUAL_DINING: {
    name: 'Standard Table',
    amount: 20000, // ₹200 in paise (smallest unit in Indian rupees)
    description: 'Standard table reservation deposit'
  },
  PREMIUM_RESTAURANT: {
    name: 'Premium Table',
    amount: 100000, // ₹1000 in paise
    description: 'Premium table reservation deposit'
  },
  VIP_BOUTIQUE: {
    name: 'VIP Room',
    amount: 250000, // ₹2500 in paise
    description: 'VIP private room deposit'
  }
};

/**
 * Calculate booking fee based on tier type
 * @param {string} tierType - 'CASUAL_DINING', 'PREMIUM_RESTAURANT', or 'VIP_BOUTIQUE'
 * @returns {object} - {amount, name, description}
 */
const calculateBookingFee = (tierType = 'CASUAL_DINING') => {
  const tier = PRICING_TIERS[tierType] || PRICING_TIERS.CASUAL_DINING;
  return {
    amount: tier.amount,
    name: tier.name,
    description: tier.description,
    amountINR: tier.amount / 100 // For display purposes
  };
};

/**
 * Determine tier type from booking context
 * @param {object} bookingContext - {bookingType, roomType}
 * @returns {string} - Tier type string
 */
const getTierType = (bookingContext = {}) => {
  const { bookingType, roomType } = bookingContext;
  
  // For private venue bookings, default to VIP_BOUTIQUE
  if (bookingType === 'private' || roomType === 'private') {
    return 'VIP_BOUTIQUE';
  }
  
  // For standard reservations, use PREMIUM_RESTAURANT as default
  // Can be enhanced with more logic if needed
  return 'PREMIUM_RESTAURANT';
};

module.exports = {
  PRICING_TIERS,
  calculateBookingFee,
  getTierType
};
