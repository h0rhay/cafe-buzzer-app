import { useState } from "react";
import { createBusiness, getUserBusiness, type Business } from "../lib/api/businesses";
import { toast } from "sonner";
import { FreshButton } from "../components/FreshButton";

interface BusinessSetupProps {
  onBusinessCreated: (business: Business) => void;
}

export function BusinessSetup({ onBusinessCreated }: BusinessSetupProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [defaultEta, setDefaultEta] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate slug from business name
  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
        .slice(0, 50) // Max 50 chars
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setIsLoading(true);
    try {
      await createBusiness({
        name: name.trim(),
        slug: slug.trim(),
        defaultEta,
      });
      
      // Fetch the created business
      const business = await getUserBusiness();
      if (business) {
        onBusinessCreated(business);
        toast.success("Business created successfully!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create business");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="relative overflow-hidden transition-all duration-200 bg-white border-t-2 border-l-2 border-b-4 border-r-4 border-gray-300 hover:border-gray-400 hover:shadow-md p-6" style={{backgroundColor: 'var(--fresh-surface)', borderRadius: 'var(--fresh-radius-xl)'}}>
        <h2 className="text-2xl fresh-text-brand mb-6 text-center" style={{color: 'var(--fresh-text-primary)'}}>Set Up Your Business</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium uppercase tracking-wide mb-1" style={{color: 'var(--fresh-text-primary)'}}>
              Business Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: 'var(--fresh-border)',
                backgroundColor: 'var(--fresh-surface)',
                color: 'var(--fresh-text-primary)',
                borderRadius: 'var(--fresh-radius)'
              }}
              placeholder="Your Cafe Name"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium uppercase tracking-wide mb-1" style={{color: 'var(--fresh-text-primary)'}}>
              Business URL
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 text-sm" style={{
                borderColor: 'var(--fresh-border)',
                backgroundColor: 'var(--fresh-surface-muted)',
                color: 'var(--fresh-text-secondary)',
                borderRadius: 'var(--fresh-radius) 0 0 var(--fresh-radius)'
              }}>
                https://
              </span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="your-cafe-name"
                pattern="[a-z0-9-]+"
                className="flex-1 px-3 py-2 border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: 'var(--fresh-border)',
                  backgroundColor: 'var(--fresh-surface)',
                  color: 'var(--fresh-text-primary)'
                }}
                required
              />
              <span className="inline-flex items-center px-3 border border-l-0 text-sm" style={{
                borderColor: 'var(--fresh-border)',
                backgroundColor: 'var(--fresh-surface-muted)',
                color: 'var(--fresh-text-secondary)',
                borderRadius: '0 var(--fresh-radius) var(--fresh-radius) 0'
              }}>
                .cafebuzzer.com
              </span>
            </div>
            <p className="text-xs mt-1" style={{color: 'var(--fresh-text-muted)'}}>
              This will be your business URL. Only lowercase letters, numbers, and hyphens allowed.
            </p>
          </div>
          
          <div>
            <label htmlFor="defaultEta" className="block text-sm font-medium uppercase tracking-wide mb-1" style={{color: 'var(--fresh-text-primary)'}}>
              Default Wait Time (minutes)
            </label>
            <input
              type="number"
              id="defaultEta"
              value={defaultEta}
              onChange={(e) => setDefaultEta(parseInt(e.target.value) || 15)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: 'var(--fresh-border)',
                backgroundColor: 'var(--fresh-surface)',
                color: 'var(--fresh-text-primary)',
                borderRadius: 'var(--fresh-radius)'
              }}
              min="1"
              max="120"
              required
            />
          </div>
          
          <FreshButton
            variant="primary"
            disabled={isLoading || !name.trim()}
            onClick={() => handleSubmit(new Event('submit') as any)}
            className="w-full"
          >
            {isLoading ? "Creating..." : "Create Business"}
          </FreshButton>
        </form>
      </div>
    </div>
  );
}