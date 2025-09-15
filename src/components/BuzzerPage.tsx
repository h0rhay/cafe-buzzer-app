import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBuzzerByToken, type BuzzerWithMenuItems } from "../lib/api/buzzers";
import { CountdownTimer } from "./CountdownTimer";

export function BuzzerPage() {
  const { token } = useParams<{ token: string }>();
  const [buzzer, setBuzzer] = useState<BuzzerWithMenuItems | null | undefined>(undefined);

  useEffect(() => {
    if (!token) return;

    const fetchBuzzer = async () => {
      try {
        const data = await getBuzzerByToken(token);
        
        setBuzzer((prevBuzzer) => {
          // Debug log when ETA or timer visibility changes
          if (prevBuzzer && data) {
            if (prevBuzzer.eta !== data.eta) {
              console.log('📡 Buzzer page received ETA update:', {
                old: prevBuzzer.eta + 'min',
                new: data.eta + 'min',
                status: data.status
              });
            }
            if (prevBuzzer.showTimers !== data.showTimers) {
              console.log('🎛️ Timer visibility changed:', {
                from: prevBuzzer.showTimers,
                to: data.showTimers
              });
            }
          }
          return data;
        });
      } catch (error) {
        console.error('Failed to fetch buzzer:', error);
        setBuzzer(null);
      }
    };

    fetchBuzzer().catch((error) => {
      console.error('Initial buzzer fetch failed:', error);
    });
    
    // Poll for updates every 5 seconds to catch status changes quickly
    const interval = setInterval(() => {
      fetchBuzzer().catch((error) => {
        console.error('Periodic buzzer fetch failed:', error);
      });
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [token]);


  const getStatusColor = () => {
    if (!buzzer) return "bg-gray-500";
    
    switch (buzzer.status) {
      case "ready":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      case "picked_up":
        return "bg-gray-500";
      case "canceled":
        return "bg-red-500";
      case "expired":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    if (!buzzer) return "Loading...";
    
    switch (buzzer.status) {
      case "ready":
        return "Ready for Pickup!";
      case "active":
        return "Being Prepared";
      case "picked_up":
        return "Picked Up";
      case "canceled":
        return "Canceled";
      case "expired":
        return "Expired";
      default:
        return "Unknown Status";
    }
  };

  const getStatusIcon = () => {
    if (!buzzer) return "⏳";
    
    switch (buzzer.status) {
      case "ready":
        return "✅";
      case "active":
        return "👨‍🍳";
      case "picked_up":
        return "📦";
      case "canceled":
        return "❌";
      case "expired":
        return "⏰";
      default:
        return "❓";
    }
  };


  if (buzzer === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order status...</p>
        </div>
      </div>
    );
  }

  if (!buzzer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border p-8 text-center">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            We couldn't find an order with this buzzer code.
          </p>
          <p className="text-sm text-gray-500">
            Token: {token}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border overflow-hidden">
        {/* Status Header */}
        <div className={`${getStatusColor()} text-white p-6 text-center`}>
          <div className="text-6xl mb-2">{getStatusIcon()}</div>
          <h1 className="text-2xl font-bold mb-1">
            {getStatusText()}
          </h1>
          {buzzer.businessName && (
            <p className="text-white/80">
              {buzzer.businessName}
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="p-6">
          {/* Customer & Ticket Info */}
          {(buzzer.customer_name || buzzer.ticket) && (
            <div className="mb-4 pb-4 border-b">
              {buzzer.ticket && (
                <p className="text-lg font-semibold text-gray-900">
                  Order #{buzzer.ticket}
                </p>
              )}
              {buzzer.customer_name && (
                <p className="text-gray-600">
                  {buzzer.customer_name}
                </p>
              )}
            </div>
          )}

          {/* Countdown Timer */}
          <div className="flex flex-col items-center mb-6">
            <CountdownTimer
              startedAt={buzzer.started_at}
              etaMinutes={buzzer.eta}
              status={buzzer.status}
              size="large"
              showText={true}
              showTimers={buzzer.showTimers || false} // Use buzzer's showTimers property from business
            />
          </div>

          {/* Menu Items */}
          {buzzer.menuItems && buzzer.menuItems.length > 0 && (
            <div className="mb-4 pb-4 border-b">
              <h3 className="font-medium text-gray-900 mb-2">Your Order:</h3>
              <div className="space-y-1">
                {buzzer.menuItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-500">
                      ~{item.estimated_time} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Started:</span>
              <span className="font-medium">
                {new Date(buzzer.started_at).toLocaleTimeString()}
              </span>
            </div>
            
            {buzzer.ready_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ready at:</span>
                <span className="font-medium text-green-600">
                  {new Date(buzzer.ready_at).toLocaleTimeString()}
                </span>
              </div>
            )}
            
            {buzzer.picked_up_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Picked up:</span>
                <span className="font-medium">
                  {new Date(buzzer.picked_up_at).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          {/* Status Message */}
          {buzzer.status === "ready" && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium text-center">
                🎉 Your order is ready for pickup!
              </p>
            </div>
          )}
          
          {buzzer.status === "canceled" && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium text-center">
                ❌ This order has been canceled.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            This page updates automatically. Keep it open to track your order status.
          </p>
        </div>
      </div>
    </div>
  );
}