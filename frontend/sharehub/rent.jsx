// Rent / Browse view
const { useEffect: uER, useRef: uRR } = React;

const BROWSE_MOBILE_HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTLRupTrm8EKSGg0BWkcu82fPB3_0qMhr_0-lJskhn_InDG9WpUP6_29rVPtbs93uusaj80_8-qOhw9te2WfKUGRsToedvDJ5uSlL6ghqxKXs8sG7udFu_hNmjxpLat0y5xpcnXkZ1I1PMyyvsFo3Ai5KHZDB1ZQS2ijQStcrxQF-4iVlq4Tj8POZ2xouC9ASx_kbfqWMNX4ov3Y2FwK_Hz6UWoxxMaMBQ6gdmZcqHtIpZARFD9dIOxkaEAaW747G-7Zg6_r6_Q3M';
const BROWSE_DESKTOP_IMAGES = {
  left: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH9riE9RkO_tjjU9VjO-52w77Pkwyg74zCbiZq3nzNy-v2ijipXNUWMmUFbxZc4LCCol20K284qZyhHVjcdRnb_TcwrlRueSUOvW_n190myMqeYv1MbPBgcKw_WbjPDr470s3DFu-49Nk_9UKORmB6ePRPCQJKg5niTp4w3LncWKp6WM3XlgDrZd5lCdXAH4B1dMeulob6AYoRHA_y9Ty3xn7X1vCm2WHINCVd46VIXr6wccfktglSxSPJdDiCQV4o2jlseDoCWsU',
  topRight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD19DoraLPEXLTaKignEVBAboFc0Qj3V9LT36ayc1F3_BXkS1vfFOA4ILfA3pKnRlJoXR_331unNKfuNyjCMtdBsPhLpULaK4q6iSA8ddpHaPwO9IYw-o3MpHjV3iB2msUHIcuCnCJFijC4x7bryErcJh0WLYbAbTX9SixDTM86ogc-uiaA5f68W91aYlzhbjKYVmti1R3IJmyS62FVFyhONm3NK590X6pQF6zWmV3gNMGDOQinzNJ4sAR0KBmS31N_ZfG9tMQxrmY',
  bottomRight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY01BtguhsjbSP1L8uLXqmXeSE7V4kfGtXMQFbVagzA7J6Rn4AVFybs3LrzbLcOJtgO_twPEFN6Tcw2ifu9MoJSenmABntSVAiq_WNkqKPbxrdCT1_8Fhgy2wXYGxzxeKQu02NbcFv-fNraXn5rkY--CbOrhtC-2UffoKbA5yQ_zyFZOjnp5I6rIr5fLvOEXRclJFtw6OPT9rhUkqzB_jtVqW0hDNnNomVupd9buej-fyBVYj1bbSHmyg9odCl31TVgnKX_M0_SAM',
};

const BROWSE_FEATURES = [
  {
    title: 'Verified Community',
    bodyMobile: 'Every member is identity-verified for a safe, secure borrowing experience.',
    bodyDesktop: 'Every member is identity-verified to ensure a safe and trustworthy rental experience.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Hyper-Local',
    bodyMobile: 'Find tools, camping gear, and more just a few blocks away from home.',
    bodyDesktop: 'Find tools, equipment, and gear just blocks away from where you live.',
    icon: 'MapPin',
  },
  {
    title: 'Earn from Your Gear',
    bodyMobile: 'Turn your unused items into passive income by sharing them with neighbors.',
    bodyDesktop: 'Turn your idle household items into a source of passive income today.',
    icon: 'Wallet',
  },
];

function RentView({
  go,
  user,
  gisReady,
  onSignOut,
}) {
  return (
    <div className="view-fade min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      <div className="md:hidden">
        <MobileBrowseShell go={go} user={user} />
      </div>
      <div className="hidden md:block">
        <DesktopBrowseShell go={go} user={user} gisReady={gisReady} onSignOut={onSignOut} />
      </div>
    </div>
  );
}

function BrowseAvatar({ user, size = 'w-8 h-8', textSize = 'text-xs' }) {
  return (
    <div className={`${size} overflow-hidden rounded-full bg-[#a26648] flex items-center justify-center text-white ${textSize} font-semibold`}>
      {user?.picture ? (
        <img src={user.picture} alt={user.name || 'Profile'} className="h-full w-full object-cover" />
      ) : (
        <span>{(user?.name || user?.email || 'S').slice(0, 1).toUpperCase()}</span>
      )}
    </div>
  );
}

