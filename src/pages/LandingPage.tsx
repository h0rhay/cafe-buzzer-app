import { Link } from "react-router-dom";
import { FreshButton } from "../components/FreshButton";

export function LandingPage() {
  return (
    <div className="min-h-screen" style={{background: `linear-gradient(135deg, var(--fresh-surface-muted), var(--fresh-selection-bg))`}}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 fresh-text-brand" style={{color: 'var(--fresh-text-primary)'}}>
            Smart Buzzer System for Cafes
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{color: 'var(--fresh-text-secondary)'}}>
            QR code-based order notifications that work on any smartphone.
            No hardware needed.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <FreshButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/app'}
            >
              Sign Up
            </FreshButton>
            <FreshButton
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = '/demo'}
            >
              Try Demo
            </FreshButton>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="relative overflow-hidden transition-all duration-200 border-t-2 border-l-2 border-b-4 border-r-4 border-gray-300 hover:border-gray-400 hover:shadow-md p-8" style={{backgroundColor: 'var(--fresh-surface)', borderRadius: 'var(--fresh-radius-xl)'}}>
            <div className="text-4xl mb-6 text-center">📱</div>
            <h3 className="text-xl font-bold mb-4 fresh-text-brand text-center" style={{color: 'var(--fresh-primary)'}}>No Hardware Required</h3>
            <p className="text-center" style={{color: 'var(--fresh-text-secondary)'}}>
              Works on any smartphone or tablet. No expensive pager systems to buy or maintain.
            </p>
          </div>

          <div className="relative overflow-hidden transition-all duration-200 border-t-2 border-l-2 border-b-4 border-r-4 border-gray-300 hover:border-gray-400 hover:shadow-md p-8" style={{backgroundColor: 'var(--fresh-surface)', borderRadius: 'var(--fresh-radius-xl)'}}>
            <div className="text-4xl mb-6 text-center">⏱️</div>
            <h3 className="text-xl font-bold mb-4 fresh-text-brand text-center" style={{color: 'var(--fresh-primary)'}}>Real-time Updates</h3>
            <p className="text-center" style={{color: 'var(--fresh-text-secondary)'}}>
              Customers see live countdown timers and get instant notifications when orders are ready.
            </p>
          </div>

          <div className="relative overflow-hidden transition-all duration-200 border-t-2 border-l-2 border-b-4 border-r-4 border-gray-300 hover:border-gray-400 hover:shadow-md p-8" style={{backgroundColor: 'var(--fresh-surface)', borderRadius: 'var(--fresh-radius-xl)'}}>
            <div className="text-4xl mb-6 text-center">📊</div>
            <h3 className="text-xl font-bold mb-4 fresh-text-brand text-center" style={{color: 'var(--fresh-primary)'}}>Easy Management</h3>
            <p className="text-center" style={{color: 'var(--fresh-text-secondary)'}}>
              Simple dashboard to manage all active orders, adjust timing, and track pickup history.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden transition-all duration-200 border-t-2 border-l-2 border-b-4 border-r-4 border-gray-300 hover:border-gray-400 hover:shadow-md p-8 mb-16" style={{backgroundColor: 'var(--fresh-surface)', borderRadius: 'var(--fresh-radius-xl)'}}>
          <h2 className="text-3xl font-bold fresh-text-brand text-center mb-12" style={{color: 'var(--fresh-primary)'}}>How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-t-2 border-l-2 border-b-4 border-r-4 border-black" style={{backgroundColor: 'var(--fresh-accent)'}}>
                <span className="text-2xl font-bold fresh-text-brand" style={{color: 'var(--fresh-accent-foreground)'}}>1</span>
              </div>
              <h4 className="font-bold mb-3 fresh-text-brand" style={{color: 'var(--fresh-text-primary)'}}>Create Order</h4>
              <p className="text-sm" style={{color: 'var(--fresh-text-secondary)'}}>Enter ticket number or select menu items</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-t-2 border-l-2 border-b-4 border-r-4 border-black" style={{backgroundColor: 'var(--fresh-accent)'}}>
                <span className="text-2xl font-bold fresh-text-brand" style={{color: 'var(--fresh-accent-foreground)'}}>2</span>
              </div>
              <h4 className="font-bold mb-3 fresh-text-brand" style={{color: 'var(--fresh-text-primary)'}}>Show QR Code</h4>
              <p className="text-sm" style={{color: 'var(--fresh-text-secondary)'}}>Customer scans QR code with their phone</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-t-2 border-l-2 border-b-4 border-r-4 border-black" style={{backgroundColor: 'var(--fresh-accent)'}}>
                <span className="text-2xl font-bold fresh-text-brand" style={{color: 'var(--fresh-accent-foreground)'}}>3</span>
              </div>
              <h4 className="font-bold mb-3 fresh-text-brand" style={{color: 'var(--fresh-text-primary)'}}>Live Countdown</h4>
              <p className="text-sm" style={{color: 'var(--fresh-text-secondary)'}}>Customer sees real-time countdown timer</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-t-2 border-l-2 border-b-4 border-r-4 border-black" style={{backgroundColor: 'var(--fresh-accent)'}}>
                <span className="text-2xl font-bold fresh-text-brand" style={{color: 'var(--fresh-accent-foreground)'}}>4</span>
              </div>
              <h4 className="font-bold mb-3 fresh-text-brand" style={{color: 'var(--fresh-text-primary)'}}>Get Notified</h4>
              <p className="text-sm" style={{color: 'var(--fresh-text-secondary)'}}>Automatic notification when order is ready</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold fresh-text-brand mb-8" style={{color: 'var(--fresh-primary)'}}>
            Ready to Get Started?
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <FreshButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/app'}
            >
              Get Started Now
            </FreshButton>
            <FreshButton
              variant="accent"
              size="lg"
              onClick={() => window.location.href = '/demo'}
            >
              View Live Demo
            </FreshButton>
          </div>
          <p className="mt-6 text-sm" style={{color: 'var(--fresh-text-muted)'}}>
            No credit card required • Set up in under 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
