import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getBuzzerByToken, type BuzzerWithMenuItems, type BuzzerStatus } from "../lib/api/buzzers";
import { CountdownTimer } from "../components/CountdownTimer";
import { FreshStatusBadge } from "../components/FreshStatusBadge";

// Status color and icon mapping for consistent UI
const STATUS_CONFIG = {
  active: { variant: "highlight" as const, icon: "👨‍🍳" },
  ready: { variant: "success" as const, icon: "✅" },
  picked_up: { variant: "time" as const, icon: "📦" },
  canceled: { variant: "error" as const, icon: "❌" },
  expired: { variant: "time" as const, icon: "⏰" }
} as const;

export function BuzzerPage() {
  const { token, businessSlug } = useParams<{ token: string; businessSlug?: string }>();
  const [buzzer, setBuzzer] = useState<BuzzerWithMenuItems | null | undefined>(undefined);

  const fetchBuzzer = useCallback(async () => {
    if (!token) return;
    
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
  }, [token]);

  useEffect(() => {
    fetchBuzzer();
    
    // Poll for updates every 5 seconds to catch status changes quickly
    const interval = setInterval(fetchBuzzer, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [fetchBuzzer]);


  // Memoized status information for better performance
  const statusInfo = useMemo(() => {
    if (!buzzer) {
      return {
        variant: "time" as const,
        text: "Loading...",
        icon: "⏳"
      };
    }

    const config = STATUS_CONFIG[buzzer.status] || STATUS_CONFIG.active;

    const statusTexts: Record<BuzzerStatus, string> = {
      ready: "Ready for Pickup!",
      active: "Being Prepared",
      picked_up: "Picked Up",
      canceled: "Canceled",
      expired: "Expired"
    };

    return {
      variant: config.variant,
      text: statusTexts[buzzer.status] || "Unknown Status",
      icon: config.icon
    };
  }, [buzzer]);


  if (buzzer === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--fresh-surface-muted)'}}>
        <div className="max-w-md w-full shadow-lg border p-8 text-center" style={{backgroundColor: 'var(--fresh-surface)', borderColor: 'var(--fresh-border)', borderRadius: 'var(--fresh-radius-lg)'}}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: 'var(--fresh-primary)'}}></div>
          <p style={{color: 'var(--fresh-text-secondary)'}}>Loading your order status...</p>
        </div>
      </div>
    );
  }

  if (!buzzer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--fresh-surface-muted)'}}>
        <div className="max-w-md w-full shadow-lg border p-8 text-center" style={{backgroundColor: 'var(--fresh-surface)', borderColor: 'var(--fresh-border)', borderRadius: 'var(--fresh-radius-lg)'}}>
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-2xl fresh-text-brand mb-4" style={{color: 'var(--fresh-text-primary)'}}>
            Order Not Found
          </h1>
          <p className="mb-4" style={{color: 'var(--fresh-text-secondary)'}}>
            We couldn't find an order with this buzzer code.
          </p>
          <p className="text-sm" style={{color: 'var(--fresh-text-muted)'}}>
            Token: {token}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--fresh-surface-muted)'}}>
      <div className="max-w-md w-full shadow-lg border overflow-hidden" style={{backgroundColor: 'var(--fresh-surface)', borderColor: 'var(--fresh-border)', borderRadius: 'var(--fresh-radius-lg)'}}>
        {/* Status Header */}
        <div className="p-6 text-center" style={{backgroundColor: 'var(--fresh-primary)', color: 'white'}}>
          <div className="text-6xl mb-2">{statusInfo.icon}</div>
          <h1 className="text-2xl fresh-text-brand mb-1">
            {statusInfo.text}
          </h1>
          {buzzer.businessName && (
            <p className="opacity-80">
              {buzzer.businessName}
            </p>
          )}
          <div className="mt-3 flex justify-center">
            <FreshStatusBadge variant={statusInfo.variant}>
              {statusInfo.text}
            </FreshStatusBadge>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-6">
          {/* Customer & Ticket Info */}
          {(buzzer.customer_name || buzzer.ticket) && (
            <div className="mb-4 pb-4 border-b" style={{borderColor: 'var(--fresh-border)'}}>
              {buzzer.ticket && (
                <p className="text-lg font-bold uppercase tracking-wide" style={{color: 'var(--fresh-text-primary)'}}>
                  Order #{buzzer.ticket}
                </p>
              )}
              {buzzer.customer_name && (
                <p style={{color: 'var(--fresh-text-secondary)'}}>
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
            <div className="mb-4 pb-4 border-b" style={{borderColor: 'var(--fresh-border)'}}>
              <h3 className="font-medium uppercase tracking-wide mb-2" style={{color: 'var(--fresh-text-primary)'}}>Your Order:</h3>
              <div className="space-y-1">
                {buzzer.menuItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span style={{color: 'var(--fresh-text-primary)'}}>{item.name}</span>
                    <span style={{color: 'var(--fresh-text-secondary)'}}>
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
              <span style={{color: 'var(--fresh-text-secondary)'}}>Started:</span>
              <span className="font-medium" style={{color: 'var(--fresh-text-primary)'}}>
                {new Date(buzzer.started_at).toLocaleTimeString()}
              </span>
            </div>

            {buzzer.ready_at && (
              <div className="flex justify-between items-center">
                <span style={{color: 'var(--fresh-text-secondary)'}}>Ready at:</span>
                <span className="font-medium" style={{color: 'var(--fresh-success)'}}>
                  {new Date(buzzer.ready_at).toLocaleTimeString()}
                </span>
              </div>
            )}

            {buzzer.picked_up_at && (
              <div className="flex justify-between items-center">
                <span style={{color: 'var(--fresh-text-secondary)'}}>Picked up:</span>
                <span className="font-medium" style={{color: 'var(--fresh-text-primary)'}}>
                  {new Date(buzzer.picked_up_at).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          {/* Status Message */}
          {buzzer.status === "ready" && (
            <div className="mt-4 p-3 border rounded-lg" style={{backgroundColor: 'var(--fresh-selection-bg)', borderColor: 'var(--fresh-success)', borderRadius: 'var(--fresh-radius)'}}>
              <p className="font-medium text-center fresh-text-brand" style={{color: 'var(--fresh-success)'}}>
                🎉 Your order is ready for pickup!
              </p>
            </div>
          )}

          {buzzer.status === "canceled" && (
            <div className="mt-4 p-3 border rounded-lg" style={{backgroundColor: 'var(--fresh-surface)', borderColor: 'var(--fresh-error)', borderRadius: 'var(--fresh-radius)'}}>
              <p className="font-medium text-center fresh-text-brand" style={{color: 'var(--fresh-error)'}}>
                ❌ This order has been canceled.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-center" style={{color: 'var(--fresh-text-muted)'}}>
            This page updates automatically. Keep it open to track your order status.
          </p>
        </div>
      </div>
    </div>
  );
}