// Shared data + helpers for ShareHub
const CATEGORIES_SH = [
  {
    id: 'healthcare', name: 'Healthcare', icon: '🏥',
    examples: ['Wheelchairs', 'Hospital Beds', 'Nebulizers'],
    count: '240+',
    gradient: 'cat-gradient-health',
    accent: '#3B82F6',
    priceRange: [200, 900],
    suggestedRate: 400,
  },
  {
    id: 'furniture', name: 'Furniture', icon: '🛋️',
    examples: ['Sofas', 'Study Desks', 'Bookshelves'],
    count: '380+',
    gradient: 'cat-gradient-furniture',
    accent: '#B8864A',
    priceRange: [150, 700],
    suggestedRate: 300,
  },
  {
    id: 'games', name: 'Console Games', icon: '🎮',
    examples: ['PS5', 'Xbox', 'Nintendo Switch'],
    count: '520+',
    gradient: 'cat-gradient-games',
    accent: '#8B5CF6',
    priceRange: [200, 800],
    suggestedRate: 450,
  },
  {
    id: 'travel', name: 'Travel Gear', icon: '✈️',
    examples: ['Suitcases', 'GoPro', 'DSLR'],
    count: '610+',
    gradient: 'cat-gradient-travel',
    accent: '#14B8A6',
    priceRange: [150, 1200],
    suggestedRate: 500,
  },
  {
    id: 'adventure', name: 'Adventure', icon: '🏔️',
    examples: ['Trekking Kits', 'Ski Gear', 'Tents'],
    count: '290+',
    gradient: 'cat-gradient-adventure',
    accent: '#16A34A',
    priceRange: [250, 1500],
    suggestedRate: 550,
  },
];

const LISTINGS_SH = [
  { id: 1, cat: 'travel', name: 'GoPro Hero 12 Black', condition: 'Like New', city: 'Bangalore', locality: 'Indiranagar', price: 450, rating: 4.9, reviews: 127 },
  { id: 2, cat: 'games', name: 'PS5 Slim 1TB + 2 Controllers', condition: 'Good', city: 'Mumbai', locality: 'Bandra West', price: 550, rating: 4.8, reviews: 94 },
  { id: 3, cat: 'healthcare', name: 'Folding Wheelchair — Lightweight', condition: 'Like New', city: 'Delhi', locality: 'Vasant Vihar', price: 380, rating: 5.0, reviews: 42 },
  { id: 4, cat: 'adventure', name: '3-Person Alpine Tent', condition: 'Good', city: 'Manali', locality: 'Old Manali', price: 320, rating: 4.7, reviews: 68 },
  { id: 5, cat: 'furniture', name: 'Ergonomic Study Desk', condition: 'Like New', city: 'Pune', locality: 'Koregaon Park', price: 180, rating: 4.6, reviews: 31 },
  { id: 6, cat: 'travel', name: 'Canon EOS R6 Mirrorless', condition: 'Like New', city: 'Bangalore', locality: 'HSR Layout', price: 1200, rating: 4.9, reviews: 89 },
  { id: 7, cat: 'adventure', name: 'Trekking Kit — 55L Pack + Poles', condition: 'Good', city: 'Dehradun', locality: 'Rajpur Road', price: 280, rating: 4.8, reviews: 54 },
  { id: 8, cat: 'games', name: 'Nintendo Switch OLED + 3 Titles', condition: 'Good', city: 'Hyderabad', locality: 'Gachibowli', price: 420, rating: 4.7, reviews: 76 },
  { id: 9, cat: 'healthcare', name: 'Electric Hospital Bed', condition: 'Fair', city: 'Chennai', locality: 'Anna Nagar', price: 650, rating: 4.5, reviews: 23 },
  { id: 10, cat: 'furniture', name: 'Queen Size Foldable Sofa', condition: 'Good', city: 'Gurugram', locality: 'DLF Phase 3', price: 220, rating: 4.4, reviews: 19 },
];

const TESTIMONIALS = [
  { name: 'Priya M.', city: 'Bangalore', rating: 5, quote: 'Rented a GoPro for my Coorg trip — saved ₹18,000 vs buying!' },
  { name: 'Rohan K.', city: 'Mumbai', rating: 5, quote: 'Earning ₹14k/month listing my old PS5 and camera. Zero hassle.' },
  { name: 'Anita S.', city: 'Delhi', rating: 5, quote: 'Found a wheelchair for my mom within 2 hours. Lifesaver.' },
  { name: 'Vikram T.', city: 'Pune', rating: 4, quote: 'Rented ski gear for Gulmarg. Came verified, clean, on time.' },
  { name: 'Neha R.', city: 'Hyderabad', rating: 5, quote: 'The earnings calculator was spot-on. Making ₹22k/mo now.' },
];

const RENTER_STEPS = [
  { t: 'Search & Filter', d: 'Browse by category, location, and date. Filter by rating and price.' },
  { t: 'Book & Pay Securely', d: 'Escrow-protected payment. Your money is released only after pickup.' },
  { t: 'Receive & Return', d: 'Meet the lister or opt for doorstep delivery. Return when done.' },
];
const LISTER_STEPS = [
  { t: 'List in 5 Min', d: 'Add photos, price, and availability. Our guided flow handles the rest.' },
  { t: 'Get Booking Requests', d: 'Verified renters reach out. Accept requests that work for you.' },
  { t: 'Earn & Repeat', d: 'Get paid every booking. Most listers earn ₹8k–₹25k monthly.' },
];

