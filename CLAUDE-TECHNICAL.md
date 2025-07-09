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
- **AI Listing APIs**:
  - `/api/ai-listing/analyze/route.ts` - AI-powered RFQ analysis and generation with enhanced 8-section responses
  - `/api/ai-listing/submit/route.ts` - Intelligent listing submission with vendor matching predictions
- **Buyer APIs**: 
  - `/api/dashboard/buyer/stats/route.ts` - Real KPI data
  - `/api/dashboard/buyer/listings/route.ts` - Live listings
  - `/api/dashboard/buyer/proposals/route.ts` - Live proposals with error handling
- **My Listings APIs**:
  - `/api/my-listings/route.ts` - Comprehensive listings management with search, filter, sort
  - `/api/my-listings/stats/route.ts` - KPI statistics with trend calculations
- **Received Proposals APIs**:
  - `/api/received-proposals/route.ts` - Advanced proposal management with filtering, search, and status mapping
  - `/api/received-proposals/stats/route.ts` - Real-time KPI calculations with trend analysis
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
│   └── seller/page.tsx (Complete seller command center with sidebar)
├── my-listings/page.tsx (Core listing management center)
├── my-tech-stack/page.tsx (Software asset management platform)
├── proposals/page.tsx (Comprehensive received proposals management center)
├── quote-requests/page.tsx (Seller opportunity management hub)
├── your-clients/page.tsx (Lightweight CRM hub for sellers)
├── clients/
│   └── [id]/page.tsx (Individual client record pages)
└── api/
    ├── auth/login/route.ts (Session management)
    ├── user/profile/route.ts (Dynamic profile data)
    ├── sellers/route.ts (Seller data for browse page)
    ├── ai-listing/
    │   ├── analyze/route.ts (AI RFQ analysis and generation)
    │   └── submit/route.ts (Intelligent listing submission)
    ├── dashboard/buyer/
    │   ├── stats/route.ts (Real KPI data)
    │   ├── listings/route.ts (Live listings)
    │   └── proposals/route.ts (Live proposals with error handling)
    ├── my-listings/
    │   ├── route.ts (Comprehensive listings management)
    │   └── stats/route.ts (KPI statistics with trends)
    ├── received-proposals/
    │   ├── route.ts (Advanced proposal management with filtering)
    │   └── stats/route.ts (Real-time KPI calculations)
    └── dashboard/seller/
        ├── stats/route.ts (Seller KPIs)
        ├── proposals/route.ts (Seller proposals)
        └── recommendations/route.ts (AI suggestions)

/components/
├── ui/ (Complete shadcn/ui library)
├── navigation/
├── browse-sellers/
├── browse-listings/
│   ├── browse-listings-header.tsx
│   ├── browse-listings-filters.tsx
│   ├── browse-listings-stats.tsx
│   ├── browse-listings-grid.tsx
│   ├── listing-opportunity-card.tsx
│   └── browse-listings-sidebar.tsx
├── company/
├── dashboard/
│   ├── buyer-dashboard-sidebar.tsx (Buyer-specific sidebar)
│   └── seller-dashboard-sidebar.tsx (Seller-specific sidebar)
├── deal-rooms/
├── my-listings/ (Complete listing management components)
├── my-tech-stack/ (Software asset management components)
├── received-proposals/ (Comprehensive proposal management components)
├── quote-requests/ (Quote request management components)
├── your-clients/ (CRM hub components)
│   ├── your-clients-header.tsx
│   ├── your-clients-stats.tsx
│   ├── your-clients-filters.tsx
│   ├── your-clients-grid.tsx
│   ├── client-card.tsx
│   └── your-clients-sidebar.tsx
├── clients/ (Client record components)
│   ├── client-record-header.tsx
│   ├── client-record-tabs.tsx
│   ├── client-record-sidebar.tsx
│   ├── overview/client-overview.tsx
│   ├── agreements/
│   │   ├── client-agreements.tsx
│   │   └── agreement-card.tsx
│   ├── contacts/
│   │   ├── client-contacts.tsx
│   │   └── contact-card.tsx
│   ├── activity/
│   │   ├── client-activity.tsx
│   │   └── activity-item.tsx
│   └── modals/
│       ├── new-proposal-modal.tsx
│       ├── log-activity-modal.tsx
│       └── add-contact-modal.tsx
├── ai-listing/ (AI-powered RFQ creation components)
│   ├── intelligent-ingestion.tsx (Document analysis intake)
│   ├── ai-working-screen.tsx (Processing animations)
│   ├── ai-assisted-review.tsx (Split-screen collaborative review)
│   └── final-approval.tsx (Submission confirmation)
├── ticker/
└── guided-listing/

