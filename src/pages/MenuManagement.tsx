import { type Business } from "../lib/api/businesses";
import { FreshButton } from "../components/FreshButton";
import { FreshStatusBadge } from "../components/FreshStatusBadge";
import { useState } from "react";

interface MenuManagementProps {
  business: Business;
}

export function MenuManagement({ business }: MenuManagementProps) {
  const [menuItems] = useState([
    { id: '1', name: 'Americano', category: 'Coffee', price: 3.50, prepTime: 3, available: true },
    { id: '2', name: 'Latte', category: 'Coffee', price: 4.50, prepTime: 5, available: true },
    { id: '3', name: 'Club Sandwich', category: 'Food', price: 8.00, prepTime: 12, available: true },
    { id: '4', name: 'Caesar Salad', category: 'Food', price: 12.00, prepTime: 8, available: false },
    { id: '5', name: 'Blueberry Muffin', category: 'Pastry', price: 4.50, prepTime: 2, available: true },
    { id: '6', name: 'Chocolate Croissant', category: 'Pastry', price: 3.75, prepTime: 3, available: true },
  ]);

  const categories = ['All', 'Coffee', 'Food', 'Pastry'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl fresh-text-brand" style={{color: 'var(--fresh-text-primary)'}}>Menu Management</h1>
        <FreshButton variant="primary" disabled>
          Add New Item
        </FreshButton>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {categories.map((category) => (
          <FreshButton
            key={category}
            variant={selectedCategory === category ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </FreshButton>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-lg shadow-sm border p-4"
            style={{
              backgroundColor: 'var(--fresh-surface)',
              borderColor: 'var(--fresh-border)',
              borderRadius: 'var(--fresh-radius-lg)'
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold uppercase tracking-wide" style={{color: 'var(--fresh-text-primary)'}}>
                  {item.name}
                </h3>
                <p className="text-sm" style={{color: 'var(--fresh-text-secondary)'}}>
                  {item.category}
                </p>
              </div>
              <FreshStatusBadge variant={item.available ? "success" : "error"}>
                {item.available ? "Available" : "Out of Stock"}
              </FreshStatusBadge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{color: 'var(--fresh-text-secondary)'}}>Price:</span>
                <span className="font-medium" style={{color: 'var(--fresh-text-primary)'}}>
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{color: 'var(--fresh-text-secondary)'}}>Prep Time:</span>
                <span className="font-medium" style={{color: 'var(--fresh-text-primary)'}}>
                  {item.prepTime} min
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <FreshButton variant="outline" size="sm" disabled>
                Edit
              </FreshButton>
              <FreshButton
                variant={item.available ? "secondary" : "primary"}
                size="sm"
                disabled
              >
                {item.available ? "Mark Unavailable" : "Mark Available"}
              </FreshButton>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="rounded-lg shadow-sm border p-6" style={{
        backgroundColor: 'var(--fresh-selection-bg)',
        borderColor: 'var(--fresh-selection-border)',
        borderRadius: 'var(--fresh-radius-lg)'
      }}>
        <h2 className="text-lg fresh-text-brand mb-4" style={{color: 'var(--fresh-primary)'}}>
          Menu Statistics
        </h2>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold" style={{color: 'var(--fresh-primary)'}}>
              {menuItems.length}
            </div>
            <div className="text-sm font-medium uppercase tracking-wide" style={{color: 'var(--fresh-text-primary)'}}>
              Total Items
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{color: 'var(--fresh-success)'}}>
              {menuItems.filter(item => item.available).length}
            </div>
            <div className="text-sm font-medium uppercase tracking-wide" style={{color: 'var(--fresh-text-primary)'}}>
              Available
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{color: 'var(--fresh-error)'}}>
              {menuItems.filter(item => !item.available).length}
            </div>
            <div className="text-sm font-medium uppercase tracking-wide" style={{color: 'var(--fresh-text-primary)'}}>
              Out of Stock
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{color: 'var(--fresh-accent)'}}>
              {Math.round(menuItems.reduce((sum, item) => sum + item.prepTime, 0) / menuItems.length)}
            </div>
            <div className="text-sm font-medium uppercase tracking-wide" style={{color: 'var(--fresh-text-primary)'}}>
              Avg Prep Time (min)
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t" style={{borderColor: 'var(--fresh-border)'}}>
          <p className="text-sm" style={{color: 'var(--fresh-text-secondary)'}}>
            Menu management features are currently read-only in this demo version.
          </p>
          <p className="text-xs mt-1" style={{color: 'var(--fresh-text-muted)'}}>
            Business: {business.name}
          </p>
        </div>
      </div>
    </div>
  );
}