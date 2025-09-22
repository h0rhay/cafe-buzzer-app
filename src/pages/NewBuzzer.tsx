import { type Business } from "../lib/api/businesses";
import { FreshButton } from "../components/FreshButton";
import { useState } from "react";

interface NewBuzzerProps {
  business: Business;
}

export function NewBuzzer({ business }: NewBuzzerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customWaitTime, setCustomWaitTime] = useState(business.default_eta);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl fresh-text-brand" style={{color: 'var(--fresh-text-primary)'}}>Create New Buzzer</h1>

      <div className="relative overflow-hidden transition-all duration-200 bg-white border-t-2 border-l-2 border-b-4 border-r-4 border-gray-300 hover:border-gray-400 hover:shadow-md p-6" style={{backgroundColor: 'var(--fresh-surface)', borderRadius: 'var(--fresh-radius-xl)'}}>
        <form className="space-y-6">
          <div>
            <h2 className="text-lg fresh-text-brand mb-4" style={{color: 'var(--fresh-primary)'}}>
              Customer Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium uppercase tracking-wide mb-2" style={{color: 'var(--fresh-text-primary)'}}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'var(--fresh-border)',
                    backgroundColor: 'var(--fresh-surface)',
                    color: 'var(--fresh-text-primary)',
                    borderRadius: 'var(--fresh-radius)'
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium uppercase tracking-wide mb-2" style={{color: 'var(--fresh-text-primary)'}}>
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number for SMS updates"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'var(--fresh-border)',
                    backgroundColor: 'var(--fresh-surface)',
                    color: 'var(--fresh-text-primary)',
                    borderRadius: 'var(--fresh-radius)'
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg fresh-text-brand mb-4" style={{color: 'var(--fresh-primary)'}}>
              Order Items
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {/* Sample menu items */}
              {[
                { id: '1', name: 'Coffee', price: 3.50 },
                { id: '2', name: 'Sandwich', price: 8.00 },
                { id: '3', name: 'Pastry', price: 4.50 },
                { id: '4', name: 'Salad', price: 12.00 }
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:opacity-80"
                  style={{
                    borderColor: selectedItems.includes(item.id) ? 'var(--fresh-selection-border)' : 'var(--fresh-border)',
                    backgroundColor: selectedItems.includes(item.id) ? 'var(--fresh-selection-bg)' : 'var(--fresh-surface)',
                    borderRadius: 'var(--fresh-radius)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                      }
                    }}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-medium uppercase tracking-wide" style={{color: 'var(--fresh-text-primary)'}}>{item.name}</span>
                    <span className="ml-2 text-sm" style={{color: 'var(--fresh-text-secondary)'}}>${item.price.toFixed(2)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg fresh-text-brand mb-4" style={{color: 'var(--fresh-primary)'}}>
              Wait Time
            </h2>
            <div>
              <label className="block text-sm font-medium uppercase tracking-wide mb-2" style={{color: 'var(--fresh-text-primary)'}}>
                Estimated Wait Time (minutes)
              </label>
              <select
                value={customWaitTime}
                onChange={(e) => setCustomWaitTime(Number(e.target.value))}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: 'var(--fresh-border)',
                  backgroundColor: 'var(--fresh-surface)',
                  color: 'var(--fresh-text-primary)',
                  borderRadius: 'var(--fresh-radius)'
                }}
              >
                <option value={3}>3 minutes</option>
                <option value={5}>5 minutes</option>
                <option value={7}>7 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <FreshButton variant="primary" disabled>
              Create Buzzer
            </FreshButton>
            <FreshButton variant="secondary" onClick={() => {}}>
              Clear Form
            </FreshButton>
          </div>

          <div className="border-t pt-6" style={{borderColor: 'var(--fresh-border)'}}>
            <p className="text-sm" style={{color: 'var(--fresh-text-secondary)'}}>
              This form is for demonstration purposes. In the full version, creating a buzzer would generate a QR code for the customer.
            </p>
            <p className="text-xs mt-1" style={{color: 'var(--fresh-text-muted)'}}>
              Business: {business.name}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}