# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start both frontend (Vite) and backend (Supabase) servers in parallel
- `npm run dev:frontend` - Start only the frontend development server with Vite  
- `npm run dev:backend` - Start only the Supabase local development server
- `npm run build` - Build the frontend application for production
- `npm run lint` - Run TypeScript compilation check
- `supabase start` - Start Supabase local development environment
- `supabase stop` - Stop Supabase local development environment
- `supabase status` - Check Supabase service status and connection details

## Project Architecture

This is a **Cafe Buzzer App** built with React/TypeScript frontend and Supabase backend, designed for restaurant order management and customer notification system.

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router
- **Backend**: Supabase (PostgreSQL database, Auth, Realtime)
- **Authentication**: Supabase Auth with anonymous authentication
- **UI Components**: Custom components with Tailwind styling
- **Notifications**: Sonner for toast notifications
- **QR Code Generation**: qrcode library for buzzer tokens

### Database Schema (supabase/migrations/)
The app uses four main tables:
- **businesses**: Restaurant/cafe information with owner, name, and default ETA
- **staff**: Links users to businesses with roles (owner/staff)  
- **menu_items**: Menu items with estimated preparation times per business
- **buzzers**: Order tracking with public tokens, customer info, timing, and status flow

### Row Level Security (RLS)
All tables have RLS enabled with comprehensive security policies:
- Business owners can manage their own businesses and staff
- Staff can access data for businesses they work for
- Buzzers are publicly readable by token for customer access
- All operations require proper authentication and authorization

### Application Flow
1. **Public Routes**: 
   - `/` - Landing page for general users
   - `/b/:token` - Customer buzzer status page (no auth required)

2. **Authenticated Routes** (`/app/*`):
   - `/app/dashboard` - Main management interface showing active buzzers
   - `/app/new` - Create new buzzer/order with customer details  
   - `/app/menu` - Manage menu items and preparation times
   - `/app/settings` - Business configuration and settings

3. **Business Setup Flow**:
   - New authenticated users are prompted to create/join a business
   - Business owners can manage staff, menu items, and buzzer settings

### API Layer (src/lib/api/)
- **businesses.ts**: Business management functions
- **menuItems.ts**: Menu item CRUD operations
- **buzzers.ts**: Buzzer creation, status updates, and retrieval
- **auth.ts**: Authentication helpers and user management

### Key Components
- **BuzzerPage**: Public customer-facing status display
- **Dashboard**: Staff interface for managing active orders (placeholder)
- **NewBuzzer**: Order creation with menu item selection (placeholder)
- **BusinessSetup**: Onboarding flow for new businesses
- **SignInForm/SignOutButton**: Anonymous authentication flow

### Supabase Configuration
- Local development URL: `http://127.0.0.1:54321`
- Database migrations in `supabase/migrations/`
- RLS policies ensure secure data access
- Anonymous auth enabled for easy user onboarding

### Status Management
Buzzers progress through states: `active` → `ready` → `picked_up` (or `canceled`/`expired`)

### Development Notes
- Uses TypeScript with strict mode enabled
- Tailwind CSS for styling with custom design system
- Error handling with toast notifications
- Real-time updates via Supabase subscriptions (to be implemented)
- Mobile-responsive design

### Migration from Convex
This application was migrated from Convex to Supabase. Key components like Dashboard, NewBuzzer, MenuManagement, and Settings currently contain placeholder implementations and need to be fully converted to use the Supabase API functions.