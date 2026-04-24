// Rent / Browse view
const { useState: uSR, useEffect: uER } = React;

function RentView({ go, listings = [], loading = false, error = '', wishlist, onToggleWish, initialFilter = 'all' }) {
  const [filter, setFilter] = uSR(initialFilter || 'all');
  const [query, setQuery] = uSR('');

  uER(() => {
    setFilter(initialFilter || 'all');
  }, [initialFilter]);

  const filtered = listings.filter(l => {
    if (filter !== 'all' && l.category !== filter) return false;
    if (!query) return true;

    const needle = query.toLowerCase();
    return [l.title, l.city, l.locality, l.category, ...(l.subcategories || [])]
      .filter(Boolean)
      .some(value => value.toLowerCase().includes(needle));
  });

  const toggleWish = onToggleWish || (() => {});

  return (
    <div className="view-fade min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => go('home')} className="text-sm text-slate-soft hover:text-indigo-deep inline-flex items-center gap-1.5 mb-4">
          <Icon name="ArrowLeft" size={14} /> Back to Home
        </button>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-indigo-deep tracking-tight">Browse Rentals</h1>
            <p className="text-slate-soft mt-2">{filtered.length} items near you</p>
          </div>
          <Chip tone="coralSoft"><Icon name="MapPin" size={13} /> Bengaluru, India</Chip>
        </div>

        <div className="bg-white rounded-2xl border border-slate-line/60 p-3 sm:p-4 shadow-sm mb-6 sticky top-20 z-20 backdrop-blur bg-white/90">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex items-center gap-2 flex-1 bg-cream rounded-full px-4 py-2.5">
              <Icon name="Search" size={16} className="text-slate-soft" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search items near you…"
                className="flex-1 bg-transparent outline-none text-sm text-indigo-deep placeholder:text-slate-soft"
              />
            </div>
            <Chip tone="dark" className="!py-2.5 !px-4 cursor-pointer">
              <Icon name="Navigation" size={13} /> Near Me
            </Chip>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <Pill active={filter === 'all'} onClick={() => setFilter('all')}>All</Pill>
            {CATEGORIES_SH.map(c => (
              <Pill key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
                <span className="mr-1">{c.icon}</span>{c.name}
              </Pill>
            ))}
          </div>
        </div>

        {loading && (
          <div className="py-16 text-center text-slate-soft">Loading listings…</div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((listing, i) => {
              const cat = CATEGORIES_SH.find(c => c.id === listing.category) || CATEGORIES_SH[0];
              const cover = listing.photo_urls && listing.photo_urls[0];
              return (
                <div key={listing.id}
                  className="bg-white rounded-2xl border border-slate-line/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-coral/30 transition-all hover:-translate-y-1"
                  style={{ animation: `fadeUp 400ms ${i * 50}ms cubic-bezier(.2,.9,.2,1) both` }}>
                  <div className={`${cat.gradient} h-44 flex items-center justify-center relative`}>
                    {cover ? (
                      <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-6xl opacity-70">{cat.icon}</div>
                    )}
                    <button onClick={() => toggleWish(listing.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition">
                      <Icon name="Heart" size={16}
                        className={wishlist.has(listing.id) ? 'text-coral' : 'text-indigo-deep'}
                        strokeWidth={wishlist.has(listing.id) ? 0 : 1.5}
                        fill={wishlist.has(listing.id) ? '#B85C3C' : 'none'}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Chip className="!text-[10px] !py-0.5 !px-2">{cat.name}</Chip>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {listingConditionLabel(listing.condition)}
                      </span>
                    </div>
                    <h3 className="font-bold text-indigo-deep leading-snug line-clamp-2 min-h-[44px]">{listing.title}</h3>
                    <div className="mt-2 text-xs text-slate-soft flex items-center gap-1">
                      <Icon name="MapPin" size={12} /> {[listing.locality, listing.city].filter(Boolean).join(', ')}
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <div className="text-coral font-bold text-lg">{fmtINR(listing.daily_price)}<span className="text-xs text-slate-soft font-normal">/ day</span></div>
                        <div className="flex items-center gap-1 text-xs text-slate-soft mt-0.5">
                          <Icon name="UserRound" size={12} className="text-coral" />
                          <span className="font-semibold text-indigo-deep line-clamp-1">{listing.owner_name || 'ShareHub host'}</span>
                        </div>
                      </div>
                      <Btn variant="outline" size="sm" onClick={() => go('listing-detail', listing)}>View →</Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!!error && !loading && (
          <div className="mt-6 rounded-2xl border border-coral/20 bg-coral-light px-4 py-3 text-sm text-coral-dark">
            {error}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-soft">
            <Icon name="Search" size={40} className="mx-auto mb-4 opacity-40" />
            <p>No items match. Try another category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
        active ? 'bg-indigo-deep text-white' : 'bg-cream text-slate-soft hover:text-indigo-deep border border-slate-line'
      }`}>
      {children}
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
