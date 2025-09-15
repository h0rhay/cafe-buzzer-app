-- RLS Policies for secure data access

-- ==========================================
-- BUSINESSES TABLE POLICIES
-- ==========================================

-- Business owners can read their own businesses
create policy "business_owners_can_read_own" on businesses
  for select using (owner_id = auth.uid());

-- Business owners can update their own businesses
create policy "business_owners_can_update_own" on businesses
  for update using (owner_id = auth.uid());

-- Business owners can delete their own businesses
create policy "business_owners_can_delete_own" on businesses
  for delete using (owner_id = auth.uid());

-- Authenticated users can create businesses
create policy "authenticated_users_can_create_businesses" on businesses
  for insert with check (auth.uid() is not null and owner_id = auth.uid());

-- Staff can read businesses they work for
create policy "staff_can_read_business" on businesses
  for select using (
    id in (
      select business_id from staff where user_id = auth.uid()
    )
  );

-- ==========================================
-- STAFF TABLE POLICIES
-- ==========================================

-- Business owners can manage staff for their businesses
create policy "business_owners_can_manage_staff" on staff
  for all using (
    business_id in (
      select id from businesses where owner_id = auth.uid()
    )
  );

-- Staff can read their own staff records
create policy "staff_can_read_own" on staff
  for select using (user_id = auth.uid());

-- ==========================================
-- MENU_ITEMS TABLE POLICIES
-- ==========================================

-- Business owners and staff can manage menu items for their business
create policy "business_members_can_manage_menu_items" on menu_items
  for all using (
    business_id in (
      select id from businesses where owner_id = auth.uid()
      union
      select business_id from staff where user_id = auth.uid()
    )
  );

-- ==========================================
-- BUZZERS TABLE POLICIES
-- ==========================================

-- Business owners and staff can manage buzzers for their business
create policy "business_members_can_manage_buzzers" on buzzers
  for all using (
    business_id in (
      select id from businesses where owner_id = auth.uid()
      union
      select business_id from staff where user_id = auth.uid()
    )
  );

-- Anyone can read buzzers by public_token (for customer access)
create policy "anyone_can_read_buzzers_by_token" on buzzers
  for select using (true);

-- ==========================================
-- HELPER FUNCTIONS FOR RLS
-- ==========================================

-- Function to check if user is business member (owner or staff)
create or replace function is_business_member(business_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from businesses where id = business_uuid and owner_id = auth.uid()
    union
    select 1 from staff where business_id = business_uuid and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Function to get user's businesses (as owner or staff)
create or replace function get_user_businesses()
returns table(business_id uuid) as $$
begin
  return query
    select id from businesses where owner_id = auth.uid()
    union
    select business_id from staff where user_id = auth.uid();
end;
$$ language plpgsql security definer;