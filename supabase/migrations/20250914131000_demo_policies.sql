-- Add RLS policies for demo functionality
-- Allow anonymous users to access demo business data

-- Allow anonymous users to read demo business (for Dashboard)
create policy "anonymous_can_read_demo_business" on businesses
  for select using (id = '10000000-0000-0000-0000-000000000001');

-- Allow anonymous users to read demo menu items
create policy "anonymous_can_read_demo_menu_items" on menu_items
  for select using (business_id = '10000000-0000-0000-0000-000000000001');

-- Allow anonymous users to create buzzers for demo business
create policy "anonymous_can_create_demo_buzzers" on buzzers
  for insert with check (business_id = '10000000-0000-0000-0000-000000000001');

-- Allow anonymous users to read demo buzzers (for Dashboard)
create policy "anonymous_can_read_demo_buzzers" on buzzers
  for select using (business_id = '10000000-0000-0000-0000-000000000001');