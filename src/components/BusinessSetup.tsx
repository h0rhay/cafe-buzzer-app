import { useState } from "react";
import { createBusiness, getUserBusiness, type Business } from "../lib/api/businesses";
import { toast } from "sonner";

interface BusinessSetupProps {
  onBusinessCreated: (business: Business) => void;
}

export function BusinessSetup({ onBusinessCreated }: BusinessSetupProps) {
  const [name, setName] = useState("");
  const [defaultEta, setDefaultEta] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await createBusiness({
        name: name.trim(),
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Set Up Your Business</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Cafe Name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="defaultEta" className="block text-sm font-medium text-gray-700 mb-1">
              Default Wait Time (minutes)
            </label>
            <input
              type="number"
              id="defaultEta"
              value={defaultEta}
              onChange={(e) => setDefaultEta(parseInt(e.target.value) || 15)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="120"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Creating..." : "Create Business"}
          </button>
        </form>
      </div>
    </div>
  );
}