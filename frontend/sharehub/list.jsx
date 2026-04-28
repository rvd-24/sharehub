// List Your Item — mobile-first cinematic onboarding flow
const { useState: uSL, useEffect: uEL, useRef: uRL, useMemo: uML } = React;

const STEP_TITLES = [
  'Welcome', 'Category', 'Type', 'Details', 'Pricing',
  'Availability', 'Location', 'Photos', 'Rules', 'Review',
];

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Unable to read photo.'));
    reader.readAsDataURL(file);
  });
}

function ListView({
  go,
  user,
  accessToken,
  onSaveListing,
  fireConfetti,
  setFireConfetti,
}) {
  const [step, setStep] = uSL(0);
  const [state, setState] = uSL(() => createEmptyListingState());
  const [published, setPublished] = uSL(false);
  const [editorOpen, setEditorOpen] = uSL(true);
  const [editingListingId, setEditingListingId] = uSL(null);
  const [saveBusy, setSaveBusy] = uSL(false);
  const [saveError, setSaveError] = uSL('');

  const isEditing = editingListingId !== null;
  const canManageListings = !!user && !!accessToken;

  const canAdvance = () => {
    const selectedPriceBasis = state.priceBasis || 'daily';

    switch (step) {
      case 0: return true;
      case 1: return !!state.category;
      case 2: return state.subs.length > 0;
      case 3: return state.name.trim().length > 0 && state.condition;
      case 4: return Number(state.price[selectedPriceBasis]) > 0;
      case 5: return true;
      case 6: return !!state.city && !!state.pin;
      case 7: return true;
      case 8: return true;
      case 9: return true;
      default: return true;
    }
  };

  const next = () => canAdvance() && setStep(s => Math.min(9, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));
  const progress = step === 0 ? 0 : (step / 9) * 100;

  const startNewListing = () => {
    setState(createEmptyListingState());
    setEditingListingId(null);
    setPublished(false);
    setSaveError('');
    setStep(0);
    setEditorOpen(true);
  };

  const backToDashboard = () => {
    go('profile');
    setPublished(false);
    setSaveBusy(false);
    setSaveError('');
    setStep(0);
  };

  const publish = async () => {
    setSaveBusy(true);
    setSaveError('');

    try {
      await onSaveListing({ listingId: editingListingId, formState: state });
      setPublished(true);
      setFireConfetti(true);
      setTimeout(() => setFireConfetti(false), 4200);
    } catch (err) {
      setSaveError(err.message || 'Unable to submit your listing.');
    } finally {
      setSaveBusy(false);
    }
  };

  uEL(() => { window.scrollTo(0, 0); }, [step, editorOpen]);

  if (!user) {
    return <ListAuthGateL go={go} message="Sign in with Google to save listings and manage edits." />;
  }

  if (!canManageListings) {
    return <ListAuthGateL go={go} message="Your saved session is missing a listing token. Sign out and sign back in to publish or edit listings." />;
  }

  return (
    <div className="view-fade min-h-screen bg-cream">
      <div className="sticky top-0 z-30 bg-cream/90 backdrop-blur-lg border-b border-slate-line/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button onClick={backToDashboard} className="text-xs sm:text-sm text-slate-soft hover:text-indigo-deep inline-flex items-center gap-1.5">
            <Icon name="ArrowLeft" size={14} /> Back to My Listings
          </button>
          <Logo />
          <div className="font-mono text-[11px] text-slate-soft">
            <b className="text-indigo-deep">{String(step).padStart(2,'0')}</b> / 09
          </div>
        </div>
        {step > 0 && (
          <div className="h-0.5 bg-slate-line/60">
            <div className="h-full bg-coral transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">
        {step === 0 && <HeroL next={next} />}
        {step === 1 && <CategoryL state={state} setState={setState} />}
        {step === 2 && <SubL state={state} setState={setState} />}
        {step === 3 && <DetailsL state={state} setState={setState} />}
        {step === 4 && <PricingL state={state} setState={setState} />}
        {step === 5 && <AvailabilityL state={state} setState={setState} />}
        {step === 6 && <LocationL state={state} setState={setState} />}
        {step === 7 && <PhotosL state={state} setState={setState} />}
        {step === 8 && <RulesL state={state} setState={setState} />}
        {step === 9 && (
          <ReviewL
            state={state}
            onEdit={() => setStep(1)}
            onPublish={publish}
            onBackToDashboard={backToDashboard}
            published={published}
            go={go}
            isEditing={isEditing}
            saveBusy={saveBusy}
            saveError={saveError}
          />
        )}
      </div>

      {!!saveError && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
          <div className="rounded-2xl border border-coral/20 bg-coral-light px-4 py-3 text-sm text-coral-dark">
            {saveError}
          </div>
        </div>
      )}

      {step > 0 && step < 9 && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-slate-line/60 z-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <Btn variant="outline" size="md" onClick={back}><Icon name="ArrowLeft" size={14} /> Back</Btn>
            <div className="text-[11px] font-mono text-slate-soft hidden sm:block">
              {canAdvance() ? `Step ${step} of 9 · ${STEP_TITLES[step]}` : 'Answer to continue'}
            </div>
            <Btn variant="primary" size="md" onClick={next} disabled={!canAdvance()}>
              Continue <Icon name="ArrowRight" size={14} />
            </Btn>
          </div>
        </div>
      )}
      {step === 9 && !published && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-slate-line/60 z-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Btn variant="outline" size="md" onClick={back}><Icon name="ArrowLeft" size={14} /> Back</Btn>
            <Btn variant="primary" size="md" onClick={publish} disabled={saveBusy}>
              {saveBusy ? 'Saving…' : isEditing ? 'Save Changes' : 'Publish Listing 🎉'}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteListingModalL({ listing, deleting, onCancel, onConfirm }) {
  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close confirmation"
        className="absolute inset-0 bg-indigo-deep/35 backdrop-blur-[2px]"
        onClick={deleting ? undefined : onCancel}
      />
      <div className="relative w-full max-w-md rounded-3xl border border-slate-line bg-white p-6 sm:p-7 shadow-2xl">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
          <Icon name="Trash2" size={16} />
        </div>
        <h3 className="mt-4 text-2xl font-bold text-indigo-deep tracking-tight">Delete listing?</h3>
        <p className="mt-2 text-sm text-slate-soft leading-relaxed">
          You are about to permanently delete <span className="font-semibold text-indigo-deep">{listing.title}</span>.
          This cannot be undone.
        </p>
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Btn variant="outline" size="sm" onClick={onCancel} disabled={deleting}>Keep Listing</Btn>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ListAuthGateL({ go, message }) {
  return (
    <div className="view-fade min-h-screen bg-cream pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button onClick={() => go('home')} className="text-sm text-slate-soft hover:text-indigo-deep inline-flex items-center gap-1.5 mb-6">
          <Icon name="ArrowLeft" size={14} /> Back to Home
        </button>
        <div className="bg-white border border-slate-line rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <Chip tone="coralSoft">Listing access</Chip>
          <h1 className="mt-5 font-sans font-bold text-indigo-deep tracking-tight leading-[1.05]" style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}>
            Manage listings from your <span className="text-coral">account.</span>
          </h1>
          <p className="mt-4 text-slate-soft max-w-xl mx-auto">{message}</p>
          <Btn variant="primary" size="lg" className="mt-8" onClick={() => go('home')}>Go Home →</Btn>
        </div>
      </div>
    </div>
  );
}

function ListingDashboardL({ go, user, listings, loading, error, onCreate, onEdit, onDelete, deletingListingIds }) {
  return (
    <div className="view-fade min-h-screen bg-cream pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => go('home')} className="text-sm text-slate-soft hover:text-indigo-deep inline-flex items-center gap-1.5 mb-4">
          <Icon name="ArrowLeft" size={14} /> Back to Home
        </button>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <Chip tone="coralSoft">Host dashboard</Chip>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-indigo-deep tracking-tight">
              Welcome back, <span className="text-coral">{(user.name || user.email || 'host').split(' ')[0]}</span>
            </h1>
            <p className="text-slate-soft mt-3">Create a new listing or update the ones you already have live.</p>
          </div>
          <Btn variant="primary" size="lg" onClick={onCreate}>New Listing →</Btn>
        </div>

        {!!error && (
          <div className="mb-6 rounded-2xl border border-coral/20 bg-coral-light px-4 py-3 text-sm text-coral-dark">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-soft">Loading your listings…</div>
        ) : listings.length === 0 ? (
          <div className="bg-white border border-slate-line rounded-3xl p-10 sm:p-14 text-center shadow-sm">
            <Icon name="PackageOpen" size={40} className="mx-auto text-coral" />
            <h2 className="mt-4 text-2xl font-bold text-indigo-deep">No listings yet</h2>
            <p className="mt-2 text-slate-soft">Your saved items will appear here after you submit them for approval.</p>
            <Btn variant="primary" size="lg" className="mt-6" onClick={onCreate}>Create your first listing</Btn>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {listings.map(listing => (
              <ListingCardL
                key={listing.id}
                listing={listing}
                onEdit={() => onEdit(listing)}
                onDelete={() => onDelete(listing)}
                deleting={deletingListingIds.has(listing.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function listingStatusMeta(status) {
  if (status === 'approved') {
    return { label: 'Approved', tone: 'sage' };
  }

  if (status === 'rejected') {
    return { label: 'Rejected', tone: 'coralSoft' };
  }

  return { label: 'Approval In Progress', tone: 'default' };
}

function ListingCardL({ listing, onEdit, onDelete, deleting }) {
  const category = CATEGORIES_SH.find(c => c.id === listing.category) || CATEGORIES_SH[0];
  const cover = listing.photo_urls && listing.photo_urls[0];
  const updated = new Date(listing.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const statusInfo = listingStatusMeta(listing.status);

  return (
    <div className="relative bg-white rounded-3xl border border-slate-line/60 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        title="Delete listing"
        aria-label="Delete listing"
        className="absolute top-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon name="Trash2" size={14} />
      </button>
      <div className={`${category.gradient} h-48 flex items-center justify-center`}>
        {cover ? (
          <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl opacity-70">{category.icon}</div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <Chip className="!text-[10px] !py-0.5 !px-2">{category.name}</Chip>
          <span className="text-[11px] text-slate-soft">Updated {updated}</span>
        </div>
        <h3 className="mt-3 text-xl font-bold text-indigo-deep leading-snug line-clamp-2">{listing.title}</h3>
        <div className="mt-2 text-sm text-slate-soft flex items-center gap-1">
          <Icon name="MapPin" size={13} /> {[listing.locality, listing.city].filter(Boolean).join(', ')}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] uppercase tracking-widest text-slate-soft">Status</span>
          <Chip tone={statusInfo.tone} className="!text-[10px] !py-0.5 !px-2">{statusInfo.label}</Chip>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="text-coral font-bold text-2xl">{fmtINR(listing.daily_price)}</div>
            <div className="text-xs text-slate-soft">{listingConditionLabel(listing.condition)} · min {listing.min_duration} day{listing.min_duration === 1 ? '' : 's'}</div>
          </div>
          <Btn variant="outline" size="sm" onClick={onEdit} disabled={deleting}>{deleting ? 'Deleting…' : 'Edit Listing'}</Btn>
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ n, children }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.18em] text-coral font-semibold mb-3">
      <span className="inline-block w-4 h-px bg-coral align-middle mr-2" />
      Step {String(n).padStart(2,'0')} — {children}
    </div>
  );
}

function Hx({ children }) {
  return <h1 className="font-sans font-bold text-indigo-deep tracking-tight leading-[1.05]" style={{ fontSize: 'clamp(32px, 6vw, 54px)' }}>{children}</h1>;
}

function HeroL({ next }) {
  return (
    <div className="text-center py-8 sm:py-16">
      <Chip tone="coralSoft">✦ List your item</Chip>
      <h1 className="mt-5 font-sans font-bold text-indigo-deep tracking-tight leading-[1.02]" style={{ fontSize: 'clamp(40px, 8vw, 72px)' }}>
        Turn what you own<br/>into <span className="text-coral">income.</span>
      </h1>
      <p className="mt-5 text-slate-soft max-w-lg mx-auto leading-relaxed">
        List your item in under five minutes. We'll walk you through it — one question at a time.
      </p>
      <Btn variant="primary" size="lg" className="mt-8" onClick={next}>Get Started →</Btn>
      <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-slate-soft">
        <span className="flex items-center gap-1.5"><Icon name="Sparkles" size={13} className="text-coral" /> Avg ₹14k/mo</span>
        <span className="flex items-center gap-1.5"><Icon name="Clock" size={13} className="text-coral" /> 5 min flow</span>
        <span className="flex items-center gap-1.5"><Icon name="ShieldCheck" size={13} className="text-coral" /> Verified renters</span>
      </div>
    </div>
  );
}

function CategoryL({ state, setState }) {
  return (
    <div>
      <Eyebrow n={1}>Category</Eyebrow>
      <Hx>What are you <em className="italic font-serif text-coral not-italic">listing</em> today?</Hx>
      <p className="mt-3 text-slate-soft">Pick the closest fit. You can always edit later.</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES_SH.map(c => {
          const sel = state.category === c.id;
          return (
            <button key={c.id}
              onClick={() => setState(s => ({ ...s, category: c.id, subs: s.category === c.id ? s.subs : [] }))}
              className={`${c.gradient} rounded-3xl p-5 text-left relative transition-all active:scale-[0.98] min-h-[120px] ${
                sel ? 'ring-2 ring-indigo-deep shadow-xl' : 'hover:shadow-lg'
              }`}>
              <div className="flex items-start justify-between">
                <div className="text-4xl">{c.icon}</div>
                {sel && <div className="w-7 h-7 rounded-full bg-indigo-deep text-white flex items-center justify-center text-sm">✓</div>}
              </div>
              <h3 className="mt-3 font-bold text-indigo-deep text-lg">{c.name}</h3>
              <div className="text-xs text-indigo-deep/60 mt-1">{c.examples.join(' · ')}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SubL({ state, setState }) {
  const cat = CATEGORIES_SH.find(c => c.id === state.category);
  const subs = cat ? SUB_MAP[cat.id] : [];
  const toggle = (s) => setState(st => ({
    ...st, subs: st.subs.includes(s) ? st.subs.filter(x => x !== s) : [...st.subs, s],
  }));
  return (
    <div>
      <Eyebrow n={2}>{cat?.name}</Eyebrow>
      <Hx>Which specific<br/><em className="italic font-serif text-coral not-italic">{cat?.name.toLowerCase()}</em> item?</Hx>
      <p className="mt-3 text-slate-soft">Select all that apply.</p>
      <div className="mt-7 flex flex-wrap gap-2">
        {subs.map(s => {
          const sel = state.subs.includes(s);
          return (
            <button key={s} onClick={() => toggle(s)}
              className={`px-5 py-3 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                sel ? 'bg-indigo-deep text-white' : 'bg-white border border-slate-line text-indigo-deep hover:border-indigo-deep'
              }`}>
              {sel ? '✓ ' : ''}{s}
            </button>
          );
        })}
      </div>
      <div className="mt-5 font-mono text-xs text-slate-soft">{state.subs.length} selected</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-soft mb-2">{label}</label>
      {children}
    </div>
  );
}

function DetailsL({ state, setState }) {
  const set = (k, v) => setState(s => ({ ...s, [k]: v }));
  const cat = CATEGORIES_SH.find(c => c.id === state.category);
  const years = Array.from({ length: 16 }, (_, i) => 2026 - i);
  return (
    <div>
      <Eyebrow n={3}>Details</Eyebrow>
      <Hx>Tell us about <em className="italic font-serif text-coral not-italic">your item.</em></Hx>
      <div className="mt-8 space-y-6">
        <Field label="Item name">
          <input value={state.name} onChange={e => set('name', e.target.value)}
            placeholder={cat ? `e.g. ${SUB_MAP[cat.id][0]}` : 'e.g. Folding wheelchair'}
            className="w-full bg-transparent border-b border-slate-line/80 py-3 text-xl font-serif focus:border-indigo-deep outline-none transition-colors" />
        </Field>
        <Field label="Brand or model">
          <input value={state.brand} onChange={e => set('brand', e.target.value)}
            placeholder="e.g. Sony, IKEA, Decathlon"
            className="w-full bg-transparent border-b border-slate-line/80 py-3 text-xl font-serif focus:border-indigo-deep outline-none transition-colors" />
        </Field>
        <Field label="Condition">
          <div className="grid grid-cols-3 gap-2">
            {CONDITIONS_SH.map(c => {
              const sel = state.condition === c.id;
              return (
                <button key={c.id} onClick={() => set('condition', c.id)}
                  className={`rounded-2xl p-4 text-left border transition-all min-h-[88px] ${
                    sel ? 'bg-indigo-deep text-white border-indigo-deep' : 'bg-white border-slate-line hover:border-indigo-deep'
                  }`}>
                  <div className="font-semibold text-sm">{c.label}</div>
                  <div className={`text-[11px] mt-1 ${sel ? 'text-white/70' : 'text-slate-soft'}`}>{c.desc}</div>
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="Year of purchase">
          <select value={state.year} onChange={e => set('year', e.target.value)}
            className="w-full bg-transparent border-b border-slate-line/80 py-3 text-xl font-serif focus:border-indigo-deep outline-none">
            <option value="">Select a year…</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

function PricingL({ state, setState }) {
  const cat = CATEGORIES_SH.find(c => c.id === state.category);
  const price = state.price;
  const selectedBasis = state.priceBasis || 'daily';
  const setPrice = (k, v) => setState(s => ({ ...s, price: { ...s.price, [k]: Math.max(0, v) } }));
  const setPriceBasis = (key) => setState(s => ({ ...s, priceBasis: key }));
  const [depositOn, setDepositOn] = uSL(state.depositAmount > 0);
  uEL(() => { if (!depositOn) setState(s => ({ ...s, depositAmount: 0 })); }, [depositOn]);

  const tiers = [
    { key: 'daily', label: 'Daily', per: '/ day', step: 50 },
    { key: 'weekly', label: 'Weekly', per: '/ week', step: 100 },
    { key: 'monthly', label: 'Monthly', per: '/ month', step: 500 },
  ];

  return (
    <div>
      <Eyebrow n={4}>Pricing</Eyebrow>
      <Hx>Set your <em className="italic font-serif text-coral not-italic">rental price.</em></Hx>
      {cat && (
        <Chip tone="coralSoft" className="mt-5">
          ✦ Similar {cat.name.toLowerCase()} items rent for <b className="mx-1">₹{cat.priceRange[0]}–₹{cat.priceRange[1]}/day</b>
        </Chip>
      )}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {tiers.map(t => {
          const isActive = selectedBasis === t.key;

          return (
          <div
            key={t.key}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onClick={() => setPriceBasis(t.key)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setPriceBasis(t.key);
              }
            }}
            className={`rounded-3xl p-6 border cursor-pointer transition-colors ${isActive ? 'bg-indigo-deep text-white border-indigo-deep' : 'bg-white border-slate-line hover:border-indigo-deep/30'}`}
          >
            <div className={`text-[11px] uppercase tracking-widest font-semibold ${isActive ? 'text-white/60' : 'text-slate-soft'}`}>{t.label}</div>
            <div className="mt-3 flex items-baseline">
              <span className={`font-serif text-2xl ${isActive ? 'text-white/60' : 'text-slate-soft'}`}>₹</span>
              <span className={`font-serif leading-none ${isActive ? 'text-coral' : 'text-indigo-deep'}`} style={{ fontSize: 48 }}>
                <AnimatedNumberSH value={price[t.key]} duration={200} />
              </span>
              <span className={`text-sm ml-2 ${isActive ? 'text-white/50' : 'text-slate-soft'}`}>{t.per}</span>
            </div>
            <div className="mt-5 flex justify-between items-center">
              <button onClick={(event) => { event.stopPropagation(); setPrice(t.key, price[t.key] - t.step); }}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg ${
                  isActive ? 'border-white/20 hover:bg-white/10' : 'border-slate-line hover:bg-cream'
                }`}>−</button>
              <div className={`font-mono text-[11px] ${isActive ? 'text-white/40' : 'text-slate-soft'}`}>step ₹{t.step}</div>
              <button onClick={(event) => { event.stopPropagation(); setPrice(t.key, price[t.key] + t.step); }}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg ${
                  isActive ? 'border-white/20 hover:bg-white/10' : 'border-slate-line hover:bg-cream'
                }`}>+</button>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

function AvailabilityL({ state, setState }) {
  const [month, setMonth] = uSL(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const today = uML(() => new Date(), []);
  const dim = new Date(month.y, month.m + 1, 0).getDate();
  const firstDow = new Date(month.y, month.m, 1).getDay();
  const monthName = new Date(month.y, month.m, 1).toLocaleString('en', { month: 'long', year: 'numeric' });
  const toggle = (key) => setState(s => {
    const n = new Set(s.blocked); n.has(key) ? n.delete(key) : n.add(key); return { ...s, blocked: [...n] };
  });
  const prev = () => setMonth(m => m.m === 0 ? { y: m.y - 1, m: 11 } : { ...m, m: m.m - 1 });
  const next = () => setMonth(m => m.m === 11 ? { y: m.y + 1, m: 0 } : { ...m, m: m.m + 1 });
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ muted: true, key: `m${i}` });
  for (let d = 1; d <= dim; d++) {
    const key = `${month.y}-${month.m}-${d}`;
    cells.push({ d, key, today: today.getFullYear() === month.y && today.getMonth() === month.m && today.getDate() === d, blocked: state.blocked.includes(key) });
  }
  return (
    <div>
      <Eyebrow n={5}>Availability</Eyebrow>
      <Hx>When is it <em className="italic font-serif text-coral not-italic">available?</em></Hx>
      <p className="mt-3 text-slate-soft">Tap a date to block it off.</p>
      <div className="mt-7 grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <div className="bg-white border border-slate-line rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-2xl text-indigo-deep">{monthName}</h3>
            <div className="flex gap-1">
              <button onClick={prev} className="w-9 h-9 rounded-full border border-slate-line hover:bg-cream flex items-center justify-center">‹</button>
              <button onClick={next} className="w-9 h-9 rounded-full border border-slate-line hover:bg-cream flex items-center justify-center">›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-[10px] font-semibold text-slate-soft uppercase tracking-wider py-2 text-center">{d}</div>
            ))}
            {cells.map(c => c.muted ? (
              <div key={c.key} className="aspect-square" />
            ) : (
              <button key={c.key} onClick={() => toggle(c.key)}
                className={`aspect-square rounded-lg text-sm transition ${
                  c.blocked ? 'bg-indigo-deep text-white line-through' :
                  c.today ? 'font-bold text-coral hover:bg-cream' : 'text-indigo-deep hover:bg-cream'
                }`}>{c.d}</button>
            ))}
          </div>
        </div>
        <div>
          <Field label="Minimum rental duration">
            <div className="flex items-center gap-3 pt-1 pb-3 border-b border-slate-line/80">
              <button onClick={() => setState(s => ({ ...s, minDuration: Math.max(1, s.minDuration - 1) }))}
                className="w-10 h-10 rounded-full border border-slate-line hover:bg-cream">−</button>
              <div className="flex-1 font-serif text-3xl">
                {state.minDuration}<span className="text-sm text-slate-soft ml-2 font-sans">{state.minDuration === 1 ? 'day' : 'days'}</span>
              </div>
              <button onClick={() => setState(s => ({ ...s, minDuration: s.minDuration + 1 }))}
                className="w-10 h-10 rounded-full border border-slate-line hover:bg-cream">+</button>
            </div>
          </Field>
          <div className="mt-4 font-mono text-[11px] text-slate-soft">{state.blocked.length} dates blocked</div>
        </div>
      </div>
    </div>
  );
}

function LocationL({ state, setState }) {
  const set = (k, v) => setState(s => ({ ...s, [k]: v }));
  return (
    <div>
      <Eyebrow n={6}>Location</Eyebrow>
      <Hx>Where is it <em className="italic font-serif text-coral not-italic">located?</em></Hx>
      <div className="mt-8 grid sm:grid-cols-3 gap-6">
        <Field label="City">
          <input value={state.city} onChange={e => set('city', e.target.value)} placeholder="Bengaluru"
            className="w-full bg-transparent border-b border-slate-line/80 py-3 text-xl font-serif focus:border-indigo-deep outline-none" />
        </Field>
        <Field label="Locality / area">
          <input value={state.locality} onChange={e => set('locality', e.target.value)} placeholder="Indiranagar"
            className="w-full bg-transparent border-b border-slate-line/80 py-3 text-xl font-serif focus:border-indigo-deep outline-none" />
        </Field>
        <Field label="PIN code">
          <input value={state.pin} onChange={e => set('pin', e.target.value)} placeholder="560038"
            className="w-full bg-transparent border-b border-slate-line/80 py-3 text-xl font-serif focus:border-indigo-deep outline-none" />
        </Field>
      </div>
    </div>
  );
}

function PhotosL({ state, setState }) {
  const [drag, setDrag] = uSL(false);
  const inputRef = uRL(null);
  const addFiles = async (files) => {
    const arr = Array.from(files).slice(0, 8 - state.photos.length);
    const dataUrls = await Promise.all(arr.map(fileToDataUrl));
    const mapped = arr.map((f, index) => ({ id: `${Date.now()}-${Math.random()}`, url: dataUrls[index], name: f.name }));
    setState(s => ({ ...s, photos: [...s.photos, ...mapped].slice(0, 8) }));
  };
  const remove = (id) => setState(s => ({ ...s, photos: s.photos.filter(p => p.id !== id) }));
  return (
    <div>
      <Eyebrow n={7}>Photos</Eyebrow>
      <Hx>Show it <em className="italic font-serif text-coral not-italic">off.</em></Hx>
      <p className="mt-3 text-slate-soft">Good light, plain background. The first photo becomes your cover.</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer?.files) void addFiles(e.dataTransfer.files); }}
        className={`mt-7 rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all ${
          drag ? 'border-coral bg-coral-light' : 'border-slate-line bg-white hover:border-indigo-deep'
        }`}>
        <Icon name="Upload" size={40} className="mx-auto text-indigo-deep/70" />
        <p className="mt-3 text-indigo-deep font-medium">Drag photos here or tap to browse</p>
        <p className="mt-1 text-xs text-slate-soft">JPG, PNG, HEIC · up to 8 photos</p>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden
          onChange={e => { if (e.target.files) void addFiles(e.target.files); e.target.value = ''; }} />
      </div>
      <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
        <span className="font-mono text-xs text-slate-soft">{state.photos.length} of 8 photos added</span>
        <Chip tone="coralSoft">✦ 5+ photos get <b className="mx-1">3× more bookings</b></Chip>
      </div>
      {state.photos.length > 0 && (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {state.photos.map(p => (
            <div key={p.id} className="relative flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden border border-slate-line">
              <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
              <button onClick={() => remove(p.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RulesL({ state, setState }) {
  const toggle = (r) => setState(s => ({ ...s, rules: s.rules.includes(r) ? s.rules.filter(x => x !== r) : [...s.rules, r] }));
  return (
    <div>
      <Eyebrow n={8}>House rules</Eyebrow>
      <Hx>Any <em className="italic font-serif text-coral not-italic">rules</em> for renters?</Hx>
      <p className="mt-3 text-slate-soft">Renters see these before booking.</p>
      <div className="mt-7 flex flex-wrap gap-2">
        {RULE_CHIPS_SH.map(r => {
          const sel = state.rules.includes(r);
          return (
            <button key={r} onClick={() => toggle(r)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium border transition min-h-[44px] ${
                sel ? 'bg-coral-light text-coral-dark border-coral' : 'bg-white border-slate-line text-slate-soft hover:border-indigo-deep hover:text-indigo-deep'
              }`}>{sel ? '✓ ' : '+ '}{r}</button>
          );
        })}
      </div>
      <Field label="Anything else?">
        <textarea value={state.notes} onChange={e => setState(s => ({ ...s, notes: e.target.value }))}
          placeholder="Custom notes, handling instructions…" rows={3}
          className="mt-2 w-full bg-white border border-slate-line rounded-2xl p-4 text-sm outline-none focus:border-indigo-deep resize-none" />
      </Field>
    </div>
  );
}

function ReviewL({ state, onEdit, onPublish, onBackToDashboard, published, go, isEditing, saveBusy, saveError }) {
  const cat = CATEGORIES_SH.find(c => c.id === state.category);
  const cover = state.photos[0]?.url;
  const cond = CONDITIONS_SH.find(c => c.id === state.condition);
  const location = [state.locality, state.city].filter(Boolean).join(', ') || 'Location pending';
  const priceBasis = state.priceBasis || 'daily';
  const priceLabels = {
    daily: '/ day',
    weekly: '/ week',
    monthly: '/ month',
  };
  return (
    <div>
      <Eyebrow n={9}>Review</Eyebrow>
      <Hx>Your listing is <em className="italic font-serif text-coral not-italic">ready.</em></Hx>
      <div className="mt-8 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
        <div className={`bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-line ${published ? 'fade-in' : ''}`}>
          <div className={`h-56 ${cat?.gradient || 'bg-cream'} flex items-center justify-center relative`}>
            {cover ? <img src={cover} className="w-full h-full object-cover" /> : <div className="text-7xl opacity-70">{cat?.icon || '📦'}</div>}
          </div>
          <div className="p-6">
            {cat && <Chip tone="coralSoft">{cat.name}</Chip>}
            <h2 className="mt-2 font-serif text-3xl text-indigo-deep leading-tight">{state.name || 'Untitled item'}</h2>
            <div className="mt-2 text-sm text-slate-soft flex items-center gap-2 flex-wrap">
              <span>{state.brand || '—'}</span><span>·</span>
              <span>{cond?.label}</span><span>·</span>
              <span>{location}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-line flex items-baseline justify-between">
              <div>
                <span className="font-serif text-3xl text-coral">{fmtINR(state.price[priceBasis])}</span>
                <span className="text-sm text-slate-soft ml-1">{priceLabels[priceBasis]}</span>
              </div>
              <div className="font-mono text-[11px] text-slate-soft">min {state.minDuration}d</div>
            </div>
          </div>
        </div>
        <div>
          {published ? (
            <div className="fade-in">
              <Chip tone="default">● Approval In Progress</Chip>
              <h2 className="mt-4 font-sans font-bold text-indigo-deep" style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1 }}>
                Listing <span className="text-coral">submitted.</span>
              </h2>
              <p className="mt-4 text-slate-soft">Admin will approve the Listing. You'll be notified once the Listing is live.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Btn variant="primary" size="md" onClick={onBackToDashboard}>Back to dashboard</Btn>
              </div>
            </div>
          ) : (
            <>
              <p className="text-slate-soft">One last look. Everything's editable from your dashboard later.</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-soft">
                <li>— {state.subs.length} sub-categories tagged</li>
                <li>— {state.photos.length} photo{state.photos.length === 1 ? '' : 's'} uploaded</li>
                <li>— {state.rules.length} rule{state.rules.length === 1 ? '' : 's'} set</li>
                <li>— {state.blocked.length} dates blocked</li>
              </ul>
              {!!saveError && (
                <div className="mt-4 rounded-2xl border border-coral/20 bg-coral-light px-4 py-3 text-sm text-coral-dark">
                  {saveError}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                <Btn variant="outline" size="md" onClick={onEdit}>Edit details</Btn>
                <Btn variant="primary" size="md" onClick={onPublish} disabled={saveBusy}>
                  {saveBusy ? 'Submitting…' : isEditing ? 'Save & Resubmit' : 'Submit Listing'}
                </Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ListView });
