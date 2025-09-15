import { type Business } from "../lib/api/businesses";

interface NewBuzzerProps {
  business: Business;
}

export function NewBuzzer({ business }: NewBuzzerProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Buzzer</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-600">
          New buzzer functionality coming soon...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Business: {business.name}
        </p>
      </div>
    </div>
  );
}