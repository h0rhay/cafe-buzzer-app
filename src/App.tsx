import { useEffect, useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { NewBuzzer } from "./components/NewBuzzer";
import { BuzzerPage } from "./components/BuzzerPage";
import { BusinessSetup } from "./components/BusinessSetup";
import { LandingPage } from "./components/LandingPage";
import { MenuManagement } from "./components/MenuManagement";
import { Settings } from "./components/Settings";
import { DebugMenu } from "./components/DebugMenu";
import { getCurrentUser, onAuthStateChange, type AuthUser } from "./lib/auth";
import { getUserBusiness, type Business } from "./lib/api/businesses";
import { useDebug } from "./hooks/useDebug";

export default function App() {
  const { isDebugMode } = useDebug();
  const [showDebugMenu, setShowDebugMenu] = useState(false);

  useEffect(() => {
    setShowDebugMenu(isDebugMode);
  }, [isDebugMode]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<Dashboard />} />
          <Route path="/b/:token" element={<BuzzerPage />} />
          <Route path="/app/*" element={<AuthenticatedApp />} />
        </Routes>
        <Toaster />
        {showDebugMenu && (
          <DebugMenu onClose={() => setShowDebugMenu(false)} />
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
          <div className="max-w-md mx-auto mt-8">
            <SignInForm />
          </div>
        )}
      </main>
    </>
  );
}

function AuthenticatedRoutes() {
  const [business, setBusiness] = useState<Business | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserBusiness()
      .then(setBusiness)
      .catch((error) => {
        console.error('Failed to get user business:', error);
        setBusiness(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return <BusinessSetup onBusinessCreated={(newBusiness) => setBusiness(newBusiness)} />;
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