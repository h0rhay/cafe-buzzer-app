-- Enable Row Level Security on all tables
-- Enable uuid extension for generating unique IDs
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('owner', 'staff');
create type buzzer_status as enum ('active', 'ready', 'picked_up', 'cancelled', 'expired');

-- Businesses table
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  default_eta integer not null default 15, -- in minutes
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Staff table (many-to-many relationship between users and businesses)
create table staff (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role user_role not null default 'staff',
  created_at timestamptz default now(),
  unique(business_id, user_id)
);

-- Menu items table
create table menu_items (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  description text,
  estimated_time integer not null default 10, -- in minutes
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Buzzers table
create table buzzers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  public_token text unique not null,
  
  -- Order details
  ticket text,
  customer_name text,
  menu_item_ids uuid[] default '{}', -- array of menu_item IDs
  
  -- Timing
  eta integer not null, -- in minutes
  started_at timestamptz not null default now(),
  ready_at timestamptz,
  picked_up_at timestamptz,
  
  -- Status
  status buzzer_status not null default 'active',
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for better query performance
create index businesses_owner_id_idx on businesses(owner_id);
create index staff_business_id_idx on staff(business_id);
create index staff_user_id_idx on staff(user_id);
create index menu_items_business_id_idx on menu_items(business_id);
create index buzzers_business_id_idx on buzzers(business_id);
create index buzzers_public_token_idx on buzzers(public_token);
create index buzzers_status_idx on buzzers(status);

-- Enable RLS on all tables
alter table businesses enable row level security;
alter table staff enable row level security;
alter table menu_items enable row level security;
alter table buzzers enable row level security;

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at columns
create trigger update_businesses_updated_at
  before update on businesses
  for each row execute function update_updated_at_column();

create trigger update_menu_items_updated_at
  before update on menu_items
  for each row execute function update_updated_at_column();

create trigger update_buzzers_updated_at
  before update on buzzers
  for each row execute function update_updated_at_column();