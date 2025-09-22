import { useEffect, useState, useCallback } from "react";
import { SignInForm } from "./components/SignInForm";
import { BusinessRegistration } from "./components/BusinessRegistration";
import { SignOutButton } from "./components/SignOutButton";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { NewBuzzer } from "./pages/NewBuzzer";
import { BuzzerPage } from "./pages/BuzzerPage";
import { BusinessSetup } from "./pages/BusinessSetup";
import { LandingPage } from "./pages/LandingPage";
import { MenuManagement } from "./pages/MenuManagement";
import { Settings } from "./pages/Settings";
import { EmailVerification } from "./pages/EmailVerification";
import { DebugMenu } from "./components/DebugMenu";
import { getCurrentUser, onAuthStateChange, type AuthUser } from "./lib/auth";
import { getUserBusiness, getBusinessBySlug, type Business } from "./lib/api/businesses";
import { useDebug } from "./hooks/useDebug";
import { FreshButton } from "./components/FreshButton";

export default function App() {
  const { isDebugMode } = useDebug();
  const [showDebugMenu, setShowDebugMenu] = useState(false);

  useEffect(() => {
    setShowDebugMenu(isDebugMode);
  }, [isDebugMode]);

  const handleCloseDebugMenu = useCallback(() => {
    setShowDebugMenu(false);
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col" style={{backgroundColor: 'var(--fresh-surface-muted)'}}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/demo" element={<Dashboard />} />
              <Route path="/verify" element={<EmailVerification />} />
              <Route path="/app/*" element={<AuthenticatedApp />} />
              {/* Business slug routes */}
              <Route path="/:businessSlug/b/:token" element={<BuzzerPage />} />
              <Route path="/:businessSlug/*" element={<BusinessApp />} />
              {/* Legacy buzzer route for backward compatibility */}
              <Route path="/b/:token" element={<BuzzerPage />} />
            </Routes>
        <Toaster />
        {showDebugMenu && (
          <DebugMenu onClose={handleCloseDebugMenu} />
        )}
      </div>
    </Router>
  );
}

function AuthenticatedApp() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to get current user:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{borderColor: 'var(--fresh-primary)'}}></div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4" style={{backgroundColor: 'var(--fresh-surface)', borderColor: 'var(--fresh-border)'}}>
        <Link to="/app/dashboard" className="text-xl fresh-text-brand hover:opacity-80 transition-opacity" style={{color: 'var(--fresh-primary)'}}>
          Cafe Buzzer
        </Link>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4">
            {user ? (
              <AuthenticatedRoutes />
            ) : (
              <AuthenticationFlow />
            )}
      </main>
    </>
  );
}

