import { type Business } from "../lib/api/businesses";
import { FreshButton } from "../components/FreshButton";

interface SettingsProps {
  business: Business;
}

export function Settings({ business }: SettingsProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl fresh-text-brand" style={{color: 'var(--fresh-text-primary)'}}>Settings</h1>

      <div className="relative overflow-hidden transition-all duration-200 bg-white border-t-2 border-l-2 border-b-4 border-r-4 border-gray-300 hover:border-gray-400 hover:shadow-md p-6" style={{backgroundColor: 'var(--fresh-surface)', borderRadius: 'var(--fresh-radius-xl)'}}>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg fresh-text-brand mb-4" style={{color: 'var(--fresh-primary)'}}>
              Business Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium uppercase tracking-wide mb-2" style={{color: 'var(--fresh-text-primary)'}}>
                  Business Name
                </label>
                <input
                  type="text"
                  defaultValue={business.name}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'var(--fresh-border)',
                    backgroundColor: 'var(--fresh-surface)',
                    color: 'var(--fresh-text-primary)',
                    borderRadius: 'var(--fresh-radius)'
                  }}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium uppercase tracking-wide mb-2" style={{color: 'var(--fresh-text-primary)'}}>
                  Business Slug
                </label>
                <input
                  type="text"
                  defaultValue={business.slug}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'var(--fresh-border)',
                    backgroundColor: 'var(--fresh-surface)',
                    color: 'var(--fresh-text-primary)',
                    borderRadius: 'var(--fresh-radius)'
                  }}
                  disabled
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg fresh-text-brand mb-4" style={{color: 'var(--fresh-primary)'}}>
              Default Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium uppercase tracking-wide mb-2" style={{color: 'var(--fresh-text-primary)'}}>
                  Default Wait Time (minutes)
                </label>
                <select
                  defaultValue={business.default_eta}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'var(--fresh-border)',
                    backgroundColor: 'var(--fresh-surface)',
                    color: 'var(--fresh-text-primary)',
                    borderRadius: 'var(--fresh-radius)'
                  }}
                  disabled
                >
                  <option value={3}>3 minutes</option>
                  <option value={5}>5 minutes</option>
                  <option value={7}>7 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <FreshButton variant="primary" disabled>
              Save Settings
            </FreshButton>
            <FreshButton variant="secondary" disabled>
              Reset to Defaults
            </FreshButton>
          </div>

          <div className="border-t pt-6" style={{borderColor: 'var(--fresh-border)'}}>
            <p className="text-sm" style={{color: 'var(--fresh-text-secondary)'}}>
              Settings functionality is currently read-only in this demo version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}