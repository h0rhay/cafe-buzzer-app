import { useState, useEffect } from "react";

interface CountdownTimerProps {
  startedAt: string;
  etaMinutes: number;
  status: 'active' | 'ready' | 'picked_up' | 'canceled' | 'expired';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  showTimers?: boolean; // Whether to show actual countdown (false = just status)
  onExpired?: () => void; // Callback when timer reaches zero
  buzzerId?: string; // For tracking which buzzer expired
}

export function CountdownTimer({ 
  startedAt, 
  etaMinutes, 
  status, 
  size = 'medium',
  showText = true,
  showTimers = true, // Default to true for dashboard (staff view)
  onExpired,
  buzzerId
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const [hasTriggeredExpired, setHasTriggeredExpired] = useState(false);

  useEffect(() => {
    // Reset trigger state when ETA changes (so timer can trigger again if needed)
    setHasTriggeredExpired(false);
  }, [etaMinutes]);

  useEffect(() => {
    const updateTimer = () => {
      if (status !== 'active') {
        setTimeRemaining(0);
        setIsExpired(false);
        return;
      }

      const startTime = new Date(startedAt).getTime();
      const now = Date.now();
      const elapsed = (now - startTime) / 1000 / 60; // minutes
      const remaining = Math.max(0, etaMinutes - elapsed);

      // Debug log for ETA changes
      if (Math.abs(remaining - timeRemaining) > 0.5) { // Log when time jumps significantly
        console.log('⏰ Timer update:', {
          remaining: formatTime(remaining),
          eta: etaMinutes + 'min',
          elapsed: elapsed.toFixed(1) + 'min'
        });
      }

      setTimeRemaining(remaining); // Keep as decimal for more accurate countdown
      const justExpired = remaining <= 0;
      setIsExpired(justExpired);

      // Trigger auto-ready when timer expires (only once, and only if callback provided)
      if (justExpired && !hasTriggeredExpired && onExpired && buzzerId) {
        console.log('⏰ Timer expired! Dashboard auto-transitioning to ready:', buzzerId);
        setHasTriggeredExpired(true);
        onExpired();
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [startedAt, etaMinutes, status, hasTriggeredExpired, onExpired, buzzerId, timeRemaining]);

  const formatTime = (minutes: number): string => {
    if (minutes <= 0) return "0:00";
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage (0-100)
  const progress = status === 'active' 
    ? Math.max(0, Math.min(100, ((etaMinutes - timeRemaining) / etaMinutes) * 100))
    : status === 'ready' ? 100 : 0;


  // Size configurations
  const sizeConfig = {
    small: { 
      diameter: 60, 
      strokeWidth: 6, 
      textSize: 'text-xs', 
      numberSize: 'text-sm',
      containerSize: 'w-16 h-16' 
    },
    medium: { 
      diameter: 120, 
      strokeWidth: 8, 
      textSize: 'text-sm', 
      numberSize: 'text-xl',
      containerSize: 'w-32 h-32' 
    },
    large: { 
      diameter: 200, 
      strokeWidth: 12, 
      textSize: 'text-lg', 
      numberSize: 'text-4xl',
      containerSize: 'w-52 h-52' 
    }
  };

  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Color based on status and time remaining
  const getColor = () => {
    if (status === 'ready') return '#10b981'; // green
    if (status === 'canceled') return '#ef4444'; // red
    if (status === 'expired') return '#6b7280'; // gray
    if (isExpired) return '#f59e0b'; // orange
    if (timeRemaining <= 2) return '#f59e0b'; // orange when < 2 min
    return '#3b82f6'; // blue
  };

  const getStatusText = () => {
    if (status === 'ready') return 'Ready!';
    if (status === 'canceled') return 'Canceled';
    if (status === 'expired') return 'Expired';
    if (status === 'picked_up') return 'Picked up';
    if (status === 'active' && !showTimers) return 'Preparing...';
    if (isExpired) return 'Overdue';
    return formatTime(timeRemaining);
  };

  const color = getColor();

  return (
    <div className={`relative ${config.containerSize} flex items-center justify-center`}>
      {/* SVG Pie Chart */}
      <svg 
        width={config.diameter} 
        height={config.diameter} 
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={config.strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke={color}
          strokeWidth={config.strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>

      {/* Center text */}
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className={`font-bold ${config.numberSize} font-mono`}
            style={{ color }}
          >
            {status === 'active' && showTimers ? formatTime(timeRemaining) : getStatusText()}
          </div>
          {status === 'active' && showTimers && (
            <div className={`${config.textSize} text-gray-500 mt-1`}>
              {isExpired ? 'Ready' : 'Remaining'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
