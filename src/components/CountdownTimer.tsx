import { useState, useEffect, useCallback, memo } from "react";

// Define TypeScript types for better type safety
type BuzzerStatus = 'active' | 'ready' | 'picked_up' | 'canceled' | 'expired';
type TimerSize = 'small' | 'medium' | 'large';

interface CountdownTimerProps {
  startedAt: string;
  etaMinutes: number;
  status: BuzzerStatus;
  size?: TimerSize;
  showText?: boolean;
  showTimers?: boolean; // Whether to show actual countdown (false = just status)
  onExpired?: () => void; // Callback when timer reaches zero
  buzzerId?: string; // For tracking which buzzer expired
}

const CountdownTimer = memo(function CountdownTimer({ 
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

  const formatTime = useCallback((minutes: number): string => {
    if (minutes <= 0) return "0:00";
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

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

  // Color based on status and time remaining
  const getColor = useCallback(() => {
    if (status === 'ready') return '#10b981'; // green
    if (status === 'canceled') return '#ef4444'; // red
    if (status === 'expired') return '#6b7280'; // gray
    if (isExpired) return '#f59e0b'; // orange
    if (timeRemaining <= 2) return '#f59e0b'; // orange when < 2 min
    return '#3b82f6'; // blue
  }, [status, isExpired, timeRemaining]);

  const getStatusText = useCallback(() => {
    if (status === 'ready') return 'Ready!';
    if (status === 'canceled') return 'Canceled';
    if (status === 'expired') return 'Expired';
    if (status === 'picked_up') return 'Picked up';
    if (status === 'active' && !showTimers) return 'Preparing...';
    if (isExpired) return 'Overdue';
    return formatTime(timeRemaining);
  }, [status, showTimers, isExpired, timeRemaining, formatTime]);

  const color = getColor();

  // LED configuration - number of LEDs around the circle
  const numLEDs = 12;
  const ledRadius = radius + 5; // Slightly outside the circle
  const rotationSpeed = 12; // seconds for full rotation (1 second per LED)

  return (
    <div className={`relative ${config.containerSize} flex items-center justify-center`}>
      {/* SVG Container */}
      <svg
        width={config.diameter}
        height={config.diameter}
        className="transform -rotate-90"
        style={{overflow: 'visible'}}
      >
        {/* LED Lights - One red dot chasing around the circle */}
        {status === 'active' && Array.from({ length: numLEDs }).map((_, i) => {
          const angle = (i / numLEDs) * 2 * Math.PI;
          const x = config.diameter / 2 + ledRadius * Math.cos(angle);
          const y = config.diameter / 2 + ledRadius * Math.sin(angle);

          // Each LED blinks on for a brief moment in sequence
          const animationDelay = (i / numLEDs) * rotationSpeed;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={5}
              fill="transparent"
              stroke="#d1d5db"
              strokeWidth={2}
              className="led-blink"
              style={{
                animationDelay: `${animationDelay}s`,
                animationDuration: `${rotationSpeed}s`
              }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`font-bold ${config.numberSize} font-mono`}
            style={{ color }}
          >
            {getStatusText()}
          </div>
          {status === 'active' && showTimers && (
            <div className={`${config.textSize} text-gray-500 mt-1`}>
              {isExpired ? 'Ready' : 'Remaining'}
            </div>
          )}
        </div>
      )}

      {/* LED blink animation - analog on/off like a physical buzzer */}
      <style>{`
        @keyframes led-blink {
          0% {
            fill: transparent;
            stroke: #d1d5db;
            stroke-width: 2;
            opacity: 1;
            filter: none;
          }
          8% {
            fill: #ef4444;
            stroke: #ef4444;
            stroke-width: 0;
            opacity: 1;
            filter: drop-shadow(0 0 6px #ef4444) drop-shadow(0 0 12px #ef4444);
          }
          16% {
            fill: transparent;
            stroke: #d1d5db;
            stroke-width: 2;
            opacity: 1;
            filter: none;
          }
          100% {
            fill: transparent;
            stroke: #d1d5db;
            stroke-width: 2;
            opacity: 1;
            filter: none;
          }
        }
        .led-blink {
          animation: led-blink linear infinite;
        }
      `}</style>
    </div>
  );
});

// Custom comparison function for React.memo to optimize re-renders
CountdownTimer.displayName = 'CountdownTimer';

export { CountdownTimer };
