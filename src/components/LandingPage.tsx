import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Replace Physical Pagers with Smart Buzzers
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Modern cafe buzzer system that works on any smartphone. No hardware needed - 
            just show a QR code and your customers get real-time notifications when their order is ready.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/app"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/demo"
              className="inline-block bg-gray-100 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-3">No Hardware Required</h3>
            <p className="text-gray-600">
              Works on any smartphone or tablet. No expensive pager systems to buy or maintain.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-3xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
            <p className="text-gray-600">
              Customers see live countdown timers and get instant notifications when orders are ready.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3">Easy Management</h3>
            <p className="text-gray-600">
              Simple dashboard to manage all active orders, adjust timing, and track pickup history.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Create Order</h4>
              <p className="text-sm text-gray-600">Enter ticket number or select menu items</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Show QR Code</h4>
              <p className="text-sm text-gray-600">Customer scans QR code with their phone</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Live Countdown</h4>
              <p className="text-sm text-gray-600">Customer sees real-time countdown timer</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">Get Notified</h4>
              <p className="text-sm text-gray-600">Automatic notification when order is ready</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Modernize Your Cafe?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join cafes already using smart buzzers to improve customer experience
          </p>
          <Link
            to="/app"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
