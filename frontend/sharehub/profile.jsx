const { useState: uSP, useEffect: uEP } = React;

function AddressView({ go, user, onSaveAddress, saving = false, error = '' }) {
  const [form, setForm] = uSP({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
  });
  const [localError, setLocalError] = uSP('');

  uEP(() => {
    setForm({
      address_line1: user?.address_line1 || '',
      address_line2: user?.address_line2 || '',
      city: user?.city || '',
      state: user?.state || '',
      pin: user?.pin || '',
      country: user?.country || 'India',
    });
  }, [user]);

  const setField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (!form.address_line1.trim() || !form.city.trim() || !form.state.trim() || !form.pin.trim() || !form.country.trim()) {
      setLocalError('Please fill in the required address fields.');
      return;
    }

    await onSaveAddress({
      address_line1: form.address_line1.trim(),
      address_line2: form.address_line2.trim() || null,
      city: form.city.trim(),
      state: form.state.trim(),
      pin: form.pin.trim(),
      country: form.country.trim(),
    });
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
        <button onClick={() => go('home')} className="text-sm text-slate-soft hover:text-indigo-deep inline-flex items-center gap-1.5 mb-5">
          <Icon name="ArrowLeft" size={14} /> Back to Home
        </button>

        <div className="bg-white rounded-[28px] border border-slate-line/60 shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 py-7 border-b border-slate-line/60 bg-gradient-to-br from-white via-white to-coral-light/40">
            <Chip tone="coralSoft">Profile</Chip>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-indigo-deep">Your address</h1>
            <p className="mt-2 text-slate-soft max-w-xl">Add the address you use for pickups, deliveries, and account verification. You can update it anytime.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-7 space-y-5">
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
              <Btn type="button" variant="outline" size="lg" onClick={() => go('home')}>Cancel</Btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AddressView });