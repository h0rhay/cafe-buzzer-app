-- Seed data for testing
-- This will create sample data for local development and testing

-- Create a test user (we'll use a fixed UUID for consistency)
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    null,
    null,
    '2025-09-14 13:00:00'::timestamptz,
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    '2025-09-14 13:00:00'::timestamptz,
    '{"provider": "anonymous", "providers": ["anonymous"]}',
    '{}',
    false,
    '2025-09-14 13:00:00'::timestamptz,
    '2025-09-14 13:00:00'::timestamptz,
    null,
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null
)
ON CONFLICT (id) DO NOTHING;

-- Create a test business
INSERT INTO businesses (id, owner_id, name, default_eta, created_at, updated_at) VALUES 
(
    '10000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Demo Cafe',
    15,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Add owner as staff
INSERT INTO staff (id, business_id, user_id, role, created_at) VALUES 
(
    '20000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'owner',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create some menu items
INSERT INTO menu_items (id, business_id, name, description, estimated_time, is_active, created_at, updated_at) VALUES 
(
    '30000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Cappuccino',
    'Classic Italian coffee with steamed milk',
    5,
    true,
    NOW(),
    NOW()
),
(
    '30000000-0000-0000-0000-000000000002'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Avocado Toast',
    'Fresh avocado on sourdough bread',
    8,
    true,
    NOW(),
    NOW()
),
(
    '30000000-0000-0000-0000-000000000003'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Blueberry Muffin',
    'Homemade muffin with fresh blueberries',
    3,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create some test buzzers with different statuses
INSERT INTO buzzers (
    id, 
    business_id, 
    public_token, 
    ticket, 
    customer_name, 
    menu_item_ids, 
    eta, 
    started_at, 
    ready_at, 
    picked_up_at, 
    status, 
    created_at, 
    updated_at
) VALUES 
-- Active buzzer (demo-active-123)
(
    '40000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'demo-active-123',
    '001',
    'John Doe',
    ARRAY['30000000-0000-0000-0000-000000000001'::uuid, '30000000-0000-0000-0000-000000000003'::uuid],
    8,
    NOW() - INTERVAL '3 minutes',
    NULL,
    NULL,
    'active',
    NOW(),
    NOW()
),
-- Ready buzzer (demo-ready-456)
(
    '40000000-0000-0000-0000-000000000002'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'demo-ready-456',
    '002',
    'Jane Smith',
    ARRAY['30000000-0000-0000-0000-000000000002'::uuid],
    8,
    NOW() - INTERVAL '10 minutes',
    NOW() - INTERVAL '2 minutes',
    NULL,
    'ready',
    NOW(),
    NOW()
),
-- Overdue buzzer (demo-overdue-789)
(
    '40000000-0000-0000-0000-000000000003'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'demo-overdue-789',
    '003',
    'Bob Wilson',
    ARRAY['30000000-0000-0000-0000-000000000001'::uuid, '30000000-0000-0000-0000-000000000002'::uuid],
    10,
    NOW() - INTERVAL '15 minutes',
    NULL,
    NULL,
    'active',
    NOW(),
    NOW()
),
-- Picked up buzzer (demo-done-999)
(
    '40000000-0000-0000-0000-000000000004'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'demo-done-999',
    '004',
    'Alice Johnson',
    ARRAY['30000000-0000-0000-0000-000000000003'::uuid],
    5,
    NOW() - INTERVAL '20 minutes',
    NOW() - INTERVAL '10 minutes',
    NOW() - INTERVAL '5 minutes',
    'picked_up',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;