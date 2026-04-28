// Homepage sections
const { useState: uSH, useEffect: uEH, useRef: uRH } = React;

function Navbar({ go, currentView, user, gisReady, onSignOut }) {
  const [scrolled, setScrolled] = uSH(false);
  const [open, setOpen] = uSH(false);
  const googleBtnRef = uRH(null);
  const mobileGoogleBtnRef = uRH(null);
  uEH(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  uEH(() => {
    const canRender = !user && gisReady && window.google && window.google.accounts && window.google.accounts.id;
    if (!canRender) return;

    if (googleBtnRef.current) {
      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'medium',
        type: 'standard',
        shape: 'pill',
        text: 'signin_with',
      });
    }

    if (open && mobileGoogleBtnRef.current) {
      mobileGoogleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(mobileGoogleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'signin_with',
      });
    }
  }, [user, gisReady, open]);
  const links = [
    { label: 'Home', v: 'home' },
    { label: 'Browse', v: 'rent' },
    { label: 'List Your Item', v: 'list' },
    { label: 'How It Works', v: 'home', hash: 'how' },
  ];
  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? 'backdrop-blur-xl bg-white/80 shadow-sm border-b border-slate-line/40' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => go('home')}><Logo /></button>
          <nav className="hidden md:flex items-center gap-8 text-sm text-indigo-deep/80">
            {links.map(l => (
              <button key={l.label} onClick={() => go(l.v)} className="navlink hover:text-indigo-deep font-medium">
                {l.label}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {!user && <div ref={googleBtnRef} />}
            {!!user && (
              <>
                <button onClick={() => go('profile')} className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-line px-3 py-1.5 hover:border-coral/40 transition-colors">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name || 'Profile'} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-coral-light text-coral-dark text-xs font-bold flex items-center justify-center">
                      {(user.name || 'U').slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="text-xs text-indigo-deep font-medium max-w-[160px] truncate">{user.name || user.email}</span>
                </button>
                <Btn variant="ghost" size="sm" onClick={onSignOut}>Sign Out</Btn>
              </>
            )}
            <Btn variant="primary" size="sm" onClick={() => go('list')}>List for Free →</Btn>
          </div>
          <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5" onClick={() => setOpen(o => !o)}>
            <Icon name={open ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-slate-line/40 bg-white px-4 py-4 flex flex-col gap-1">
            {links.map(l => (
              <button key={l.label} onClick={() => { go(l.v); setOpen(false); }} className="text-left px-3 py-3 rounded-lg hover:bg-cream text-indigo-deep font-medium">
                {l.label}
              </button>
            ))}
            <div className="flex gap-2 mt-2">
              {!user && <div ref={mobileGoogleBtnRef} className="flex-1" />}
              {!!user && <Btn variant="outline" size="sm" className="flex-1" onClick={onSignOut}>Sign Out</Btn>}
              <Btn variant="primary" size="sm" className="flex-1" onClick={() => { go('list'); setOpen(false); }}>List Free →</Btn>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function Hero({ go }) {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div className="blob-glow" style={{ width: 420, height: 420, background: '#FF5A5F', top: -100, right: -80 }} />
      <div className="blob-glow" style={{ width: 360, height: 360, background: '#1B1F3B', bottom: -100, left: -100, opacity: 0.2 }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>
            <Chip tone="coral" className="mb-5 !px-3.5 !py-1.5">✦ India's #1 Product Rental Network</Chip>
            <h1 className="font-sans font-bold tracking-tight text-indigo-deep leading-[1.02]"
                style={{ fontSize: 'clamp(40px, 7vw, 76px)' }}>
              Rent What You <span className="text-coral">Need.</span><br/>
              List What You <span className="text-coral">Own.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-soft max-w-xl leading-relaxed">
              From wheelchairs to ski gear — borrow for a day, a week, or longer. No subscriptions. No clutter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn variant="primary" size="lg" onClick={() => go('rent')}>Browse Rentals →</Btn>
              <Btn variant="outline" size="lg" onClick={() => go('list')}>Become a Lister</Btn>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-soft">
              <span className="flex items-center gap-1.5"><Icon name="ShieldCheck" size={15} className="text-coral" /> Verified Listings</span>
              <span className="flex items-center gap-1.5"><Icon name="Star" size={15} className="text-coral" /> 4.8 Avg Rating</span>
              <span className="flex items-center gap-1.5"><Icon name="Package" size={15} className="text-coral" /> 12,000+ Items</span>
            </div>
          </div>
          <div className="relative h-[440px] lg:h-[520px]">
            <MosaicCards />
          </div>
        </div>
      </div>
    </section>
  );
}

function MosaicCards() {
  const cards = [
    { cat: CATEGORIES_SH[3], rot: -6, top: '2%', left: '8%', z: 3 },
    { cat: CATEGORIES_SH[2], rot: 4, top: '10%', right: '4%', z: 4 },
    { cat: CATEGORIES_SH[0], rot: -3, bottom: '22%', left: '0%', z: 2 },
    { cat: CATEGORIES_SH[4], rot: 7, bottom: '4%', right: '12%', z: 5 },
  ];
  return (
    <div className="absolute inset-0">
      {cards.map((c, i) => (
        <div key={c.cat.id}
          className={`absolute ${c.cat.gradient} rounded-3xl p-5 shadow-xl shadow-indigo-deep/15 w-56 transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 cursor-pointer`}
          style={{
            transform: `rotate(${c.rot}deg)`, top: c.top, bottom: c.bottom, left: c.left, right: c.right, zIndex: c.z,
            animation: `fadeUp 600ms ${i * 120}ms cubic-bezier(.2,.9,.2,1) both`,
          }}>
          <div className="text-3xl mb-2">{c.cat.icon}</div>
          <div className="font-semibold text-indigo-deep text-[15px]">{c.cat.name}</div>
          <div className="mt-1 text-xs text-indigo-deep/60">{c.cat.examples[0]}, {c.cat.examples[1]}</div>
          <div className="mt-3 inline-flex items-center gap-1 bg-white/70 backdrop-blur rounded-full px-2.5 py-1 text-[11px] font-semibold text-indigo-deep">
            from {fmtINR(c.cat.priceRange[0])}/day
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryBrowser({ go }) {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-indigo-deep tracking-tight">
              Explore by <span className="relative inline-block">Category<span className="absolute left-0 -bottom-1 h-1.5 w-full bg-coral/70 rounded" /></span>
            </h2>
            <p className="mt-3 text-slate-soft max-w-lg">Five thoughtfully curated categories. Thousands of items. Always local, always verified.</p>
          </div>
          <Btn variant="outline" size="sm" onClick={() => go('rent')}>View all →</Btn>
        </div>
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
          {CATEGORIES_SH.map((c, i) => (
            <button key={c.id} onClick={() => go('rent', c.id)}
              className={`${c.gradient} rounded-3xl p-6 text-left flex-shrink-0 w-72 sm:w-auto transition-all hover:shadow-xl hover:-translate-y-1 group`}
              style={{ animation: `fadeUp 500ms ${i * 70}ms cubic-bezier(.2,.9,.2,1) both` }}>
              <div className="flex items-start justify-between">
                <div className="text-4xl">{c.icon}</div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-indigo-deep">{c.name}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.examples.map(e => (
                  <span key={e} className="text-[11px] bg-white/60 text-indigo-deep/80 px-2 py-0.5 rounded-full font-medium">{e}</span>
                ))}
              </div>
              <div className="mt-5 text-sm font-semibold text-coral-dark group-hover:translate-x-1 transition-transform">
                Browse →
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function DualCTA({ go }) {
  return (
    <section className="py-0 border-y border-slate-line">
      <div className="grid md:grid-cols-2 relative">
        <div className="bg-white text-indigo-deep px-6 sm:px-12 py-16 md:py-24 relative overflow-hidden md:border-r border-slate-line">
          <div className="relative max-w-md ml-auto md:ml-0 md:mr-auto">
            <div className="text-[11px] uppercase tracking-[0.18em] text-coral font-semibold mb-4"><span className="editorial-rule" />For renters</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Need something<br/>for a weekend?
            </h2>
            <p className="mt-4 text-slate-soft leading-relaxed">
              Why buy when you can borrow? Rent premium gear from verified locals near you.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>₹299/day</Chip>
              <Chip>Verified</Chip>
              <Chip>Near You</Chip>
            </div>
            <Btn variant="primary" size="lg" className="mt-7" onClick={() => go('rent')}>Find Rentals →</Btn>
          </div>
        </div>
        <div className="bg-cream text-indigo-deep px-6 sm:px-12 py-16 md:py-24 relative overflow-hidden">
          <div className="relative max-w-md">
            <div className="text-[11px] uppercase tracking-[0.18em] text-coral font-semibold mb-4"><span className="editorial-rule" />For listers</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Got gear<br/>collecting dust?
            </h2>
            <p className="mt-4 text-slate-soft leading-relaxed">
              List your idle items and earn monthly passive income — we handle discovery, you handle handoff.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>Earn up to ₹18,000/month</Chip>
            </div>
            <Btn variant="dark" size="lg" className="mt-7" onClick={() => go('list')}>Start Listing Free →</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

function Calculator({ go }) {
  const [catId, setCatId] = uSH('travel');
  const cat = CATEGORIES_SH.find(c => c.id === catId);
  const [rate, setRate] = uSH(500);
  const [days, setDays] = uSH(12);
  const [items, setItems] = uSH(1);

  uEH(() => { setRate(cat.suggestedRate); }, [catId]);

  const monthly = rate * days * items;
  const yearly = monthly * 12;

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Chip tone="coralSoft">✦ Earnings Calculator</Chip>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-indigo-deep tracking-tight">How much can you earn?</h2>
          <p className="mt-3 text-slate-soft">Move the sliders — see your potential income.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 text-indigo-deep relative overflow-hidden border border-slate-line shadow-sm">
          <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10">
            <div className="space-y-8">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-soft font-semibold">Category</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CATEGORIES_SH.map(c => (
                    <button key={c.id} onClick={() => setCatId(c.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        catId === c.id ? 'bg-indigo-deep text-white' : 'bg-cream text-slate-soft hover:text-indigo-deep border border-slate-line'
                      }`}>
                      <span className="mr-1.5">{c.icon}</span>{c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-xs uppercase tracking-widest text-slate-soft font-semibold">Daily rental rate</label>
                  <div className="font-serif text-4xl text-indigo-deep leading-none">
                    <AnimatedNumberSH value={rate} prefix="₹" duration={200} />
                  </div>
                </div>
                <input type="range" min="100" max="2000" step="50" value={rate}
                  onChange={e => setRate(Number(e.target.value))} className="slider mt-4" />
                <div className="flex justify-between text-[11px] text-slate-soft/70 mt-2 font-mono">
                  <span>₹100</span><span>₹2,000</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-xs uppercase tracking-widest text-slate-soft font-semibold">Rentals per month</label>
                  <div className="font-serif text-4xl text-indigo-deep leading-none">
                    <AnimatedNumberSH value={days} duration={200} /> <span className="text-base font-sans text-slate-soft">days</span>
                  </div>
                </div>
                <input type="range" min="1" max="30" step="1" value={days}
                  onChange={e => setDays(Number(e.target.value))} className="slider mt-4" />
                <div className="flex justify-between text-[11px] text-slate-soft/70 mt-2 font-mono">
                  <span>1 day</span><span>30 days</span>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-slate-soft font-semibold">Items listed</label>
                <div className="mt-3 flex items-center gap-4">
                  <button onClick={() => setItems(i => Math.max(1, i - 1))}
                    className="w-10 h-10 rounded-full bg-cream hover:bg-slate-line/60 flex items-center justify-center text-xl">−</button>
                  <div className="font-serif text-4xl text-indigo-deep w-14 text-center">{items}</div>
                  <button onClick={() => setItems(i => Math.min(20, i + 1))}
                    className="w-10 h-10 rounded-full bg-cream hover:bg-slate-line/60 flex items-center justify-center text-xl">+</button>
                  <span className="text-sm text-slate-soft ml-2">{items === 1 ? 'item' : 'items'} listed</span>
                </div>
              </div>
            </div>

            <div className="bg-cream rounded-2xl p-8 border border-slate-line relative">
              <div className="text-xs uppercase tracking-widest text-slate-soft font-semibold mb-4">You could earn</div>
              <div className="font-sans font-bold leading-none" style={{ fontSize: 'clamp(44px, 8vw, 78px)', color: '#1C1C1A' }}>
                <AnimatedNumberSH value={monthly} prefix="₹" duration={300} />
              </div>
              <div className="text-slate-soft mt-1 text-sm">per month</div>

              <div className="mt-6 pt-6 border-t border-slate-line">
                <div className="text-xs uppercase tracking-widest text-slate-soft font-semibold">Yearly</div>
                <div className="font-serif text-3xl mt-1 text-indigo-deep">
                  <AnimatedNumberSH value={yearly} prefix="₹" duration={300} />
                </div>
              </div>

              <div className="mt-5 font-mono text-[11px] text-slate-soft/70">
                {fmtINR(rate)} × {days} days × {items} {items === 1 ? 'item' : 'items'} = {fmtINR(monthly)}
              </div>

              <div className="mt-6 inline-flex items-center gap-2 bg-coral-light border border-coral/30 rounded-full px-4 py-2 text-sm text-coral-dark font-medium">
                {insight(monthly)}
              </div>

              <Btn variant="primary" size="lg" className="mt-7 w-full" onClick={() => go('list')}>
                Start Earning Today →
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [tab, setTab] = uSH('renters');
  const steps = tab === 'renters' ? RENTER_STEPS : LISTER_STEPS;
  return (
    <section id="how" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Chip tone="coralSoft">✦ How It Works</Chip>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-indigo-deep tracking-tight">Simple by design.</h2>
        </div>
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-cream rounded-full border border-slate-line">
            {[['renters','For Renters'],['listers','For Listers']].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  tab === k ? 'bg-indigo-deep text-white shadow-md' : 'text-slate-soft hover:text-indigo-deep'
                }`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] border-t border-dashed border-slate-line/80" />
          {steps.map((s, i) => (
            <div key={s.t} className="relative bg-white text-center px-4">
              <div className="w-12 h-12 rounded-full bg-coral text-white font-bold flex items-center justify-center mx-auto shadow-lg shadow-coral/25 relative z-10">
                {i + 1}
              </div>
              <h3 className="mt-5 text-lg font-bold text-indigo-deep">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-soft leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
          {TESTIMONIALS.slice(0, 3).map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-line/60 flex-shrink-0 w-80 sm:w-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-coral/15 text-coral-dark font-bold flex items-center justify-center">{t.name[0]}</div>
                <div>
                  <div className="font-semibold text-indigo-deep text-sm">{t.name}</div>
                  <div className="text-xs text-slate-soft">{t.city}</div>
                </div>
                <div className="ml-auto flex items-center gap-0.5 text-coral">
                  {Array.from({ length: t.rating }).map((_, i) => <Icon key={i} name="Star" size={13} />)}
                </div>
              </div>
              <p className="text-sm text-indigo-deep/80 leading-relaxed">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ go }) {
  return (
    <footer className="bg-indigo-deep text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <Logo light />
            <p className="mt-4 text-slate-soft text-sm leading-relaxed max-w-xs">
              Own Less. Experience More. Your shelf is someone's adventure.
            </p>
            <Chip tone="white" className="mt-4 font-mono !text-xs">sharehub.in</Chip>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-soft/70 font-semibold mb-4">Company</div>
            <ul className="space-y-3 text-sm text-white/80">
              {['About', 'How It Works', 'Safety', 'Blog'].map(l => <li key={l}><a href="#" className="hover:text-coral">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-soft/70 font-semibold mb-4">Product</div>
            <ul className="space-y-3 text-sm text-white/80">
              <li><button onClick={() => go('list')} className="hover:text-coral">List an Item</button></li>
              <li><button onClick={() => go('rent')} className="hover:text-coral">Browse Rentals</button></li>
              <li><a href="#" className="hover:text-coral">Pricing</a></li>
              <li><a href="#" className="hover:text-coral">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-line pt-6 flex flex-wrap justify-between gap-2 text-xs text-slate-soft">
          <div>© 2025 ShareHub Technologies Pvt. Ltd.</div>
          <div>Made with <span className="text-coral">♥</span> in India</div>
        </div>
      </div>
    </footer>
  );
}

function HomeView({ go }) {
  return (
    <div className="view-fade">
      <Hero go={go} />
      <CategoryBrowser go={go} />
      <DualCTA go={go} />
      <Calculator go={go} />
      <HowItWorks />
      <SocialProof />
      <Footer go={go} />
    </div>
  );
}

Object.assign(window, { Navbar, HomeView });