/lib/
└── supabase/
    ├── client.ts (Browser client)
    └── server.ts (Async server client with cookies)

/types/
├── supabase.ts (Complete database schema types)
├── ai-listing.ts (Enhanced AI workflow with 8-section RFQ generation types)
└── quote-request.ts (Request quote workflow types)
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

### Browse Project Listings Implementation (January 2025)
- **Complete Seller Opportunity Discovery System**: Revolutionary project listing page for sellers
  - **Component Architecture**: 7 specialized components following established StackMatch patterns
  - **Advanced Filtering System**: Multi-dimensional filters with expandable advanced options
  - **ListingOpportunityCard Interface**: Comprehensive type with 18+ fields for opportunity data
  - **State Management**: Complex filter states for category, industry, budget, company size, deadline, scope, location
  - **Mock Listing Data**: 6 realistic enterprise opportunities with varied budgets ($25K-$1M) and industries
- **UI/UX Enhancement Implementation**: Strategic layout improvements for better readability
  - **Grid Layout Change**: Modified from `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3` to `grid-cols-1 lg:grid-cols-2`
  - **Spacing Improvements**: Increased card padding (p-6 to p-8), section margins (mb-4 to mb-6), gaps (gap-4/6 to gap-6/8)
  - **Status Badge Repositioning**: Moved from title row to below company name with dedicated spacing
  - **Button Enhancement**: Increased height to h-12 with font-medium for better prominence
  - **Hover Effect Removal**: Eliminated category tag hover to reduce visual clutter
- **TypeScript Excellence**: Complete type safety across all components
  - **Filter Props Interface**: BrowseListingsFiltersProps with 18 state management props
  - **Grid Props Interface**: BrowseListingsGridProps with all filter values
  - **Component Integration**: Proper prop drilling from page to all child components
  - **Mock Data Types**: Comprehensive listing data with proper status union types

### Your Clients & Client Record Pages Implementation (January 2025)
- **Your Clients CRM Hub Architecture**: Lightweight client relationship management system
  - **Component Structure**: 7 specialized components following established patterns
  - **Data Interface**: ClientRecord interface with comprehensive business metrics
  - **State Management**: Filter states for service/product, status, sort, and view modes
  - **Mock Client Data**: 8 enterprise clients with realistic revenue and agreement data
- **Client Record Page Implementation**: 360-degree view of individual client relationships
  - **Dynamic Routing**: `/clients/[id]` with Next.js 15 async params
  - **Tabbed Interface**: 4 comprehensive tabs (Overview, Agreements, Contacts, Activity)
  - **Extended ClientRecord Interface**: Complete profile with financial metrics and contact info
  - **Modal Workflows**: New Proposal, Log Activity, Add Contact with TypeScript safety
  - **Activity Tracking System**: 7 activity types with rich metadata and timeline display
- **TypeScript Excellence**: Complete type safety across all components
  - **Client Interfaces**: ClientRecord, Agreement, Contact, Activity types
  - **Component Props**: Full typing for all components and modals
  - **Mock Data**: Comprehensive client portfolio with varied industries and metrics

### Seller Dashboard & Quote Requests Implementation (January 2025)
- **Complete Seller Dashboard Architecture**: Mirror of buyer dashboard with seller-specific features
  - **Component Structure**: Main page with integrated sidebar component (`seller-dashboard-sidebar.tsx`)
  - **Data Interfaces**: QuoteRequest, Client, Proposal types with TypeScript safety
  - **State Management**: Multiple loading states for granular UI control
  - **Mock Data Integration**: Realistic quote requests, clients, and calendar events
- **Quote Requests Page Implementation**: Comprehensive opportunity management system
  - **Advanced Filtering**: Industry and budget range filters with "all" value handling
  - **View Mode Toggle**: List/Grid view state management with responsive layouts
  - **Status Management**: New/Viewed/Responded status system with color-coded badges
  - **Request Type System**: Direct Request vs Public listing differentiation
  - **Empty States**: Professional messaging for no results scenarios
- **TypeScript Excellence**: Complete type safety across all new components
  - **QuoteRequest Interface**: Comprehensive type with all required fields
  - **Filter State Types**: Proper typing for all filter values and state
  - **Component Props**: Full prop typing for maintainability

### AI-Powered Create Listing Workflow (January 2025)
- **Revolutionary TurboTax-Style Architecture**: Complete transformation of RFQ creation from complex forms to conversational AI experience
  - **Workflow State Management**: AIWorkflowStep union type managing 6 distinct states ('category' | 'ingestion' | 'processing' | 'review' | 'approval' | 'submitted')
  - **Component Integration**: 4 specialized React components with seamless data flow and state transitions
  - **TypeScript Excellence**: Expanded interfaces in `/types/ai-listing.ts` supporting 8-section workflow
