# CLAUDE-TECHNICAL.md - StackMatch Technical Documentation

This file contains technical implementation details, API documentation, and development patterns for the StackMatch project. For project overview and business context, see [CLAUDE.md](./CLAUDE.md).

## Tech Stack & Architecture

### Frontend Framework
- **Next.js 15.3.4** with App Router (Latest Stable)
- **React 18.3.1** with TypeScript for type safety
- **Tailwind CSS** with custom StackMatch brand colors
- **shadcn/ui** components for professional B2B interface
- **Lucide React** icons throughout

### Backend & Database
- **Supabase** (PostgreSQL) as backend-as-a-service
- **Real-time capabilities** for live messaging and updates
- **Row Level Security (RLS)** for data protection
- **Comprehensive database schema** with 25+ tables

### State Management
- **React hooks** (useState, useEffect) for component state
- **Session-based authentication** with Supabase Auth
- **Real-time data fetching** from authenticated API endpoints
- **TypeScript interfaces** for type safety and data structure

## Supabase Database Configuration

### Environment Variables (.env.local)
```
SUPABASE_URL=https://lnxceojnwkrmxxsulorp.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://lnxceojnwkrmxxsulorp.supabase.co
SUPABASE_ANON_KEY=***REMOVED***
NEXT_PUBLIC_SUPABASE_ANON_KEY=[same as above]
SUPABASE_SERVICE_ROLE_KEY=***REMOVED***
SUPABASE_JWT_SECRET=***REMOVED***
```

### Database Schema & Enums (Critical for Development)

#### Core Tables
- **profiles**: User profiles with user_type enum (`buyer` | `seller`)
- **buyer_profiles**: Extended buyer information and company details
- **listings**: Project listings with category relationships
- **proposals**: Seller proposals with budget and status tracking
- **deal_rooms**: Collaboration spaces with participant management
- **project_categories**: Software categories (CRM, ERP, E-commerce, etc.)
- **deal_room_messages**: Real-time messaging system

#### Critical Enum Values (Must Use Exact Values)
- **Listing Status**: `"DRAFT" | "ACTIVE" | "CLOSED" | "AWARDED" | "CANCELLED"`
- **Proposal Status**: `"DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"`
- **Deal Room Status**: `"ACTIVE" | "COMPLETED" | "CLOSED" | "CANCELLED" | "PENDING_CLOSURE"`
- **User Types**: `"buyer" | "seller"`

### Supabase Client Setup
- **Client-side**: `/lib/supabase/client.ts` for React components
- **Server-side**: `/lib/supabase/server.ts` for API routes with cookies
- **TypeScript Types**: `/types/supabase.ts` with comprehensive database schema

## API Architecture - Production Ready

### Authentication Pattern
```typescript
const { data: { user }, error } = await supabase.auth.getUser()
if (error || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### API Structure Pattern
- `/api/dashboard/{user_type}/{endpoint}`
- `/api/auth/{action}/route.ts`
- `/api/user/{resource}/route.ts`

### Completed API Endpoints
- **Authentication**: `/api/auth/login/route.ts` - Session management
- **User Profile**: `/api/user/profile/route.ts` - Dynamic profile data
- **Buyer APIs**: 
  - `/api/dashboard/buyer/stats/route.ts` - Real KPI data
  - `/api/dashboard/buyer/listings/route.ts` - Live listings
  - `/api/dashboard/buyer/proposals/route.ts` - Live proposals with error handling
- **My Listings APIs**:
  - `/api/my-listings/route.ts` - Comprehensive listings management with search, filter, sort
  - `/api/my-listings/stats/route.ts` - KPI statistics with trend calculations
- **Seller APIs**:
  - `/api/dashboard/seller/stats/route.ts` - Seller KPIs
  - `/api/dashboard/seller/proposals/route.ts` - Seller proposals
  - `/api/dashboard/seller/recommendations/route.ts` - AI suggestions

## Current File Structure
```
/app/
├── page.tsx (Landing page)
├── layout.tsx (Root layout with fonts)
├── globals.css (Brand styles & animations)
├── login/page.tsx (Authentication with real Supabase)
├── signup/page.tsx 
├── create-listing/page.tsx (Multi-step wizard)
├── browse-sellers/
│   ├── page.tsx (Seller marketplace with advanced filtering)
│   └── loading.tsx (Professional loading skeleton)
├── stacktalk/
│   ├── page.tsx (Community forum with discussion threads)
│   └── loading.tsx (Forum loading skeleton)
├── deal-rooms/
│   ├── page.tsx (Deal rooms hub with KPI dashboard)
│   ├── loading.tsx (Professional loading skeleton)
│   ├── [id]/page.tsx (Individual deal room collaboration workspace)
│   └── [id]/esignature/add-fields/page.tsx (Full-page eSignature field editor)
├── company/
│   └── [id]/
│       ├── page.tsx (Comprehensive company profile with 5-tab navigation)
│       └── loading.tsx (Professional company profile skeleton)
├── dashboard/
│   ├── buyer/page.tsx (Live data dashboard with fixed routing)
│   └── seller/page.tsx (Live data dashboard)
├── my-listings/page.tsx (Core listing management center)
├── proposals/page.tsx (Vendor response hub)
└── api/
    ├── auth/login/route.ts (Session management)
    ├── user/profile/route.ts (Dynamic profile data)
    ├── sellers/route.ts (Seller data for browse page)
    ├── dashboard/buyer/
    │   ├── stats/route.ts (Real KPI data)
    │   ├── listings/route.ts (Live listings)
    │   └── proposals/route.ts (Live proposals with error handling)
    ├── my-listings/
    │   ├── route.ts (Comprehensive listings management)
    │   └── stats/route.ts (KPI statistics with trends)
    └── dashboard/seller/
        ├── stats/route.ts (Seller KPIs)
        ├── proposals/route.ts (Seller proposals)
        └── recommendations/route.ts (AI suggestions)

