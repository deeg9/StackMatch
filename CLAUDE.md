# CLAUDE.md - StackMatch Project Memory

## Project Overview
StackMatch is an intelligent, three-sided B2B software procurement marketplace connecting buyers (mid-market companies), sellers (software vendors), and consultants (procurement experts). The platform transforms the broken $260B annual software procurement process through structured workflows, AI-powered matching, and expert guidance.

## Key Business Metrics
- **Target Market**: Mid-market companies ($10M-$1B revenue) in North America
- **Market Size**: $384B B2B SaaS market growing to $1.887T by 2034
- **Problem Solved**: 66% of software projects fail, 121-day average sales cycles, $260B annual waste
- **Revenue Model**: 5-15% seller commissions, 15-20% consultant fees, $500-$5K monthly subscriptions

## Tech Stack & Architecture

### Frontend Framework
- **Next.js 15.3.3** with App Router
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

### Styling & Design Philosophy
- **Design Excellence**: Steve Jobs-level attention to detail with pixel-perfect execution
- **Micro-interactions**: Smooth animations, hover effects, and transitions throughout
- **Brand Colors**: StackMatch Navy (#1A2B4C), Trust Green (#22C55E), StackMatch Blue (#4A73CC)
- **Typography**: Inter (display) + Source Sans 3 (body) with careful hierarchy
- **Responsive Design**: Mobile-first with desktop enhancement
- **Animation System**: Custom CSS animations (fade-in, slide-up, float, pulse)
- **Visual Consistency**: Every component follows established design patterns

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

#### Sample Data (Christopher Fill - Buyer)
- **User ID**: `1cae22cb-1311-48ca-9caa-47d474c0a20e`
- **Company**: StackMatch
- **Active Listings**: 4 listings (TEST, TEST2, TEST3, TEST4)
- **Category**: All CRM Software
- **Budget Ranges**: $50-$100

#### Sample Data (Diego Fill - Seller) 
- **User ID**: `bc6d4653-f0e5-4f10-ba4e-10c81aed0b9e`
- **Company**: BiltLocal
- **Email**: seller@example.com

### Supabase Client Setup
- **Client-side**: `/lib/supabase/client.ts` for React components
- **Server-side**: `/lib/supabase/server.ts` for API routes with cookies
- **TypeScript Types**: `/types/supabase.ts` with comprehensive database schema

## Completed Features

### 1. Landing Page (`/app/page.tsx`)
- **Hero Section**: Compelling value proposition with statistics
- **Problem/Solution**: $260B crisis messaging with three-sided solution
- **How It Works**: 4-step process visualization
- **Social Proof**: Market opportunity and success metrics
- **Responsive Design**: Beautiful animations and hover effects
- **Brand Consistency**: Perfect color implementation throughout

### 2. Complete Authentication System
- **Login Page** (`/app/login/page.tsx`): Split-screen design with feature showcase
- **Real Supabase Auth**: Actual authentication with session management
- **Smart Routing**: Auto-redirect to appropriate dashboard based on user_type
- **Login API** (`/api/auth/login/route.ts`): Session-based authentication
- **User Profile API** (`/api/user/profile/route.ts`): Dynamic profile data
- **Password Security**: Real-time strength indicator, confirmation validation

### 3. Buyer Dashboard (`/app/dashboard/buyer/page.tsx`) - LIVE DATA
- **Real User Data**: Christopher Fill's actual profile and company info
- **Live KPI Cards**: Real stats from database (4 active listings, proposals, etc.)
- **Authenticated APIs**: Session-based data fetching with error handling
- **Dynamic Content**: Real listings (TEST, TEST2, TEST3, TEST4) with CRM category
- **Professional UI**: Ticker banner, loading states, responsive design

### 4. Seller Dashboard (`/app/dashboard/seller/page.tsx`) - LIVE DATA
- **Complete Mirror**: Beautiful seller-focused dashboard with real data
- **Seller KPIs**: Active proposals, won listings, success rate, total earned, profile rating
- **Real Recommendations**: AI-powered listing suggestions based on seller profile
- **Diego's Data**: Ready for seller testing with BiltLocal company info

### 5. Create Listing - Multi-Step Wizard (`/app/create-listing/page.tsx`)
- **Category Selection**: Responsive grid with 6 categories (HR, Web, Mobile, Design, Data, Marketing)
- **Guided Form Flow**: Professional 4-step process with progress tracking
- **Visual Excellence**: Hover animations, progress bars, step indicators
- **Professional UX**: Sticky navigation, save draft functionality, completion tracking
- **Component Architecture**: Modular design ready for form implementation

### 6. API Architecture - Production Ready
- **Authenticated Endpoints**: All APIs require valid user sessions
- **Buyer APIs**: `/api/dashboard/buyer/` (stats, listings, proposals)
- **Seller APIs**: `/api/dashboard/seller/` (stats, proposals, recommendations)
- **Profile API**: `/api/user/profile` for dynamic user information
- **Error Handling**: Comprehensive error states and validation
- **Type Safety**: TypeScript interfaces throughout

### 7. UI Component System
- **Core Library**: Button, Card, Badge, Input, Label, Checkbox, Radio, Progress, Avatar, Textarea
- **Custom Animations**: fade-in, slide-up, float, ticker scroll, pulse, scale transforms
- **Brand System**: Perfect StackMatch color implementation with hover states
- **Professional Patterns**: Consistent spacing, typography, and interaction design

## Current File Structure
```
/app/
├── page.tsx (Landing page)
├── layout.tsx (Root layout with fonts)
├── globals.css (Brand styles & animations)
├── login/page.tsx (Authentication with real Supabase)
├── signup/page.tsx 
├── create-listing/page.tsx (Multi-step wizard)
├── dashboard/
│   ├── buyer/page.tsx (Live data dashboard)
│   └── seller/page.tsx (Live data dashboard)
└── api/
    ├── auth/login/route.ts (Session management)
    ├── user/profile/route.ts (Dynamic profile data)
    ├── dashboard/buyer/
    │   ├── stats/route.ts (Real KPI data)
    │   ├── listings/route.ts (Live listings)
    │   └── proposals/route.ts (Live proposals)
    └── dashboard/seller/
        ├── stats/route.ts (Seller KPIs)
        ├── proposals/route.ts (Seller proposals)
        └── recommendations/route.ts (AI suggestions)

/components/
├── ui/ (Complete shadcn/ui library)
├── ticker/ticker-banner.tsx
└── guided-listing/ (Multi-step form components)
    └── step1-understanding-needs.tsx

/lib/
└── supabase/
    ├── client.ts (Browser client)
    └── server.ts (Async server client with cookies)

/types/
└── supabase.ts (Complete database schema types)
```

## Brand Identity Guidelines

### Colors
- **Primary**: StackMatch Navy (#1A2B4C), StackMatch Blue (#4A73CC)
- **Success**: Trust Green (#22C55E), Success Green (#16A34A)  
- **Warning**: Attention Orange (#F59E0B)
- **Info**: Information Blue (#3B82F6)
- **Neutrals**: Charcoal (#374151), Medium Gray (#6B7280), Light Gray (#D1D5DB)

### Typography
- **Display Font**: Inter (600, 700 weights)
- **Body Font**: Source Sans 3 (400, 500 weights)
- **Usage**: Clear hierarchy with accessible contrast

### Design Principles
1. **Clarity Over Clutter**: Clean, uncluttered interfaces
2. **Guided at Every Step**: Clear navigation and progress indicators
3. **Trust Through Transparency**: Visual cues and progress tracking
4. **Intelligent Simplicity**: AI features without overwhelming UI
5. **Connection-Focused**: Emphasize human relationships and collaboration

## Next Priority Features
1. **Complete Create Listing Forms**: Finish Steps 2-4 (Technical Requirements, Project Details, Review)
2. **File Upload System**: Drag-and-drop with progress bars and preview
3. **Listing Submission API**: Backend integration for saving and publishing listings
4. **Browse Listings Page**: Marketplace view for sellers to discover opportunities
5. **Deal Rooms**: Real-time collaboration spaces for buyer-seller communication
6. **Proposal Submission**: Seller proposal forms and buyer review system
7. **Messaging System**: Live chat with file sharing capabilities
8. **Search & Discovery**: Advanced filtering and AI-powered matching

## Current Development Status
✅ **COMPLETED**: Authentication, Dashboards, Database Integration, Create Listing Framework
🚧 **IN PROGRESS**: Create Listing Form Steps (2-4), File Upload Components
📋 **NEXT**: Listing APIs, Browse Marketplace, Proposal System

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

## Development Patterns Established
- **API Structure**: `/api/dashboard/{user_type}/{endpoint}` pattern
- **Authentication Guard**: `const { data: { user }, error } = await supabase.auth.getUser()`
- **Error Handling**: Comprehensive try-catch with user-friendly messages
- **Component Architecture**: Modular, reusable components with TypeScript interfaces
- **Animation System**: Consistent CSS classes (animate-fade-in, animate-slide-up, etc.)
- **Design System**: Steve Jobs-level attention to detail with perfect brand consistency

## Performance & Build
- **Next.js 15.3.3**: Latest stable with App Router for optimal performance
- **Turbopack**: Fast development builds (`npm run dev --turbo`)
- **Static Generation**: Landing pages pre-rendered for speed
- **Real-time Data**: Efficient database queries with proper indexing
- **Component Optimization**: Lazy loading and code splitting ready

## Testing Credentials
- **Buyer**: buyer@example.com / 123456 (Christopher Fill, StackMatch)
- **Seller**: seller@example.com / [password] (Diego Fill, BiltLocal)

This project represents a **world-class B2B marketplace** with enterprise-grade design, real-time functionality, and Steve Jobs-level user experience, positioned to capture significant market share in the $384B software procurement space.