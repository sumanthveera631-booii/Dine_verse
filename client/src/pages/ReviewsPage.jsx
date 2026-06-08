import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import GlassButton from '../components/GlassButton';
import { Star, MessageSquare, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReviewsPage = () => {
  const { isAuthenticated, openAuthModal, user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Critique Form State
  const [comments, setComments] = useState('');
  const [ratingValue, setRatingValue] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reviews');
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      setFormError('Please write comments for your critique.');
      return;
    }
    setFormError(null);
    try {
      const response = await axios.post('/api/reviews', {
        comments,
        ratingValue: Number(ratingValue)
      });
      
      // Auto prepend newly added review to local state
      setReviews((prev) => [response.data, ...prev]);
      
      // Reset form
      setComments('');
      setRatingValue(5);
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Critique submittal failed');
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      
      {/* Glow ambient panels */}
      <div className="glow-orb-amber -top-20 right-10"></div>
      <div className="glow-orb-orange bottom-10 left-10"></div>

      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold font-bold">
          <MessageSquare size={14} className="text-luxury-orange animate-bounce" />
          <span>Authenticated Testimonials</span>
        </div>
<h1 className="text-3xl md:text-5xl text-luxury-gold uppercase tracking-widest leading-none hover-glow-text">
           Critiques Board
         </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/40 font-light">
          Validated appraisals from Michelin guides and high-society culinary cosmic cosmopolitans
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        
        {/* Left Hand: Critique Submission Suite (1 Column) */}
        <div className="lg:col-span-1">
          <div className="glass-panel-heavy p-8 rounded-3xl sticky top-28 shadow-neon-glow overflow-hidden">
            <div className="glow-orb-amber -top-20 -left-20 opacity-55"></div>
            
<h2 className="text-xl text-luxury-gold font-heading uppercase tracking-widest mb-4 border-b border-white/5 pb-2 hover-glow-text">
               Write Critique
             </h2>

            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-6 relative z-10">
                <p className="text-xs text-luxury-cream/50 leading-relaxed font-light">
                  Patron account: <span className="text-luxury-gold font-semibold uppercase">{user?.name}</span>. Provide your honest review.
                </p>

                {/* Stars Selector */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-luxury-gold mb-2 font-medium">Critique Appraisal</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setRatingValue(index)}
                        onMouseEnter={() => setHoverRating(index)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl transition-all duration-200 transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={`${
                            (hoverRating || ratingValue) >= index
                              ? 'text-luxury-gold fill-luxury-gold shadow-neon-glow'
                              : 'text-luxury-cream/25'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Critique Comments */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-luxury-gold mb-1 font-medium">Comments</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe your raw sensory experience: plates texture, acoustics dampening balance, or mixology smoke aromas..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs leading-relaxed focus:ring-1 focus:ring-luxury-orange"
                  />
                </div>

                {formError && (
                  <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-center gap-1.5 justify-center">
                    <ShieldAlert size={14} />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 bg-luxury-orange/20 border border-luxury-gold/50 text-luxury-amber text-xs rounded-xl flex items-center gap-1.5 justify-center animate-bounce">
                    <CheckCircle2 size={14} className="text-luxury-orange" />
                    <span>Critique published to ecosystem!</span>
                  </div>
                )}

                <GlassButton
                  type="submit"
                  variant="orange"
                  className="w-full py-3"
                >
                  PUBLISH CRITIQUE
                </GlassButton>

              </form>
            ) : (
              <div className="text-center py-10 relative z-10 space-y-6">
                <p className="text-xs text-luxury-cream/60 leading-relaxed">
                  Only authenticated patrons within the DineVerse dining circle can submit appraisals.
                </p>
                <GlassButton
                  onClick={() => openAuthModal('/reviews')}
                  variant="gold"
                  className="w-full py-3"
                >
                  SIGN IN TO CRITIQUE
                </GlassButton>
              </div>
            )}
          </div>
        </div>

        {/* Right Hand: Masonry Review Wall (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-2 border-luxury-orange border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs uppercase tracking-widest text-luxury-cream/40 font-semibold">Gathering critiques...</span>
            </div>
          ) : reviews.length > 0 ? (
            // A beautiful masonry column-count block
            <div className="columns-1 md:columns-2 gap-6 space-y-6 [column-fill:_balance]">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="break-inside-avoid glass-panel p-6 rounded-2xl border border-white/5 hover:border-luxury-gold/30 hover:shadow-glass-gold transition-all duration-300 flex flex-col bg-luxury-black/40 mb-6"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      {/* Generates user badge */}
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-luxury-orange/20 to-luxury-gold/25 border border-luxury-gold/30 flex items-center justify-center font-heading text-[10px] text-luxury-gold">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-luxury-cream uppercase tracking-wide truncate max-w-[120px] hover-glow-text">{review.name}</h4>
                        <span className="text-[8px] uppercase text-luxury-cream/40 tracking-wider font-light">
                          {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={`${
                            i < review.ratingValue
                              ? 'text-luxury-gold fill-luxury-gold'
                              : 'text-luxury-cream/15'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-luxury-cream/75 leading-relaxed font-light italic flex-grow">
                    "{review.comments}"
                  </p>

                  <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] text-luxury-orange uppercase tracking-widest font-bold">
                    <span>Verified Dinner guest</span>
                    <Sparkles size={8} className="animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-white/5 bg-luxury-black/35 rounded-3xl">
              <p className="text-xs uppercase tracking-widest text-luxury-cream/40 font-semibold mb-2">Review wall empty</p>
              <p className="text-xs text-luxury-cream/30">Cross the velvet rope and write the first critique.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default ReviewsPage;
