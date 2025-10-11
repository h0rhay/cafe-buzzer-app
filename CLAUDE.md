# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working with this Project

### Before Creating or Moving Documentation
- **Always verify current implementation status** - Don't assume features exist based on old docs
- **Ask questions first** - Confirm what's actually implemented vs planned
- **Check the actual code** - Read source files to verify current state
- **Distinguish fact from plans** - Planning docs in docs/ may describe future features

### Before Making Assumptions
- Multi-tenant features may be planned but not fully implemented
- Check if components are placeholders or functional
- Verify auth method (anonymous vs email/password)
- Ask the user to confirm current project status

## Current Project Status

**Overall Completion: ~85%** - Core buzzer workflow is fully functional and production-ready.

### The Intended Workflow (All Working ✅)
1. Vendor clicks **"New Buzzer"** button on Dashboard (prominent CTA)
2. Buzzer instantly created with:
   - Auto-generated ticket number (001-999)
   - Demo customer name (or can be customized in future)
   - Business default ETA
3. Opens in new tab showing QR code page for customer to scan
4. Customer sees:
   - **Order #042** (prominent ticket number)
   - Live countdown timer
   - Real-time status updates
5. Vendor Dashboard shows:
   - **#042 - Customer Name** (prominent display)
   - Countdown timer
   - Actions: Mark Ready, Adjust Time (+/- 5min), Cancel

**Working Features:**
- ✅ Complete end-to-end buzzer workflow
- ✅ Dashboard with full management (create/ready/adjust/cancel)
- ✅ Customer buzzer pages with countdown timers
- ✅ Ticket numbers prominently displayed
- ✅ QR code generation and sharing
- ✅ Multi-tenant with RLS
- ✅ Email/password + anonymous auth

**Needs Work:**
- ⚠️ MenuManagement page (admin feature for menu item CRUD)
- ⚠️ Settings page (admin feature for business config)
- ⚠️ Real-time subscriptions (currently using 10s polling - works but could be better)

**For detailed status analysis, see:** `docs/current-state-audit.md`

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
- **Backend**: Supabase (PostgreSQL database, Auth)
- **Authentication**: Supabase Auth with email/password (anonymous auth also available for demo)
- **Realtime Updates**: Currently using polling (10s intervals) - Supabase Realtime subscriptions not yet implemented
- **UI Components**: Custom components with Tailwind styling
- **Notifications**: Sonner for toast notifications
- **QR Code Generation**: qrcode library for buzzer tokens

### Database Schema (supabase/migrations/)
The app uses four main tables (5 migrations applied):
- **businesses**: Restaurant/cafe information with owner_id, name, slug (for subdomain routing), default_eta, and show_timers boolean
- **staff**: Links users to businesses with roles (owner/staff)
- **menu_items**: Menu items with estimated preparation times per business
- **buzzers**: Order tracking with public tokens, customer info, timing, and status flow (active/ready/picked_up/canceled/expired)

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
   - `/:businessSlug/b/:token` - Business-specific buzzer status page
   - `/demo` - Public demo dashboard (no auth required)
   - `/verify` - Email verification page

2. **Authenticated Routes** (`/app/*`):
   - `/app/dashboard` - ✅ Fully functional main management interface showing active buzzers
   - `/app/new` - ⚠️ Create new buzzer/order (UI ready, button disabled)
   - `/app/menu` - ⚠️ Manage menu items and preparation times (needs implementation)
   - `/app/settings` - ⚠️ Business configuration and settings (needs implementation)

3. **Business Setup Flow**:
   - New authenticated users are prompted to create/join a business
   - Business owners can manage staff, menu items, and buzzer settings
   - Multi-tenant architecture with RLS-based data isolation

### API Layer (src/lib/api/)
- **businesses.ts**: Business management functions
- **menuItems.ts**: Menu item CRUD operations
- **buzzers.ts**: Buzzer creation, status updates, and retrieval
- **auth.ts**: Authentication helpers and user management

### Key Components

**Fully Implemented:**
- **Dashboard**: Fully functional staff interface (642 lines) with real-time buzzer management, create/mark ready/adjust time/cancel actions, QR code modal, countdown timers, and auto-refresh (10s polling)
- **BuzzerPage**: Public customer-facing status display with countdown timer
- **BusinessSetup**: Onboarding flow for new businesses
- **SignInForm/SignOutButton**: Email/password authentication flow (anonymous also available)
- **QRCodeModal**: QR code generation for sharing buzzer links
- **CountdownTimer**: Timer component with auto-transition and expiry callbacks

**Placeholder/Incomplete:**
- **MenuManagement**: Needs full implementation for menu item CRUD
- **Settings**: Needs implementation for business profile and configuration

**Note:** The NewBuzzer form page has been removed - it was overkill for the intended workflow. Buzzer creation happens via the "New Buzzer" button on Dashboard, which instantly creates a buzzer with auto-generated details.

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
- Real-time updates currently use 10-second polling (Supabase Realtime subscriptions planned)
- Mobile-responsive design

### Migration from Convex
This application was migrated from Convex to Supabase. Current implementation status:
- **Dashboard**: ✅ Fully functional - complete buzzer workflow works end-to-end
- **BuzzerPage**: ✅ Fully functional - customer view with live countdown
- **MenuManagement**: ⚠️ Needs implementation - placeholder
- **Settings**: ⚠️ Needs implementation - placeholder

**Overall completion: ~85%** - Core buzzer workflow is complete and production-ready. Admin pages (menu/settings) are the remaining work.

For detailed status, see: `docs/current-state-audit.md`

## Documentation Organization

### docs/ Directory (gitignored)
The `docs/` directory is for temporary planning documents and exploration notes. It is **gitignored** to avoid polluting the repository.

**These docs may describe future features or planned implementations that don't exist yet.**

Use `docs/` for:
- Feature implementation plans
- Architecture exploration
- Technical analysis and comparisons
- Temporary notes and brainstorming

**This CLAUDE.md file is the single source of truth for current project state.**