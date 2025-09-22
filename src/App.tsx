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
      <div className="min-h-screen flex flex-col bg-gray-50">
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <Link to="/app/dashboard" className="text-xl font-semibold text-blue-600 hover:text-blue-700">
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return <BusinessSetup onBusinessCreated={handleBusinessCreated} />;
  }

  return (
    <div className="flex">
      <nav className="w-64 bg-white rounded-lg shadow-sm p-4 mr-6 h-fit">
        <div className="space-y-2">
          <Link
            to="/app/dashboard"
            className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            📊 Dashboard
          </Link>
          <Link
            to="/app/new"
            className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ➕ New Buzzer
          </Link>
          <Link
            to="/app/menu"
            className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            🍽️ Menu Items
          </Link>
          <Link
            to="/app/settings"
            className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ⚙️ Settings
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/app" replace />;
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Business Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The business "{businessSlug}" doesn't exist or you don't have access to it.
          </p>
          <Link
            to="/app"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <Link to={`/${businessSlug}/dashboard`} className="text-xl font-semibold text-blue-600 hover:text-blue-700">
          {business.name}
        </Link>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4">
        <div className="flex">
          <nav className="w-64 bg-white rounded-lg shadow-sm p-4 mr-6 h-fit">
            <div className="space-y-2">
              <Link
                to={`/${businessSlug}/dashboard`}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                to={`/${businessSlug}/new`}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ➕ New Buzzer
              </Link>
              <Link
                to={`/${businessSlug}/menu`}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                🍽️ Menu Items
              </Link>
              <Link
                to={`/${businessSlug}/settings`}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ⚙️ Settings
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