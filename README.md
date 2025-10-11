# Cafe Buzzer App

A modern restaurant order management and customer notification system built with React, TypeScript, and Supabase.

## Quick Start

```bash
npm install
npm run dev  # Starts both frontend and backend
```

Visit `http://localhost:5173` to view the app.

## Project Overview

The Cafe Buzzer App allows restaurants to:
- Create and manage customer orders with QR code buzzers
- Track order status in real-time (active → ready → picked up)
- Manage menu items with estimated preparation times
- Provide customers with a public status page via unique tokens

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Authentication**: Supabase Anonymous Auth
- **UI Components**: Custom components with Tailwind styling
- **Notifications**: Sonner toast notifications
- **QR Codes**: qrcode library

## Project Structure

```
src/
├── components/     # Reusable UI components
├── layouts/        # Layout wrappers (AuthenticatedLayout)
├── pages/          # Route pages (Dashboard, BuzzerPage, etc.)
├── hooks/          # Custom React hooks
└── lib/
    ├── api/        # Supabase API functions
    └── types/      # TypeScript type definitions

supabase/
└── migrations/     # Database schema and RLS policies
```

## Development Commands

- `npm run dev` - Start frontend (Vite) and backend (Supabase) in parallel
- `npm run dev:frontend` - Start only frontend development server
- `npm run dev:backend` - Start only Supabase local server
- `npm run build` - Build for production
- `npm run lint` - TypeScript compilation check
- `supabase start` - Start Supabase services
- `supabase status` - View connection details
- `supabase stop` - Stop Supabase services

## Authentication

The app uses Supabase Anonymous Authentication for easy onboarding. Users can sign in without credentials and are prompted to create or join a business on first access.

## Database Schema

Core tables:
- **businesses** - Restaurant/cafe information
- **staff** - User-to-business relationships with roles
- **menu_items** - Menu items with prep times
- **buzzers** - Orders with public tokens and status tracking

All tables use Row Level Security (RLS) for secure data access.

## Documentation

For detailed information, see:
- [CLAUDE.md](CLAUDE.md) - Comprehensive development guide for AI assistance
- [docs/](docs/) - Additional architecture and deployment documentation

## Deployment

See [docs/deployment.md](docs/deployment.md) for production deployment instructions.
