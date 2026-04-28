const { useState: uSP, useEffect: uEP } = React;

function profileStatusMeta(status) {
  if (status === 'approved') return { label: 'Approved', tone: 'bg-emerald-600' };
  if (status === 'rejected') return { label: 'Rejected', tone: 'bg-red-500' };
  return { label: 'Approval In Progress', tone: 'bg-slate-soft' };
}

function profileMemberSince(user) {
  if (!user?.created_at) return 'Joined recently';
  const joined = new Date(user.created_at);
  if (Number.isNaN(joined.getTime())) return 'Joined recently';
  return `Joined ${joined.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`;
}

function ProfileListingCard({ listing, go }) {
  const category = CATEGORIES_SH.find(c => c.id === listing.category) || CATEGORIES_SH[0];
  const statusInfo = profileStatusMeta(listing.status);
  const cover = listing.photo_urls && listing.photo_urls[0];

  return (
    <div className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-stone-100 shadow-[0_10px_30px_rgba(168,107,77,0.03)] hover:shadow-[0_20px_50px_rgba(168,107,77,0.08)] transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <img src={cover} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className={`${category.gradient} w-full h-full flex items-center justify-center text-6xl`}>{category.icon}</div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`${statusInfo.tone} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>{statusInfo.label}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-headline-md text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-2">{listing.title}</h3>
          <div className="flex items-center text-primary whitespace-nowrap">
            <span className="font-bold text-lg">{fmtINR(listing.daily_price)}</span>
            <span className="text-sm font-medium text-on-secondary-container">/day</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-on-secondary-container mb-4 text-sm">
          <Icon name="MapPin" size={14} />
          <span>{[listing.locality, listing.city].filter(Boolean).join(', ') || 'Location not added'}</span>
        </div>
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-sm text-on-secondary-container">min {listing.min_duration || 1} day</span>
          <button onClick={() => go('list')} className="text-primary font-button flex items-center gap-1">
            Edit <Icon name="Pencil" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileView({ go, user, listings = [], loading = false, error = '' }) {
  if (!user) {
    return (
      <div className="view-fade min-h-screen pt-24 pb-24 bg-[#fcf9f8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-slate-line/60 p-8 text-center">
            <Icon name="UserRound" size={36} className="mx-auto text-coral mb-4" />
            <h1 className="text-2xl font-bold text-indigo-deep">Sign in to view your profile</h1>
            <p className="mt-3 text-slate-soft">Your current listings and account activity appear here.</p>
            <Btn variant="outline" size="lg" className="mt-6" onClick={() => go('home')}>Back to Home</Btn>
          </div>
        </div>
      </div>
    );
  }

  const listingCount = listings.length;
  const addressLabel = user.city && user.state ? `${user.city}, ${user.state}` : user.city || user.state || 'Address not set';
  const areaLabel = user.address_line2 || user.address_line1 || 'Update your address in profile settings';
  const profileDescription = user.profile_description || 'Curating a library of sustainable essentials in the heart of the city. Avid DIY-er and community advocate.';

  return (
    <div className="view-fade min-h-screen bg-[#fcf9f8] pb-24 md:pb-16" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 mb-12 md:mb-16">
          <div className="lg:col-span-8 bg-surface-container-lowest p-5 sm:p-8 rounded-xl shadow-[0_20px_40px_rgba(168,107,77,0.04)] border border-stone-100">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-start">
              <div className="relative">
                {user.picture ? (
                  <img src={user.picture} alt={user.name || 'User'} className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-lg" />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-coral-light text-coral-dark border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold">
                    {(user.name || user.email || 'U').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-[#A86B4D] text-white p-2 rounded-xl flex items-center justify-center">
                  <Icon name="BadgeCheck" size={14} />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="font-headline-lg text-on-surface text-2xl sm:text-3xl mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{user.name || 'ShareHub User'}</h1>
                <p className="text-on-secondary-container font-body-lg mb-5 max-w-xl text-sm sm:text-base">{profileDescription}</p>
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  <div className="flex items-center gap-2 bg-secondary-container/30 px-3 py-2 rounded-full border border-stone-100 text-xs sm:text-sm">
                    <Icon name="MapPin" size={14} className="text-primary" />
                    <span>{addressLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary-container/30 px-3 py-2 rounded-full border border-stone-100 text-xs sm:text-sm">
                    <Icon name="CalendarDays" size={14} className="text-primary" />
                    <span>{profileMemberSince(user)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary-container/30 px-3 py-2 rounded-full border border-stone-100 text-xs sm:text-sm">
                    <Icon name="Star" size={14} className="text-primary" />
                    <span>{listingCount} active listing{listingCount === 1 ? '' : 's'}</span>
                  </div>
                </div>
                <div className="mt-5">
                  <Btn variant="outline" size="sm" onClick={() => go('address')}>
                    <Icon name="Pencil" size={14} /> Edit Profile
                  </Btn>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-xl overflow-hidden relative min-h-[220px] bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 shadow-[0_20px_40px_rgba(168,107,77,0.04)]">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0, transparent 50%)' }} />
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/80 rounded-xl border border-white/60 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-widest text-on-secondary-fixed-variant font-bold mb-1">Primary Address</p>
              <h3 className="font-headline-md text-stone-900 text-lg mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{areaLabel}</h3>
              <p className="text-sm text-stone-600">{[user.address_line1, user.city, user.state, user.pin].filter(Boolean).join(', ') || 'Add your full address from profile settings.'}</p>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="space-y-2">
              <h2 className="font-headline-md text-on-surface text-2xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>My Listings</h2>
              <p className="text-on-secondary-container text-sm sm:text-base">Manage your active rentals and equipment sharing status.</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 rounded-xl border border-outline-variant hover:bg-stone-50 transition-all" aria-label="Filter listings">
                <Icon name="SlidersHorizontal" size={16} />
              </button>
              <button onClick={() => go('list')} className="bg-on-surface text-surface px-5 py-3 rounded-xl font-button active:scale-95 transition-all" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                New Listing
              </button>
            </div>
          </div>

          {!!error && (
            <div className="rounded-2xl border border-coral/20 bg-coral-light px-4 py-3 text-sm text-coral-dark">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-14 text-center text-slate-soft">Loading your listings…</div>
          ) : listings.length === 0 ? (
            <div className="bg-white border border-stone-100 rounded-2xl p-10 text-center">
              <Icon name="PackageOpen" size={32} className="mx-auto text-primary mb-3" />
              <h3 className="text-xl font-semibold text-on-surface" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>No listings yet</h3>
              <p className="mt-2 text-on-secondary-container">Create your first listing to start earning from your gear.</p>
              <Btn variant="primary" size="md" className="mt-6" onClick={() => go('list')}>Start a New Listing</Btn>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {listings.map(listing => <ProfileListingCard key={listing.id} listing={listing} go={go} />)}
            </div>
          )}
        </section>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center px-4 py-2 bg-white/90 backdrop-blur-md z-40 border-t border-stone-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button onClick={() => go('home')} className="flex flex-col items-center text-stone-400 p-2 text-[10px] font-medium">
          <Icon name="Home" size={18} />
          <span>Home</span>
        </button>
        <button onClick={() => go('rent')} className="flex flex-col items-center text-stone-400 p-2 text-[10px] font-medium">
          <Icon name="Search" size={18} />
          <span>Browse</span>
        </button>
        <button onClick={() => go('list')} className="flex flex-col items-center text-stone-400 p-2 text-[10px] font-medium">
          <Icon name="PlusCircle" size={18} />
          <span>List</span>
        </button>
        <button onClick={() => go('profile')} className="flex flex-col items-center text-[#A86B4D] bg-stone-50 rounded-xl p-2 text-[10px] font-medium">
          <Icon name="UserRound" size={18} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

function AddressView({ go, user, onSaveAddress, saving = false, error = '' }) {
  const [form, setForm] = uSP({
    profile_description: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pin: '',
    phone_number: '',
    country: 'India',
  });
  const [localError, setLocalError] = uSP('');
  const returnView = user?.address_line1?.trim() ? 'profile' : 'home';

  uEP(() => {
    setForm({
      profile_description: user?.profile_description || '',
      address_line1: user?.address_line1 || '',
      address_line2: user?.address_line2 || '',
      city: user?.city || '',
      state: user?.state || '',
      pin: user?.pin || '',
      phone_number: user?.phone_number || '',
      country: user?.country || 'India',
    });
  }, [user]);

  const setField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');

    await onSaveAddress({
      profile_description: form.profile_description.trim() || null,
      address_line1: form.address_line1.trim() || null,
      address_line2: form.address_line2.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      pin: form.pin.trim() || null,
      phone_number: form.phone_number.trim() || null,
      country: form.country.trim() || null,
    });

    go(returnView);
  };

  if (!user) {
    return (
      <div className="view-fade min-h-screen pt-24 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-line/60 p-8 text-center">
            <Icon name="UserRound" size={36} className="mx-auto text-coral mb-4" />
            <h1 className="text-2xl font-bold text-indigo-deep">Sign in to manage your address</h1>
            <p className="mt-3 text-slate-soft">Your saved address is used for handoff and delivery details.</p>
            <Btn variant="outline" size="lg" className="mt-6" onClick={() => go('home')}>Back to Home</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-fade min-h-screen pt-24 pb-24 bg-cream/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => go(returnView)} className="text-sm text-slate-soft hover:text-indigo-deep inline-flex items-center gap-1.5 mb-5">
          <Icon name="ArrowLeft" size={14} /> Back
        </button>

        <div className="bg-white rounded-[28px] border border-slate-line/60 shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 py-7 border-b border-slate-line/60 bg-gradient-to-br from-white via-white to-coral-light/40">
            <Chip tone="coralSoft">Edit profile</Chip>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-indigo-deep">Address and bio</h1>
            <p className="mt-2 text-slate-soft max-w-xl">Update your profile description and delivery address details used across ShareHub.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-indigo-deep mb-2">Profile description</label>
              <textarea
                value={form.profile_description}
                onChange={event => setField('profile_description', event.target.value)}
                placeholder="Tell renters about your gear and hosting style"
                rows={3}
                className="w-full rounded-2xl border border-slate-line bg-white px-4 py-3 text-sm text-indigo-deep outline-none focus:border-coral resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-deep mb-2">Address line 1</label>
              <input
                value={form.address_line1}
                onChange={event => setField('address_line1', event.target.value)}
                placeholder="House / flat number, street"
                className="w-full rounded-2xl border border-slate-line bg-white px-4 py-3 text-sm text-indigo-deep outline-none focus:border-coral"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-deep mb-2">Address line 2</label>
              <input
                value={form.address_line2}
                onChange={event => setField('address_line2', event.target.value)}
                placeholder="Area, landmark, apartment name"
                className="w-full rounded-2xl border border-slate-line bg-white px-4 py-3 text-sm text-indigo-deep outline-none focus:border-coral"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-indigo-deep mb-2">City</label>
                <input
                  value={form.city}
                  onChange={event => setField('city', event.target.value)}
                  placeholder="Bengaluru"
                  className="w-full rounded-2xl border border-slate-line bg-white px-4 py-3 text-sm text-indigo-deep outline-none focus:border-coral"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-deep mb-2">State</label>
                <input
                  value={form.state}
                  onChange={event => setField('state', event.target.value)}
                  placeholder="Karnataka"
                  className="w-full rounded-2xl border border-slate-line bg-white px-4 py-3 text-sm text-indigo-deep outline-none focus:border-coral"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-indigo-deep mb-2">PIN code</label>
                <input
                  value={form.pin}
                  onChange={event => setField('pin', event.target.value)}
                  placeholder="560038"
                  className="w-full rounded-2xl border border-slate-line bg-white px-4 py-3 text-sm text-indigo-deep outline-none focus:border-coral"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-deep mb-2">Phone number</label>
                <input
                  value={form.phone_number}
                  onChange={event => setField('phone_number', event.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-2xl border border-slate-line bg-white px-4 py-3 text-sm text-indigo-deep outline-none focus:border-coral"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-indigo-deep mb-2">Country</label>
                <input
                  value={form.country}
                  onChange={event => setField('country', event.target.value)}
                  placeholder="India"
                  className="w-full rounded-2xl border border-slate-line bg-white px-4 py-3 text-sm text-indigo-deep outline-none focus:border-coral"
                />
              </div>
            </div>

            {(localError || error) && (
              <div className="rounded-2xl border border-coral/20 bg-coral-light px-4 py-3 text-sm text-coral-dark">
                {localError || error}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Btn type="submit" variant="primary" size="lg" disabled={saving}>
                <Icon name="MapPinned" size={16} /> {saving ? 'Saving address...' : 'Save Address'}
              </Btn>
              <Btn type="button" variant="outline" size="lg" onClick={() => go(returnView)}>Cancel</Btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AddressView, ProfileView });