const STATS = [
  { n: 12000, suffix: '+', label: 'Items Listed' },
  { n: 8400, suffix: '+', label: 'Happy Renters' },
  { n: 2.1, suffix: ' Cr+', prefix: '₹', label: 'Earned by Listers', decimal: true },
];

const CONDITIONS_SH = [
  { id: 'new',  label: 'Like New', desc: 'Barely used, no visible wear' },
  { id: 'good', label: 'Good',     desc: 'Light wear, fully functional' },
  { id: 'fair', label: 'Fair',     desc: 'Visible wear, works as expected' },
];

const RULE_CHIPS_SH = [
  'No smoking near item', 'ID verification required', 'Handle with care',
  'Outdoor use only', 'Adult supervision required', 'Return in original packaging',
  'No pets around item', 'Keep indoor & dry',
];

const SUB_MAP = {
  healthcare: ['Wheelchair', 'Hospital Bed', 'Oxygen Concentrator', 'Walker / Crutches', 'Nebulizer', 'BP Monitor', 'Other'],
  furniture: ['Sofa', 'Bed', 'Study Desk', 'Dining Table', 'Wardrobe', 'Chair', 'Bookshelf', 'Other'],
  games: ['Console — Current Gen', 'Console — Last Gen', 'Controller', 'Game Title', 'VR Headset', 'Handheld', 'Other'],
  travel: ['Suitcase — Large', 'Suitcase — Cabin', 'Action Camera', 'DSLR / Mirrorless', 'Tripod', 'Drone', 'Travel Adapter Kit', 'Other'],
  adventure: ['Tent', 'Sleeping Bag', 'Trekking Poles', 'Ski Set', 'Snowboard', 'Climbing Gear', 'Backpack 50L+', 'Other'],
};

function createEmptyListingState() {
  return {
    category: null,
    subs: [],
    name: '',
    brand: '',
    condition: 'good',
    year: '',
    priceBasis: 'daily',
    price: { daily: 250, weekly: 1500, monthly: 5000 },
    depositAmount: 0,
    blocked: [],
    minDuration: 1,
    city: '',
    locality: '',
    pin: '',
    handover: 'pickup',
    radius: 5,
    deliveryFee: 0,
    photos: [],
    rules: [],
    notes: '',
  };
}

function listingConditionLabel(condition) {
  return CONDITIONS_SH.find(c => c.id === condition)?.label || condition || 'Good';
}

function listingToFormState(listing) {
  const state = createEmptyListingState();
  return {
    ...state,
    category: listing.category || null,
    subs: Array.isArray(listing.subcategories) ? listing.subcategories : [],
    name: listing.title || '',
    brand: listing.brand || '',
    condition: listing.condition || 'good',
    year: listing.purchase_year ? String(listing.purchase_year) : '',
    price: {
      daily: Number(listing.daily_price) || 0,
      weekly: Number(listing.weekly_price) || 0,
      monthly: Number(listing.monthly_price) || 0,
    },
    depositAmount: Number(listing.deposit_amount) || 0,
    blocked: Array.isArray(listing.blocked_dates) ? listing.blocked_dates : [],
    minDuration: Number(listing.min_duration) || 1,
    city: listing.city || '',
    locality: listing.locality || '',
    pin: listing.pin || '',
    handover: listing.handover || 'pickup',
    radius: Number(listing.delivery_radius) || 5,
    deliveryFee: Number(listing.delivery_fee) || 0,
    photos: (listing.photo_urls || []).map((url, index) => ({
      id: `listing-${listing.id}-photo-${index}`,
      url,
      name: `Photo ${index + 1}`,
    })),
    rules: Array.isArray(listing.rules) ? listing.rules : [],
    notes: listing.description || '',
  };
}

function listingStateToPayload(state) {
  return {
    title: state.name.trim(),
    description: state.notes.trim() || null,
    category: state.category,
    subcategories: state.subs,
    brand: state.brand.trim() || null,
    condition: state.condition,
    purchase_year: state.year ? Number(state.year) : null,
    daily_price: Number(state.price.daily) || 0,
    weekly_price: Number(state.price.weekly) || null,
    monthly_price: Number(state.price.monthly) || null,
    deposit_amount: Number(state.depositAmount) || null,
    min_duration: Number(state.minDuration) || 1,
    city: state.city.trim(),
    locality: state.locality.trim() || null,
    pin: state.pin.trim() || null,
    handover: state.handover,
    delivery_radius: state.handover === 'pickup' ? null : Number(state.radius) || null,
    delivery_fee: state.handover === 'pickup' ? null : Number(state.deliveryFee) || null,
    photo_urls: state.photos.map(photo => photo.url),
    rules: state.rules,
    blocked_dates: state.blocked,
  };
}

const insight = (monthly) => {
  if (monthly < 2000) return 'Great side income — covers your Netflix & Swiggy!';
  if (monthly < 8000) return "That's a solid side hustle 🚀";
  if (monthly < 20000) return 'Passive income level unlocked 💰';
  return "You're running a rental business now 🏆";
};

const fmtINR = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

Object.assign(window, {
  CATEGORIES_SH, LISTINGS_SH, TESTIMONIALS, RENTER_STEPS, LISTER_STEPS,
  STATS, CONDITIONS_SH, RULE_CHIPS_SH, SUB_MAP,
  createEmptyListingState, listingConditionLabel, listingStateToPayload, listingToFormState,
  insight, fmtINR,
});