- **Enhanced AI API Architecture**: Production-ready endpoints generating comprehensive 8-section RFQs
  - **Analysis Endpoint**: `/api/ai-listing/analyze/route.ts` with category-specific data generation for all 8 sections
  - **Submission Endpoint**: `/api/ai-listing/submit/route.ts` with vendor matching calculations and response predictions
  - **Category Customization**: HR & Payroll and Web Development specific content with dynamic business processes
  - **Error Handling**: Comprehensive try-catch patterns with realistic fallback data for demonstration purposes
- **Component Design Patterns**:
  - **Intelligent Ingestion**: Multi-source validation (website, LinkedIn, files) with real-time form validation
  - **AI Working Screen**: 5-step processing animation with dynamic progress tracking and professional transitions
  - **Enhanced Split-Screen Review**: Revolutionary collaborative interface with 8 comprehensive sections
    - **Navigation Implementation**: useCallback hooks for proper function memoization preventing stale closures
    - **Transition State Management**: isTransitioning state preventing navigation conflicts during section changes
    - **Auto-Scroll Functionality**: Form container scrolls to top, chat container to bottom on section changes
    - **Console Logging**: Debug logging for navigation flow tracking and troubleshooting
  - **Final Approval**: Comprehensive summary with completion statistics and vendor matching predictions
- **Expanded Data Flow Architecture**: Seamless prop drilling with enhanced state management
  - **Category Selection**: Triggers AI workflow initiation with selected category context
  - **Ingestion Data**: Company information collection with validation and analysis preparation
  - **AI Generated RFQ**: Expanded business requirements structure with 8 comprehensive sections
  - **Final Submission**: Complete RFQ data with vendor matching metrics and success predictions

### My Listings & Received Proposals System (January 2025)
- **Core Listing Management Architecture**: Complete implementation of centralized listing management
  - **Component Modularity**: 7 specialized components (Header, Stats, Filters, Grid, Card, Sidebar)
  - **API Integration**: 2 dedicated endpoints with comprehensive error handling and mock data fallbacks
  - **Database Enum Handling**: Proper mapping between frontend status values and database constraints
  - **TypeScript Excellence**: All components pass strict type checking with proper interfaces
- **Comprehensive Received Proposals Management Center**: Revolutionary proposal review and comparison system
  - **Modular Architecture**: 7 specialized components following established StackMatch patterns
  - **Advanced Filtering System**: Multi-dimensional search with status tabs, listing filters, and real-time updates
  - **Professional ProposalCard Design**: Rich vendor comparison cards with key metrics and action buttons
  - **KPI Dashboard**: 4 animated metric cards tracking proposals, review status, and value metrics
  - **API Excellence**: 2 production-ready endpoints with comprehensive error handling and mock data fallbacks

### My Tech Stack & Request Quote System Implementation (January 2025)
- **Software Asset Management Architecture**: Complete tech stack management platform
  - **Component Architecture**: 8 specialized components (Header, Stats, Filters, Grid, Card, Sidebar, Modal)
  - **KPI Dashboard**: 4 animated metric cards with sparkline visualizations and trend indicators
  - **Advanced Filtering**: Multi-dimensional search, status tabs, department filtering, and intelligent sorting
  - **Sample Data Excellence**: 14 realistic enterprise software subscriptions with varied utilization and renewal dates
- **Request Quote Workflow System**: Revolutionary vendor engagement architecture
  - **Multi-Modal System**: RequestQuoteModal with 3-step workflow (Initial Choice → Listing Selection → Customization)
  - **TypeScript Excellence**: Comprehensive interfaces in `/types/quote-request.ts` with full workflow state management
  - **Success Feedback**: Professional toast notifications and detailed confirmation modals
  - **Vendor Integration**: Seamless connection with Browse Vendors cards and vendor data conversion
- **Navigation Integration**: Complete buyer workflow connectivity
  - **Dashboard Integration**: "Manage Software" button routing from Buyer Dashboard to My Tech Stack page
  - **Vendor Discovery**: "Explore Alternatives" buttons connecting software management to vendor marketplace
  - **Quote Request Flow**: "Request Quote" buttons on vendor cards triggering contextual modal workflows

### Critical Navigation Routing Fixes
- **Buyer Dashboard Links**: Fixed "View All" routing from `/listings` to `/my-listings`
- **Proposals Page**: Created dedicated proposal management page at `/proposals`
- **My Tech Stack Navigation**: Connected dashboard portlet to comprehensive software management platform
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