function AuthenticationFlow() {
  const [showRegistration, setShowRegistration] = useState(false);

  if (showRegistration) {
    return (
      <BusinessRegistration
        onSuccess={() => {
          // After successful registration, show success message
          setShowRegistration(false);
        }}
        onSignInClick={() => setShowRegistration(false)}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <SignInForm
        onSignUpClick={() => setShowRegistration(true)}
      />
    </div>
  );
}

interface AuthenticatedRoutesProps {}

function AuthenticatedRoutes({}: AuthenticatedRoutesProps) {
  const [business, setBusiness] = useState<Business | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    getUserBusiness()
      .then(setBusiness)
      .catch((error) => {
        console.error('Failed to get user business:', error);
        setBusiness(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBusinessCreated = useCallback((newBusiness: Business) => {
    setBusiness(newBusiness);
    setShowRegistration(false);
    // Redirect to the business slug URL
    window.location.href = `/${newBusiness.slug}/dashboard`;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{borderColor: 'var(--fresh-primary)'}}></div>
      </div>
    );
  }

  if (!business) {
    return <BusinessSetup onBusinessCreated={handleBusinessCreated} />;
  }

  return (
    <div className="flex">
      <nav className="w-64 rounded-lg shadow-sm p-4 mr-6 h-fit" style={{backgroundColor: 'var(--fresh-surface)', borderRadius: 'var(--fresh-radius-lg)'}}>
        <div className="space-y-2">
          <Link
            to="/app/settings"
            className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
            style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
          >
            ⚙️ Settings
          </Link>
          <Link
            to="/app/security"
            className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
            style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
          >
            🔒 Security
          </Link>
          <Link
            to="/app/account"
            className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
            style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
          >
            👤 Account
          </Link>
          <Link
            to="/app/menu"
            className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
            style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
          >
            🍽️ Menu Items
          </Link>
          <Link
            to="/app/timings"
            className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
            style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
          >
            ⏱️ Timings and Buzzer Settings
          </Link>
        </div>
      </nav>
      
      <div className="flex-1">
        <Routes>
          <Route path="/dashboard" element={<Dashboard business={business} />} />
          <Route path="/new" element={<NewBuzzer business={business} />} />
          <Route path="/menu" element={<MenuManagement business={business} />} />
          <Route path="/settings" element={<Settings business={business} />} />
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// Business App component that handles slug-based routing
function BusinessApp() {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [business, setBusiness] = useState<Business | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Get current user first
    getCurrentUser().then((user) => {
      setUser(user);
      if (!user) {
        setLoading(false);
        return;
      }

      // Then get business by slug
      if (businessSlug) {
        getBusinessBySlug(businessSlug)
          .then(setBusiness)
          .catch((error) => {
            console.error('Failed to get business by slug:', error);
            setBusiness(null);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Failed to get current user:', error);
      setUser(null);
      setLoading(false);
    });
  }, [businessSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{borderColor: 'var(--fresh-primary)'}}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/app" replace />;
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--fresh-surface-muted)'}}>
        <div className="max-w-md w-full shadow-sm border p-8 text-center" style={{backgroundColor: 'var(--fresh-surface)', borderColor: 'var(--fresh-border)', borderRadius: 'var(--fresh-radius-lg)'}}>
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold mb-4 fresh-text-brand" style={{color: 'var(--fresh-text-primary)'}}>
            Business Not Found
          </h1>
          <p className="mb-6" style={{color: 'var(--fresh-text-secondary)'}}>
            The business "{businessSlug}" doesn't exist or you don't have access to it.
          </p>
          <FreshButton variant="primary" onClick={() => window.location.href = '/app'}>
            Go to Dashboard
          </FreshButton>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4" style={{backgroundColor: 'var(--fresh-surface)', borderColor: 'var(--fresh-border)'}}>
        <Link to={`/${businessSlug}/dashboard`} className="text-xl fresh-text-brand hover:opacity-80 transition-opacity" style={{color: 'var(--fresh-primary)'}}>
          {business.name}
        </Link>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4">
        <div className="flex">
          <nav className="w-64 rounded-lg shadow-sm p-4 mr-6 h-fit" style={{backgroundColor: 'var(--fresh-surface)', borderRadius: 'var(--fresh-radius-lg)'}}>
            <div className="space-y-2">
              <Link
                to={`/${businessSlug}/settings`}
                className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
                style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
              >
                ⚙️ Settings
              </Link>
              <Link
                to={`/${businessSlug}/security`}
                className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
                style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
              >
                🔒 Security
              </Link>
              <Link
                to={`/${businessSlug}/account`}
                className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
                style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
              >
                👤 Account
              </Link>
              <Link
                to={`/${businessSlug}/menu`}
                className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
                style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
              >
                🍽️ Menu Items
              </Link>
              <Link
                to={`/${businessSlug}/timings`}
                className="block px-3 py-2 rounded-lg font-medium uppercase tracking-wide text-sm transition-colors hover:opacity-80"
                style={{color: 'var(--fresh-text-primary)', borderRadius: 'var(--fresh-radius)'}}
              >
                ⏱️ Timings and Buzzer Settings
              </Link>
            </div>
          </nav>
          
          <div className="flex-1">
            <Routes>
              <Route path="/dashboard" element={<Dashboard business={business} />} />
              <Route path="/new" element={<NewBuzzer business={business} />} />
              <Route path="/menu" element={<MenuManagement business={business} />} />
              <Route path="/settings" element={<Settings business={business} />} />
              <Route path="/" element={<Navigate to={`/${businessSlug}/dashboard`} replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </>
  );
}