function MobileBrowseShell({ go, user }) {
  return (
    <div className="min-h-screen bg-[#fcf9f8] pb-24" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <header className="fixed top-0 inset-x-0 z-40 h-16 border-b border-[#e8dfda] bg-[#fcf9f8]/85 px-6 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-full max-w-md items-center justify-between">
          <div className="flex items-center gap-3">
            <BrowseAvatar user={user} />
            <span className="text-[22px] font-extrabold tracking-tight text-[#1c1b1b]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>ShareHub</span>
          </div>
          <button type="button" className="rounded-full p-2 text-[#615b57] hover:bg-black/5" aria-label="Notifications">
            <Icon name="Bell" size={19} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 pt-24 pb-10">
        <section className="flex flex-col items-center py-4 text-center">
          <div className="mb-8 aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-[0_28px_60px_rgba(133,78,50,0.12)]">
            <img src={BROWSE_MOBILE_HERO_IMAGE} alt="Community sharing" className="h-full w-full object-cover" />
          </div>
          <div className="max-w-sm space-y-4">
            <h1 className="text-[22px] font-bold leading-tight text-[#1c1b1b]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              The smarter way to access high-quality gear.
            </h1>
            <p className="px-3 text-[17px] leading-[1.55] text-[#5f5e5b]">
              We're building a sustainable rental network where you can find exactly what you need, right in your neighborhood. From tools to tech, get ready to experience a better way to share.
            </p>
          </div>
        </section>

        <section className="space-y-5 py-10">
          {BROWSE_FEATURES.map(feature => (
            <BrowseFeatureCard key={feature.title} feature={feature} mobile />
          ))}
        </section>

        <section className="mb-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#49473f] p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#854e32]/20 to-transparent opacity-60" />
            <div className="relative z-10 space-y-4">
              <Icon name="Quote" size={34} className="text-[#e7e2d7]" />
              <p className="text-[20px] leading-[1.35] tracking-tight text-[#e7e2d7]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>
                Ownership is old news. Sharing is the future of sustainable living.
              </p>
              <div className="flex items-center gap-3 pt-3">
                <div className="h-px w-8 bg-[#e7e2d7]/30" />
                <span className="text-[12px] uppercase tracking-[0.18em] text-[#e7e2d7]/70">ShareHub Philosophy</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-[#e8dfda] bg-[#fcf9f8] px-4 py-3 shadow-[0_-4px_20px_rgba(168,107,77,0.04)] rounded-t-[1.25rem]">
        <div className="mx-auto flex max-w-md justify-around">
          <MobileNavItem icon="Home" label="Home" onClick={() => go('home')} />
          <MobileNavItem icon="Compass" label="Browse" active onClick={() => go('rent')} />
          <MobileNavItem icon="PlusCircle" label="List" onClick={() => go('list')} />
          <MobileNavItem icon="UserRound" label="Profile" onClick={() => go(user ? 'profile' : 'home')} />
        </div>
      </nav>
    </div>
  );
}

function DesktopBrowseShell({ go, user, gisReady, onSignOut }) {
  const googleBtnRef = uRR(null);

  uER(() => {
    const canRender = !user && gisReady && window.google && window.google.accounts && window.google.accounts.id;
    if (!canRender || !googleBtnRef.current) return;

    googleBtnRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'outline',
      size: 'medium',
      type: 'standard',
      shape: 'pill',
      text: 'signin_with',
    });
  }, [user, gisReady]);

  return (
    <div className="min-h-screen bg-[#fcf9f8]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <header className="fixed top-0 inset-x-0 z-40 border-b border-stone-200/50 bg-[#fdfcfb]/80 backdrop-blur-md shadow-[0_20px_40px_rgba(168,107,77,0.04)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          <button type="button" onClick={() => go('home')} className="text-[31px] font-bold tracking-tight text-stone-900">ShareHub</button>
          <nav className="flex items-center space-x-8 text-sm">
            <button type="button" onClick={() => go('home')} className="font-medium text-stone-600 transition-colors hover:text-[#a86b4d]">Home</button>
            <button type="button" onClick={() => go('rent')} className="border-b-2 border-[#a86b4d] pb-1 font-semibold text-[#a86b4d]">Browse</button>
            <button type="button" onClick={() => go('list')} className="font-medium text-stone-600 transition-colors hover:text-[#a86b4d]">List Your Item</button>
            {!!user && <button type="button" onClick={() => go('profile')} className="font-medium text-stone-600 transition-colors hover:text-[#a86b4d]">Profile Dashboard</button>}
            {!!user && <button type="button" onClick={onSignOut} className="font-medium text-stone-600 transition-colors hover:text-[#a86b4d]">Sign Out</button>}
          </nav>
          <div className="flex items-center gap-3">
            {!user && <div ref={googleBtnRef} />}
            <button
              type="button"
              onClick={() => go('list')}
              className="inline-flex items-center gap-2 rounded-full bg-[#854e32] px-6 py-2.5 text-white shadow-lg shadow-[#854e32]/10 transition-all hover:bg-[#a26648]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
            >
              List for Free
              <Icon name="ArrowRight" size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden pb-24 pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: 'radial-gradient(circle at top right, rgba(255, 182, 147, 0.15) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(133, 78, 50, 0.05) 0%, transparent 50%)' }} />

        <section className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ffdbcc] px-4 py-1.5 text-[#6c391f]">
                <Icon name="BadgeCheck" size={17} />
                <span className="text-[14px] font-semibold">Launching Soon in Your Neighborhood</span>
              </div>
              <h1 className="max-w-2xl text-[72px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#1c1b1b]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Browsing is coming soon.
              </h1>
              <p className="max-w-lg text-[18px] leading-[1.6] text-[#5f5e5b]">
                We're building the future of shared ownership. Our curated catalog of premium local rentals is just around the corner. Get ready to access high-quality gear, right in your neighborhood.
              </p>
            </div>

            <div className="relative grid h-[600px] grid-cols-2 gap-4">
              <div className="col-span-1 row-span-2 overflow-hidden rounded-[1.5rem] shadow-2xl shadow-[#854e32]/5" style={{ transform: 'rotate(-2deg)' }}>
                <img src={BROWSE_DESKTOP_IMAGES.left} alt="High-end headphones" className="h-full w-full object-cover" />
              </div>
              <div className="col-span-1 row-span-1 translate-y-8 overflow-hidden rounded-[1.5rem] shadow-2xl shadow-[#854e32]/5" style={{ transform: 'translateY(2rem) rotate(3deg)' }}>
                <img src={BROWSE_DESKTOP_IMAGES.topRight} alt="Minimalist wristwatch" className="h-full w-full object-cover" />
              </div>
              <div className="col-span-1 row-span-1 -translate-y-4 overflow-hidden rounded-[1.5rem] shadow-2xl shadow-[#854e32]/5" style={{ transform: 'translateY(-1rem) rotate(-1deg)' }}>
                <img src={BROWSE_DESKTOP_IMAGES.bottomRight} alt="Premium camping gear" className="h-full w-full object-cover" />
              </div>

              <div className="absolute -bottom-6 -left-6 max-w-xs rounded-[1rem] border border-stone-100 bg-white p-6 shadow-xl shadow-[#854e32]/10">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#854e32]/10 text-[#854e32]">
                    <Icon name="Leaf" size={16} />
                  </div>
                  <span className="font-semibold text-[#1c1b1b]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Sustainable Living</span>
                </div>
                <p className="text-[13px] leading-relaxed text-[#5f5e5b]">
                  Rent high-quality items instead of buying. Reduce waste and save money.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-32 max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {BROWSE_FEATURES.map(feature => (
              <BrowseFeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-100 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-8 text-sm tracking-wide md:grid-cols-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          <div className="flex flex-col gap-4">
            <div className="text-lg font-bold text-stone-800">ShareHub</div>
            <p className="max-w-sm text-stone-500">© 2024 ShareHub Rental Marketplace. Community-driven and verified.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
            <button type="button" className="text-stone-500 transition-colors hover:text-stone-900">Privacy Policy</button>
            <button type="button" className="text-stone-500 transition-colors hover:text-stone-900">Terms of Service</button>
            <button type="button" className="text-stone-500 transition-colors hover:text-stone-900">Verified Listings</button>
            <button type="button" className="text-stone-500 transition-colors hover:text-stone-900">Safety Guide</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BrowseFeatureCard({ feature, mobile = false }) {
  return (
    <div className={`${mobile ? 'rounded-[1.75rem] bg-[#f6f3f2] p-6' : 'rounded-[1.5rem] bg-white p-8 border border-stone-100 shadow-[0_20px_40px_rgba(168,107,77,0.04)]'} flex items-start gap-4`}>
      <div className={`${mobile ? 'rounded-[1rem] bg-[#ffdbcc] p-3' : 'rounded-[1rem] bg-[#854e32]/10 p-3'} flex items-center justify-center ${mobile ? 'text-[#854e32]' : 'text-[#854e32]'} shrink-0`}>
        <Icon name={feature.icon} size={20} />
      </div>
      <div>
        <h3 className={`${mobile ? 'mb-1 text-[17px]' : 'mb-3 text-[20px]'} text-[#1c1b1b]`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: mobile ? 500 : 700 }}>
          {feature.title}
        </h3>
        <p className={`${mobile ? 'text-[14px] leading-[1.6]' : 'text-[16px] leading-[1.6]'} text-[#5f5e5b]`}>
          {mobile ? feature.bodyMobile : feature.bodyDesktop}
        </p>
      </div>
    </div>
  );
}

function MobileNavItem({ icon, label, active = false, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center justify-center ${active ? 'rounded-xl bg-stone-100 px-3 py-1 text-[#a86b4d]' : 'px-2 py-1 text-stone-400'} transition-opacity active:opacity-80`}>
      <Icon name={icon} size={19} />
      <span className="mt-1 text-[11px] font-medium" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</span>
    </button>
  );
}

function ListingDetailView({ listing, go, onToggleWish, isWished }) {
  if (!listing) {
    return (
      <div className="view-fade min-h-screen pt-20 pb-24 flex items-center justify-center">
        <div className="text-center text-slate-soft">
          <Icon name="AlertCircle" size={40} className="mx-auto mb-4 opacity-40" />
          <p>Listing not found.</p>
          <Btn variant="outline" size="sm" onClick={() => go('rent')} className="mt-4">Back to Browse</Btn>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES_SH.find(c => c.id === listing.category) || CATEGORIES_SH[0];
  const photos = listing.photo_urls || [];

  const handoverLabel = listing.handover === 'pickup' ? 'Pickup only'
    : listing.handover === 'delivery' ? 'Delivery available'
    : listing.handover === 'both' ? 'Pickup or Delivery'
    : listing.handover || '—';

  const DetailRow = ({ icon, label, value }) => value ? (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-coral"><Icon name={icon} size={15} /></span>
      <div>
        <p className="text-xs text-slate-soft">{label}</p>
        <p className="text-sm font-medium text-indigo-deep">{value}</p>
      </div>
    </div>
  ) : null;

  return (
    <div className="view-fade min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button onClick={() => go('rent')} className="text-sm text-slate-soft hover:text-indigo-deep inline-flex items-center gap-1.5 mb-6">
          <Icon name="ArrowLeft" size={14} /> Back to Browse
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: photos + details */}
          <div className="lg:col-span-3 space-y-5">
            {/* Photo */}
            <div className={`${cat.gradient} rounded-2xl overflow-hidden relative`} style={{ aspectRatio: '4/3' }}>
              {photos.length > 0 ? (
                <img src={photos[0]} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl opacity-60">{cat.icon}</div>
              )}
              {/* Wishlist button */}
              <button
                onClick={() => onToggleWish && onToggleWish(listing.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition shadow">
                <Icon name="Heart" size={18}
                  className={isWished ? 'text-coral' : 'text-indigo-deep'}
                  strokeWidth={isWished ? 0 : 1.5}
                  fill={isWished ? '#B85C3C' : 'none'}
                />
              </button>
            </div>

            {/* Extra photos strip */}
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.slice(1).map((url, i) => (
                  <img key={i} src={url} alt={`Photo ${i + 2}`}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-slate-line" />
                ))}
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-2xl border border-slate-line/60 p-5">
                <h3 className="font-semibold text-indigo-deep mb-2 flex items-center gap-2">
                  <Icon name="FileText" size={15} className="text-coral" /> About this item
                </h3>
                <p className="text-sm text-slate-soft leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Rules */}
            {listing.rules && listing.rules.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-line/60 p-5">
                <h3 className="font-semibold text-indigo-deep mb-3 flex items-center gap-2">
                  <Icon name="ShieldCheck" size={15} className="text-coral" /> Rental rules
                </h3>
                <ul className="space-y-1.5">
                  {listing.rules.map((rule, i) => (
                    <li key={i} className="text-sm text-slate-soft flex items-start gap-2">
                      <Icon name="Check" size={13} className="text-coral mt-0.5 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: pricing + info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title card */}
            <div className="bg-white rounded-2xl border border-slate-line/60 p-5">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Chip className="!text-[11px] !py-0.5 !px-2.5">{cat.name}</Chip>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {listingConditionLabel(listing.condition)}
                </span>
                {listing.brand && (
                  <span className="text-[11px] text-slate-soft bg-cream px-2.5 py-0.5 rounded-full border border-slate-line">{listing.brand}</span>
                )}
              </div>
              <h1 className="text-xl font-bold text-indigo-deep leading-snug">{listing.title}</h1>
              {listing.subcategories && listing.subcategories.length > 0 && (
                <div className="mt-2 flex gap-1.5 flex-wrap">
                  {listing.subcategories.map(s => (
                    <span key={s} className="text-[10px] bg-cream text-slate-soft px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-slate-line/60 p-5">
              <h3 className="font-semibold text-indigo-deep mb-3 flex items-center gap-2">
                <Icon name="Tag" size={15} className="text-coral" /> Pricing
              </h3>
              <div className="space-y-2">
                {listing.daily_price > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-line/50 last:border-0">
                    <span className="text-sm text-slate-soft">Per day</span>
                    <span className="font-bold text-coral text-base">{fmtINR(listing.daily_price)}</span>
                  </div>
                )}
                {listing.weekly_price > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-line/50 last:border-0">
                    <span className="text-sm text-slate-soft">Per week</span>
                    <span className="font-bold text-indigo-deep text-base">{fmtINR(listing.weekly_price)}</span>
                  </div>
                )}
                {listing.monthly_price > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-soft">Per month</span>
                    <span className="font-bold text-indigo-deep text-base">{fmtINR(listing.monthly_price)}</span>
                  </div>
                )}
              </div>
              {listing.deposit_amount > 0 && (
                <div className="mt-3 flex items-center gap-2 bg-cream rounded-xl px-3 py-2">
                  <Icon name="Lock" size={13} className="text-slate-soft" />
                  <span className="text-xs text-slate-soft">Security deposit: <span className="font-semibold text-indigo-deep">{fmtINR(listing.deposit_amount)}</span></span>
                </div>
              )}
            </div>

            {/* Logistics */}
            <div className="bg-white rounded-2xl border border-slate-line/60 p-5">
              <h3 className="font-semibold text-indigo-deep mb-4 flex items-center gap-2">
                <Icon name="Info" size={15} className="text-coral" /> Details
              </h3>
              <div className="space-y-3">
                <DetailRow icon="MapPin" label="Location" value={[listing.locality, listing.city, listing.pin].filter(Boolean).join(', ')} />
                <DetailRow icon="UserRound" label="Hosted by" value={listing.owner_name || 'ShareHub host'} />
                <DetailRow icon="Truck" label="Handover" value={handoverLabel} />
                {listing.handover !== 'pickup' && listing.delivery_fee > 0 && (
                  <DetailRow icon="IndianRupee" label="Delivery fee" value={fmtINR(listing.delivery_fee)} />
                )}
                {listing.handover !== 'pickup' && listing.delivery_radius && (
                  <DetailRow icon="Navigation" label="Delivery radius" value={`${listing.delivery_radius} km`} />
                )}
                <DetailRow icon="Clock" label="Minimum duration" value={listing.min_duration ? `${listing.min_duration} day${listing.min_duration === 1 ? '' : 's'}` : null} />
                {listing.purchase_year && (
                  <DetailRow icon="Calendar" label="Purchase year" value={String(listing.purchase_year)} />
                )}
              </div>
            </div>

            {/* CTA */}
            <Btn size="lg" className="w-full">
              <Icon name="MessageCircle" size={16} /> Request to Rent
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RentView, ListingDetailView });