/components/
├── ui/ (Complete shadcn/ui library)
├── navigation/
├── browse-sellers/
├── company/
├── dashboard/
├── deal-rooms/
├── my-listings/ (Complete listing management components)
├── ticker/
└── guided-listing/

/lib/
└── supabase/
    ├── client.ts (Browser client)
    └── server.ts (Async server client with cookies)

/types/
└── supabase.ts (Complete database schema types)
```

## Development Patterns Established

### Component Architecture
- **TypeScript Interfaces**: Comprehensive type safety
- **Modular Components**: Reusable with clear separation of concerns
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Loading States**: Professional skeleton components

### API Patterns
- **Authentication Guard**: All endpoints require valid sessions
- **Error Handling**: Comprehensive try-catch with status codes
- **Type Safety**: Request/Response typing throughout
- **Real-time Integration**: Supabase subscriptions ready

### UI/UX Patterns
- **Animation System**: `animate-fade-in`, `animate-slide-up`, etc.
- **Responsive Design**: Mobile-first with desktop enhancement
- **Status Management**: Consistent color coding and icons
- **Progress Tracking**: Visual indicators throughout
- **Accessibility**: Radix UI components for WCAG compliance

### State Management Patterns
- **Local State**: useState for component-level state
- **Session State**: Supabase auth for user context
- **Real-time State**: Supabase subscriptions for live updates
- **Form State**: Controlled components with validation

## Performance & Build

### Optimization Strategies
- **Static Generation**: Landing pages pre-rendered
- **Dynamic Imports**: Code splitting for large components
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Local font loading

### Build Configuration
- **Next.js 15.3.4**: Latest stable with App Router
- **Turbopack**: Fast development builds (`npm run dev --turbo`)
- **TypeScript**: Strict mode enabled
- **ESLint**: Custom configuration for code quality

## Development Commands
- **Dev Server**: `npm run dev --turbo`
- **Build**: `npm run build`
- **Type Check**: `npm run type-check`
- **Lint**: `npm run lint`

## Security & Authentication
- **Production Auth**: Real Supabase authentication with session management
- **Session-based APIs**: All endpoints require valid user authentication
- **RLS Policies**: Row Level Security enabled on all database tables
- **Environment Security**: All keys in .env.local (never committed)
- **Type Safety**: TypeScript throughout prevents data structure errors

## Testing Credentials
- **Buyer**: buyer@example.com / 123456 (Christopher Fill, StackMatch)
- **Seller**: seller@example.com / [password] (Diego Fill, BiltLocal)

## Recent Technical Improvements

### My Listings & Proposals System (January 2025)
- **Core Listing Management Architecture**: Complete implementation of centralized listing management
  - **Component Modularity**: 7 specialized components (Header, Stats, Filters, Grid, Card, Sidebar)
  - **API Integration**: 2 dedicated endpoints with comprehensive error handling and mock data fallbacks
  - **Database Enum Handling**: Proper mapping between frontend status values and database constraints
  - **TypeScript Excellence**: All components pass strict type checking with proper interfaces

### Critical Navigation Routing Fixes
- **Buyer Dashboard Links**: Fixed "View All" routing from `/listings` to `/my-listings`
- **Proposals Page**: Created dedicated proposal management page at `/proposals`
- **API Error Resilience**: Enhanced proposals API with database constraint error handling
- **Seamless User Flow**: Complete end-to-end navigation without 404/500 errors

### TypeScript Compliance
- Next.js 15 async params with Promise<> structure
- Radix UI Select component value handling
- Database enum type mapping for status values
- Clean import optimization

### Component Integration
- Dialog components for modals
- DropdownMenu for actions
- ScrollArea for navigation
- Select components for filtering

### Build Optimization
- Zero TypeScript errors
- Resolved JSX structure issues
- Clean Vercel deployment
- Optimized bundle size

## Next Technical Priorities
1. **eSignature Backend Integration**: API endpoints for document signing workflow
2. **Deal Room APIs**: Real-time messaging and collaboration
3. **File Upload System**: Drag-and-drop with progress tracking
4. **Calendar Sync APIs**: Google Calendar/Outlook integration
5. **Real-time Features**: WebSocket subscriptions for live updates
6. **Search Infrastructure**: Full-text search implementation
7. **Analytics Pipeline**: Event tracking and reporting

## API Development Guidelines
- Always validate user authentication
- Use TypeScript for request/response types
- Implement proper error handling
- Follow RESTful conventions
- Document all endpoints
- Test with both user types (buyer/seller)

## Component Development Guidelines
- Use TypeScript interfaces for all props
- Implement loading and error states
- Follow StackMatch design system
- Ensure mobile responsiveness
- Add proper ARIA labels
- Test with keyboard navigation

---

For business context, features overview, and design guidelines, see [CLAUDE.md](./CLAUDE.md).