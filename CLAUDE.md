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
- **Redux Toolkit** planned for complex global state
- **React Context** for theme and auth state

### Styling & Design
- **Brand Colors**: StackMatch Navy (#1A2B4C), Trust Green (#22C55E), etc.
- **Typography**: Inter (headings) + Source Sans 3 (body text)
- **Design Philosophy**: Steve Jobs-level attention to detail with smooth animations
- **Responsive Design**: Mobile-first approach

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

### Key Database Tables
- **profiles**: User profiles with user_type enum (buyer/seller)
- **buyer_profiles**: Extended buyer information and preferences
- **listings**: Project listings with status enum (DRAFT/ACTIVE/CLOSED/etc.)
- **proposals**: Seller proposals with status tracking
- **deal_rooms**: Collaboration spaces for buyers/sellers
- **project_categories**: Software categories for listings
- **deal_room_messages**: Real-time messaging system
- **contracts**: Contract management and milestones

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

### 2. Authentication Pages
- **Login Page** (`/app/login/page.tsx`): Split-screen design with feature showcase
- **Signup Page** (`/app/signup/page.tsx`): User type selection (buyer/seller/consultant)
- **Password Security**: Real-time strength indicator, confirmation validation
- **Social Login**: Google & Microsoft integration placeholders
- **Loading States**: Smooth animations and transitions

### 3. Buyer Dashboard (`/app/dashboard/buyer/page.tsx`)
- **Ticker Banner**: Real-time platform activity feed
- **KPI Cards**: Active listings, proposals, completed projects, success rate, total invested
- **Recent Listings**: Status badges, budget ranges, time stamps
- **Recent Proposals**: Seller information, proposal amounts, status tracking
- **Loading States**: Skeleton animations for better UX
- **Empty States**: Helpful prompts for first-time users

### 4. API Architecture
- **Stats API** (`/api/dashboard/buyer/stats/route.ts`): Dashboard metrics
- **Listings API** (`/api/dashboard/buyer/listings/route.ts`): Recent listings with categories
- **Proposals API** (`/api/dashboard/buyer/proposals/route.ts`): Proposals with seller data
- **Real Data Integration**: Connected to live Supabase database

### 5. UI Components Library
- **Core Components**: Button, Card, Badge, Input, Label, Checkbox, Radio, Progress, Avatar
- **Custom Animations**: Fade-in, slide-up, float, ticker scroll
- **Brand Theming**: Consistent color palette and typography
- **Accessibility**: WCAG compliance and proper contrast ratios

## Current File Structure
```
/app/
├── page.tsx (Landing page)
├── layout.tsx (Root layout with fonts)
├── globals.css (Brand styles & animations)
├── login/page.tsx
├── signup/page.tsx
├── dashboard/buyer/page.tsx
└── api/dashboard/buyer/
    ├── stats/route.ts
    ├── listings/route.ts
    └── proposals/route.ts

/components/
├── ui/ (shadcn/ui components)
└── ticker/ticker-banner.tsx

/lib/
└── supabase/
    ├── client.ts
    └── server.ts

/types/
└── supabase.ts (Database schema types)
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

## Next Priority Features (Pending)
1. **Authentication Integration**: Supabase Auth with session management
2. **User Onboarding**: Multi-step buyer/seller/consultant setup
3. **Listing Creation Wizard**: Guided listing workflow implementation
4. **Deal Rooms**: Real-time collaboration spaces
5. **Messaging System**: Live chat with file sharing
6. **Proposal System**: Seller proposal submission and buyer review
7. **Search & Discovery**: AI-powered vendor/consultant matching

## Development Commands
- **Dev Server**: `npm run dev --turbo`
- **Build**: `npm run build`
- **Type Check**: `npm run type-check`
- **Lint**: `npm run lint`

## Security Notes
- **Email Authentication**: Currently disabled for testing
- **RLS Policies**: Enabled on all tables
- **Environment Variables**: Never commit to git (.env.local in .gitignore)
- **Service Role Key**: Server-side only, never expose to client

## Performance Optimizations
- **Turbopack**: Fast development builds
- **SSG**: Static generation for marketing pages
- **Real-time Subscriptions**: Supabase live queries
- **Component Lazy Loading**: Planned for large dashboard sections
- **Image Optimization**: Next.js automatic optimization

This project represents a sophisticated B2B marketplace with enterprise-grade design and functionality, positioned to capture significant market share in the $384B software procurement space.