// Root app — view switcher
const { useState: uSApp, useEffect: uEApp } = React;
const API_BASE = window.SHAREHUB_API_BASE || 'http://localhost:4000';
const GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID || '';
const AUTH_SESSION_KEY = 'sharehub.auth.session';
const LEGACY_AUTH_USER_KEY = 'sharehub.auth.user';

function App() {
  const [view, setView] = uSApp('home');
  const [selectedListing, setSelectedListing] = uSApp(null);
  const [selectedBrowseCategory, setSelectedBrowseCategory] = uSApp('all');
  const [wishlist, setWishlist] = uSApp(new Set());

  const toggleWish = (id) => setWishlist(w => {
    const n = new Set(w); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const [fireConfetti, setFireConfetti] = uSApp(false);
  const [mounted, setMounted] = uSApp(false);
  const [session, setSession] = uSApp(null);
  const [authError, setAuthError] = uSApp('');
  const [gisReady, setGisReady] = uSApp(false);
  const [addressSaving, setAddressSaving] = uSApp(false);
  const [addressError, setAddressError] = uSApp('');
  const [publicListings, setPublicListings] = uSApp([]);
  const [publicListingsLoading, setPublicListingsLoading] = uSApp(true);
  const [publicListingsError, setPublicListingsError] = uSApp('');
  const [myListings, setMyListings] = uSApp([]);
  const [myListingsLoading, setMyListingsLoading] = uSApp(false);
  const [myListingsError, setMyListingsError] = uSApp('');

  const user = session?.user || null;
  const accessToken = session?.access_token || '';

  const persistSession = (nextSession) => {
    setSession(nextSession);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession));
    localStorage.removeItem(LEGACY_AUTH_USER_KEY);
  };

  const userHasAddress = (candidate) => !!candidate?.address_line1?.trim();

  uEApp(() => { setMounted(true); }, []);

  uEApp(() => {
    try {
      const rawSession = localStorage.getItem(AUTH_SESSION_KEY);
      if (rawSession) {
        setSession(JSON.parse(rawSession));
        return;
      }

      const rawUser = localStorage.getItem(LEGACY_AUTH_USER_KEY);
      if (rawUser) setSession({ user: JSON.parse(rawUser) });
    } catch (err) {
      console.error('Failed to restore auth session', err);
    }
  }, []);

  async function loadPublicListings() {
    setPublicListingsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/listings`);
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) throw new Error('Unable to load listings.');
      setPublicListings(data);
      setPublicListingsError('');
    } catch (err) {
      console.error('Public listings error:', err);
      setPublicListings([]);
      setPublicListingsError('Unable to load public listings. Ensure backend and database are running.');
    } finally {
      setPublicListingsLoading(false);
    }
  }

  async function loadMyListings(token = accessToken) {
    if (!token) {
      setMyListings([]);
      setMyListingsError('');
      setMyListingsLoading(false);
      return;
    }

    setMyListingsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/listings/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        throw new Error(data.detail || 'Unable to load your listings.');
      }
      setMyListings(data);
      setMyListingsError('');
    } catch (err) {
      console.error('My listings error:', err);
      setMyListings([]);
      setMyListingsError(err.message || 'Unable to load your listings.');
    } finally {
      setMyListingsLoading(false);
    }
  }

  async function loadCurrentUser(token = accessToken) {
    if (!token) return null;

    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Unable to load your profile.');
    }

    const nextSession = {
      ...(session || {}),
      user: data,
      access_token: token,
      token_type: session?.token_type || 'bearer',
    };
    persistSession(nextSession);
    return data;
  }

  uEApp(() => {
    loadPublicListings();
  }, []);

  uEApp(() => {
    loadMyListings(accessToken);
  }, [accessToken]);

  uEApp(() => {
    if (!accessToken) return;

    loadCurrentUser(accessToken)
      .then(currentUser => {
        if (!userHasAddress(currentUser)) {
          setView('address');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      })
      .catch(err => {
        console.error('Profile load error:', err);
      });
  }, [accessToken]);

  uEApp(() => {
    let attempts = 0;
    const maxAttempts = 40;
    const timer = setInterval(() => {
      attempts += 1;
      const hasGoogle = window.google && window.google.accounts && window.google.accounts.id;
      if (!hasGoogle) {
        if (attempts >= maxAttempts) {
          setAuthError('Google Sign-In script did not load. Refresh and try again.');
          clearInterval(timer);
        }
        return;
      }

      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
        setAuthError('Set a valid GOOGLE_CLIENT_ID in frontend/index.html to enable Google Sign-In.');
        clearInterval(timer);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
      });
      setGisReady(true);
      setAuthError('');
      clearInterval(timer);
    }, 250);

    return () => clearInterval(timer);
  }, []);

  async function handleCredentialResponse(response) {
    if (!response || !response.credential) {
      setAuthError('Google Sign-In failed. Please try again.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (!res.ok || !data.user || !data.access_token) {
        throw new Error(data.detail || 'Authentication failed');
      }

      const nextSession = {
        user: data.user,
        access_token: data.access_token,
        token_type: data.token_type || 'bearer',
      };

      persistSession(nextSession);
      setAuthError('');

      if (!userHasAddress(data.user)) {
        setView('address');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setAuthError('Unable to verify your Google account. Ensure backend is running on port 4000.');
    }
  }

  const signOut = () => {
    setSession(null);
    setMyListings([]);
    setAddressError('');
    setAuthError('');
    setView('home');
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(LEGACY_AUTH_USER_KEY);
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  async function saveAddress(addressPayload) {
    if (!accessToken) throw new Error('Sign in again to manage your address.');

    setAddressSaving(true);
    setAddressError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/me/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(addressPayload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Unable to save your address.');
      }

      persistSession({
        ...(session || {}),
        user: data,
        access_token: accessToken,
        token_type: session?.token_type || 'bearer',
      });
      setView('home');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return data;
    } catch (err) {
      setAddressError(err.message || 'Unable to save your address.');
      throw err;
    } finally {
      setAddressSaving(false);
    }
  }

  async function saveListing({ listingId, formState }) {
    if (!accessToken) throw new Error('Sign in again to manage listings.');

    const res = await fetch(
      listingId ? `${API_BASE}/api/listings/${listingId}` : `${API_BASE}/api/listings`,
      {
        method: listingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(listingStateToPayload(formState)),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Unable to save listing.');
    }

    await Promise.all([loadPublicListings(), loadMyListings(accessToken)]);
    return data;
  }

  const go = (v, data) => {
    setView(v);

    if (v === 'listing-detail') {
      setSelectedListing(data || null);
    } else {
      setSelectedListing(null);
    }

    if (v === 'rent') {
      if (typeof data === 'string' && data.trim()) {
        setSelectedBrowseCategory(data);
      } else {
        setSelectedBrowseCategory('all');
      }
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className={`transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <ConfettiSH fire={fireConfetti} />
      {view !== 'list' && (
        <Navbar
          go={go}
          currentView={view}
          user={user}
          gisReady={gisReady}
          onSignOut={signOut}
        />
      )}
      {!!authError && (
        <div className="fixed top-16 inset-x-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="mt-2 rounded-xl bg-coral-light text-coral-dark text-xs sm:text-sm px-4 py-2 border border-coral/30">
              {authError}
            </div>
          </div>
        </div>
      )}
      <main key={view}>
        {view === 'home' && <HomeView go={go} />}
        {view === 'address' && (
          <AddressView
            go={go}
            user={user}
            onSaveAddress={saveAddress}
            saving={addressSaving}
            error={addressError}
          />
        )}
        {view === 'rent' && (
          <RentView
            go={go}
            listings={publicListings}
            loading={publicListingsLoading}
            error={publicListingsError}
            initialFilter={selectedBrowseCategory}
            wishlist={wishlist}
            onToggleWish={toggleWish}
          />
        )}
        {view === 'listing-detail' && (
          <ListingDetailView
            listing={selectedListing}
            go={go}
            isWished={selectedListing && wishlist.has(selectedListing.id)}
            onToggleWish={toggleWish}
          />
        )}
        {view === 'list' && (
          <ListView
            go={go}
            user={user}
            accessToken={accessToken}
            myListings={myListings}
            myListingsLoading={myListingsLoading}
            myListingsError={myListingsError}
            onSaveListing={saveListing}
            fireConfetti={fireConfetti}
            setFireConfetti={setFireConfetti}
          />
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
