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
  - `/api/ai-listing/analyze/route.ts` - AI-powered RFQ analysis and generation with category-specific responses
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
│   └── seller/page.tsx (Live data dashboard)
├── my-listings/page.tsx (Core listing management center)
├── my-tech-stack/page.tsx (Software asset management platform)
├── proposals/page.tsx (Comprehensive received proposals management center)
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
├── company/
├── dashboard/
├── deal-rooms/
├── my-listings/ (Complete listing management components)
├── my-tech-stack/ (Software asset management components)
├── received-proposals/ (Comprehensive proposal management components)
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
├── ai-listing.ts (AI workflow and RFQ generation types)
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

### AI-Powered Create Listing Workflow (January 2025)
- **Revolutionary TurboTax-Style Architecture**: Complete transformation of RFQ creation from complex forms to conversational AI experience
  - **Workflow State Management**: AIWorkflowStep union type managing 6 distinct states ('category' | 'ingestion' | 'processing' | 'review' | 'approval' | 'submitted')
  - **Component Integration**: 4 specialized React components with seamless data flow and state transitions
  - **TypeScript Excellence**: 303 lines of comprehensive interfaces in `/types/ai-listing.ts` with full type safety
- **AI API Architecture**: Production-ready endpoints simulating intelligent RFQ generation
  - **Analysis Endpoint**: `/api/ai-listing/analyze/route.ts` with category-specific data generation and 2.5-second processing simulation
  - **Submission Endpoint**: `/api/ai-listing/submit/route.ts` with vendor matching calculations and response predictions
  - **Error Handling**: Comprehensive try-catch patterns with realistic fallback data for demonstration purposes
- **Component Design Patterns**:
  - **Intelligent Ingestion**: Multi-source validation (website, LinkedIn, files) with real-time form validation
  - **AI Working Screen**: 5-step processing animation with dynamic progress tracking and professional transitions
  - **Split-Screen Review**: Revolutionary collaborative interface with real-time chat and section-by-section editing
  - **Final Approval**: Comprehensive summary with completion statistics and vendor matching predictions
- **Data Flow Architecture**: Seamless prop drilling with proper state management
  - **Category Selection**: Triggers AI workflow initiation with selected category context
  - **Ingestion Data**: Company information collection with validation and analysis preparation
  - **AI Generated RFQ**: Comprehensive business requirements structure with 4 main sections
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