import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { useDebug } from "../hooks/useDebug";
import type { BuzzerWithMenuItems } from "../lib/api/buzzers";
import { QRCodeModal } from "../components/QRCodeModal";
import { CountdownTimer } from "../components/CountdownTimer";
import type { Business } from "../lib/api/businesses";

// Generate a random token for public access
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

interface DashboardProps {
  business?: Pick<Business, 'id' | 'name' | 'slug'> | null;
}

interface DashboardBusiness {
  id: string;
  name: string;
  slug: string;
  default_eta: number;
  show_timers: boolean;
}

export function Dashboard({ business: propBusiness }: DashboardProps = {}) {
  const [buzzers, setBuzzers] = useState<BuzzerWithMenuItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedBuzzerToken, setSelectedBuzzerToken] = useState<string | null>(null);
  const [business, setBusiness] = useState<DashboardBusiness | null>(null);
  const { debugLog, debugError } = useDebug();

  const fetchBusinessSettings = useCallback(async () => {
    try {
      const businessId = propBusiness?.id || '10000000-0000-0000-0000-000000000001';
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      setBusiness(data);
      debugLog('Business settings loaded:', data);
    } catch (error) {
      debugError('Failed to fetch business settings:', error);
    }
  }, [propBusiness?.id, debugLog, debugError]);

  const fetchDemoBuzzers = useCallback(async () => {
    debugLog('Fetching demo buzzers...');
    debugLog('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    debugLog('Using supabase client URL');
    try {
      const businessId = propBusiness?.id || '10000000-0000-0000-0000-000000000001';
      // Get all buzzers for the business
      const { data: buzzerData, error } = await supabase
        .from('buzzers')
        .select(`
          *,
          businesses(name)
        `)
        .eq('business_id', businessId)
        .in('status', ['active', 'ready'])
        .order('created_at', { ascending: false });

      if (error) {
        debugError('Supabase query error:', error);
        throw error;
      }
      
      debugLog('Found buzzers:', buzzerData?.length);

      // Get menu items for each buzzer
      const buzzersWithMenuItems = await Promise.all(
        (buzzerData || []).map(async (buzzer) => {
          let menuItems = [];
          if (buzzer.menu_item_ids && buzzer.menu_item_ids.length > 0) {
            const { data: items } = await supabase
              .from('menu_items')
              .select('*')
              .in('id', buzzer.menu_item_ids);
            
            menuItems = items || [];
          }
          
          return {
            ...buzzer,
            menuItems,
            businessName: buzzer.businesses?.name
          };
        })
      );

      setBuzzers(buzzersWithMenuItems);
      debugLog('Successfully loaded buzzers with menu items');
    } catch (error) {
      debugError('Error fetching demo buzzers:', error);
      console.error('Failed to fetch demo buzzers:', error);
      toast.error('Failed to load demo data');
    } finally {
      setLoading(false);
    }
  }, [propBusiness?.id, debugLog, debugError]);

  useEffect(() => {
    void fetchDemoBuzzers();
    void fetchBusinessSettings();
    
    // Refresh every 10 seconds for demo
    const interval = setInterval(() => void fetchDemoBuzzers(), 10000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchDemoBuzzers, fetchBusinessSettings]);

  const getTimeRemaining = useCallback((buzzer: BuzzerWithMenuItems) => {
    const startTime = new Date(buzzer.started_at).getTime();
    const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const remaining = Math.max(0, buzzer.eta - elapsed);
    return Math.ceil(remaining);
  }, []);

  // Memoized calculations for performance
  const _buzzerStats = useMemo(() => {
    const overdueBuzzers = buzzers.filter(buzzer => {
      const timeRemaining = getTimeRemaining(buzzer);
      return timeRemaining <= 0 && buzzer.status === 'active';
    });
    
    const activeBuzzers = buzzers.filter(buzzer => buzzer.status === 'active');
    const readyBuzzers = buzzers.filter(buzzer => buzzer.status === 'ready');
    
    return {
      overdue: overdueBuzzers.length,
      active: activeBuzzers.length,
      ready: readyBuzzers.length,
      total: buzzers.length
    };
  }, [buzzers, getTimeRemaining]);


  // Auto-ready callback for countdown timer
  const handleTimerExpired = useCallback(async (buzzerId: string) => {
    try {
      debugLog('Timer expired, marking buzzer as ready:', buzzerId);
      await supabase
        .from('buzzers')
        .update({
          status: 'ready',
          ready_at: new Date().toISOString()
        })
        .eq('id', buzzerId);

      // Find the buzzer to show success message
      const expiredBuzzer = buzzers.find(b => b.id === buzzerId);
      if (expiredBuzzer) {
        toast.success(`🎉 Order ${expiredBuzzer.ticket} is ready!`);
      }
      
      void fetchDemoBuzzers();
    } catch (error) {
      debugError('Failed to auto-transition buzzer on timer expiry:', error);
    }
  }, [buzzers, debugLog, debugError, fetchDemoBuzzers]);

  const handleMarkReady = useCallback(async (buzzer: BuzzerWithMenuItems) => {
    try {
      debugLog('Manually marking buzzer as ready:', buzzer.id);
      
      // Direct database update since this is for demo purposes (no auth required)
      const { error } = await supabase
        .from('buzzers')
        .update({ 
          status: 'ready',
          ready_at: new Date().toISOString()
        })
        .eq('id', buzzer.id);
      
      if (error) {
        debugError('Supabase error:', error);
        throw error;
      }
      
      debugLog('Successfully marked buzzer as ready');
      void fetchDemoBuzzers();
      toast.success(`Order ${buzzer.ticket} marked as ready!`);
    } catch (error) {
      debugError('Failed to mark buzzer as ready:', error);
      console.error('Mark ready error:', error);
      toast.error(`Failed to mark order as ready: ${(error as any)?.message || 'Unknown error'}`);
    }
  }, [debugLog, debugError, fetchDemoBuzzers]);

  const handleUpdateDefaultEta = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!business) return;
    
    try {
      const newDefaultEta = parseInt(e.target.value);
      
      const businessId = propBusiness?.id || '10000000-0000-0000-0000-000000000001';
      await supabase
        .from('businesses')
        .update({ default_eta: newDefaultEta })
        .eq('id', businessId);
      
      setBusiness({ ...business, default_eta: newDefaultEta });
      toast.success(`Default wait time updated to ${newDefaultEta} minutes`);
    } catch (error) {
      debugError('Failed to update default ETA:', error);
      toast.error('Failed to update default wait time');
    }
  }, [business, propBusiness?.id, debugError]);

  const handleToggleShowTimers = async () => {
    const businessId = propBusiness?.id || '10000000-0000-0000-0000-000000000001';
    
    if (!business) {
      debugError('No business data available');
      return;
    }
    
    try {
      const newShowTimers = !business.show_timers;
      
      const { error } = await supabase
        .from('businesses')
        .update({ show_timers: newShowTimers })
        .eq('id', businessId);
      
      if (error) {
        debugError('Database update error:', error);
        throw error;
      }
      
      setBusiness({ ...business, show_timers: newShowTimers });
      toast.success(`Customer timers ${newShowTimers ? 'enabled' : 'disabled'}`);
      
    } catch (error) {
      debugError('Failed to toggle show timers:', error);
      toast.error('Failed to update timer setting');
    }
  };

  const handleShowQR = useCallback((buzzer: BuzzerWithMenuItems) => {
    setSelectedBuzzerToken(buzzer.public_token);
    setShowQRModal(true);
  }, []);


  const handleAdjustTime = async (buzzer: BuzzerWithMenuItems, minutes: number) => {
    try {
      debugLog(`Adjusting buzzer time by ${minutes} minutes:`, buzzer.id);
      
      const newEta = Math.max(1, buzzer.eta + minutes); // Minimum 1 minute
      
      const { error } = await supabase
        .from('buzzers')
        .update({ eta: newEta })
        .eq('id', buzzer.id);
      
      if (error) {
        debugError('Supabase error:', error);
        throw error;
      }
      
      debugLog('Successfully adjusted buzzer time');
      void fetchDemoBuzzers();
      toast.success(`Order ${buzzer.ticket} time ${minutes > 0 ? 'increased' : 'decreased'} by ${Math.abs(minutes)} minute${Math.abs(minutes) !== 1 ? 's' : ''}!`);
    } catch (error) {
      debugError('Failed to adjust buzzer time:', error);
      console.error('Adjust time error:', error);
      toast.error(`Failed to adjust time: ${(error as any)?.message || 'Unknown error'}`);
    }
  };

  const handleCancel = async (buzzer: BuzzerWithMenuItems) => {
    if (!confirm(`Are you sure you want to cancel order ${buzzer.ticket}?`)) {
      return;
    }
    
    try {
      debugLog('Cancelling buzzer:', buzzer.id);
      
      const { error } = await supabase
        .from('buzzers')
        .update({ status: 'canceled' })
        .eq('id', buzzer.id);
      
      if (error) {
        debugError('Supabase error:', error);
        throw error;
      }
      
      debugLog('Successfully cancelled buzzer');
      void fetchDemoBuzzers();
      toast.success(`Order ${buzzer.ticket} cancelled`);
    } catch (error) {
      debugError('Failed to cancel buzzer:', error);
      console.error('Cancel error:', error);
      toast.error(`Failed to cancel order: ${(error as any)?.message || 'Unknown error'}`);
    }
  };


  const createNewBuzzer = async () => {
    try {
      const publicToken = generateToken();
      const ticketNumber = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
      const customerNames = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Emma Davis'];
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      
      // Create buzzer in database
      const { error } = await supabase
        .from('buzzers')
        .insert({
          business_id: propBusiness?.id || '10000000-0000-0000-0000-000000000001',
          public_token: publicToken,
          ticket: ticketNumber,
          customer_name: customerName,
          menu_item_ids: ['30000000-0000-0000-0000-000000000001'],
          eta: business?.default_eta || 5, // Use business default or 5 minutes
          started_at: new Date().toISOString(),
          status: 'active',
        });

      if (error) throw error;

      // Open buzzer page in new tab with business slug
      const buzzerUrl = business?.slug ? `/${business.slug}/b/${publicToken}` : `/b/${publicToken}`;
      window.open(buzzerUrl, '_blank');
      
      // Refresh the dashboard
      void fetchDemoBuzzers();
      
      toast.success('New buzzer created! Check the new tab.');
    } catch (error) {
      console.error('Failed to create buzzer:', error);
      toast.error('Failed to create buzzer');
    }
  };

  const handleDemoAction = (actionName: string) => {
    toast.success(`This is a demo! In the real app, this would ${actionName}.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">🎭 Live Demo - Demo Cafe Dashboard</h1>
            <p className="text-blue-100 text-sm">This is a live demo showing real functionality</p>
          </div>
          <Link
            to="/"
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6 mt-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{business?.name || 'Demo Cafe'}</h2>
            <p className="text-gray-600">Active Buzzers Dashboard</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Default Wait Time Setting */}
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="default-wait-time" className="text-gray-700">
                Default wait time:
              </label>
              <select
                id="default-wait-time"
                value={business?.default_eta || 5}
                onChange={(e) => void handleUpdateDefaultEta(e)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={3}>3 minutes</option>
                <option value={5}>5 minutes</option>
                <option value={7}>7 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
              </select>
            </div>

            {/* Show Timers Toggle */}
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="show-timers" className="text-gray-700">
                Show customer timers:
              </label>
              <button
                id="show-timers"
                onClick={() => void handleToggleShowTimers()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  business?.show_timers ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    business?.show_timers ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-xs text-gray-500">
                {business?.show_timers ? 'ON' : 'OFF'}
              </span>
            </div>
            
            <button
              onClick={() => void createNewBuzzer()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Buzzer
            </button>
          </div>
        </div>

        {buzzers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">No active buzzers</h3>
            <p className="text-gray-600 mb-4">Demo data may be loading or expired</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Demo
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {buzzers.map((buzzer) => {
              const timeRemaining = getTimeRemaining(buzzer);
              const isOverdue = timeRemaining <= 0 && buzzer.status === "active";
              
              return (
                <div
                  key={buzzer.id}
                  className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
                    buzzer.status === "ready"
                      ? "border-green-500"
                      : isOverdue
                      ? "border-red-500"
                      : "border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">
                          {buzzer.ticket && `#${buzzer.ticket}`}
                          {buzzer.customer_name && ` - ${buzzer.customer_name}`}
                          {!buzzer.ticket && !buzzer.customer_name && "Order"}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            buzzer.status === "ready"
                              ? "bg-green-100 text-green-800"
                              : isOverdue
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {buzzer.status === "ready"
                            ? "Ready"
                            : isOverdue
                            ? "Overdue"
                            : "Active"}
                        </span>
                      </div>
                      
                      {buzzer.menuItems && buzzer.menuItems.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">
                            Items: {buzzer.menuItems.map((item: any) => item.name).join(", ")}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          Started: {new Date(buzzer.started_at).toLocaleTimeString()}
                        </span>
                        <a
                          href={`/b/${buzzer.public_token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          View Customer Page
                        </a>
                      </div>
                    </div>
                    
                    {/* Countdown Timer */}
                    <div className="flex items-center mr-4">
                      <CountdownTimer
                        startedAt={buzzer.started_at}
                        etaMinutes={buzzer.eta}
                        status={buzzer.status}
                        size="small"
                        showText={true}
                        showTimers={true} // Dashboard always shows timers for staff
                        onExpired={() => void handleTimerExpired(buzzer.id)}
                        buzzerId={buzzer.id}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShowQR(buzzer)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        📱 QR Code
                      </button>
                      
                      {buzzer.status === "active" && (
                        <>
                          <button
                            onClick={() => void handleAdjustTime(buzzer, -5)}
                            className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                          >
                            ⏰ -5 min
                          </button>
                          <button
                            onClick={() => void handleAdjustTime(buzzer, 5)}
                            className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                          >
                            ⏰ +5 min
                          </button>
                          <button
                            onClick={() => void handleMarkReady(buzzer)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            ✅ Mark Ready
                          </button>
                          <button
                            onClick={() => void handleCancel(buzzer)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            ❌ Cancel
                          </button>
                        </>
                      )}
                      
                      {buzzer.status === "ready" && (
                        <button
                          onClick={() => handleDemoAction('mark as picked up')}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Picked Up
                        </button>
                      )}
                    
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo Info Panel */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🎭 Demo Features</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Live Data</h4>
              <p className="text-blue-700">This dashboard shows real data from the database with live countdown timers.</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Interactive Buttons</h4>
              <p className="text-blue-700">Click any button to see demo feedback - in the real app these would update the database.</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Customer View</h4>
              <p className="text-blue-700">Click "View Customer Page" links to see what customers see on their phones.</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Auto-Refresh</h4>
              <p className="text-blue-700">The dashboard automatically refreshes every 10 seconds to show live updates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedBuzzerToken && (
        <QRCodeModal 
          token={selectedBuzzerToken}
          businessSlug={business?.slug}
          onClose={() => {
            setShowQRModal(false);
            setSelectedBuzzerToken(null);
          }} 
        />
      )}
    </div>
  );
}