# CLAUDE.md - StackMatch Project Memory

> **Important**: This file provides a concise overview of the StackMatch platform. For detailed information, please refer to the specialized documentation files below.

## Documentation Structure

- **[CLAUDE-TECHNICAL.md](./CLAUDE-TECHNICAL.md)** - Technical implementation, API documentation, database schema, and development patterns
- **[CLAUDE-FEATURES.md](./CLAUDE-FEATURES.md)** - Comprehensive documentation of all completed features
- **[CLAUDE-RECENT.md](./CLAUDE-RECENT.md)** - Recent achievements, enhancements, and bug fixes (January 2025)

## Project Overview

StackMatch is an intelligent, three-sided B2B software procurement marketplace connecting buyers (mid-market companies), sellers (software vendors), and consultants (procurement experts). The platform transforms the broken $260B annual software procurement process through structured workflows, AI-powered matching, and expert guidance.

## Key Business Metrics
- **Target Market**: Mid-market companies ($10M-$1B revenue) in North America
- **Market Size**: $384B B2B SaaS market growing to $1.887T by 2034
- **Problem Solved**: 66% of software projects fail, 121-day average sales cycles, $260B annual waste
- **Revenue Model**: 5-15% seller commissions, 15-20% consultant fees, $500-$5K monthly subscriptions

## Tech Stack & Architecture

### Quick Overview
- **Frontend**: Next.js 15.3.4 + React 18.3.1 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL) with real-time capabilities and RLS
- **Authentication**: Session-based with Supabase Auth
- **State Management**: React hooks with TypeScript interfaces
- **Design System**: Steve Jobs-level attention to detail with pixel-perfect execution

> **Note**: For detailed technical documentation, see [CLAUDE-TECHNICAL.md](./CLAUDE-TECHNICAL.md)

## Sample User Data for Testing

### Christopher Fill - Buyer
- **User ID**: `1cae22cb-1311-48ca-9caa-47d474c0a20e`
- **Company**: StackMatch
- **Active Listings**: 4 listings (TEST, TEST2, TEST3, TEST4)
- **Category**: All CRM Software
- **Budget Ranges**: $50-$100

### Diego Fill - Seller
- **User ID**: `bc6d4653-f0e5-4f10-ba4e-10c81aed0b9e`
- **Company**: BiltLocal

## Completed Features Summary

> **Note**: For comprehensive documentation of all completed features, see [CLAUDE-FEATURES.md](./CLAUDE-FEATURES.md)

### Major Feature Categories:
1. **Landing Page & Authentication** - Complete auth system with smart routing
2. **Buyer & Seller Dashboards** - Command centers with real-time data
3. **Browse Vendors** - Enterprise B2B marketplace with Fortune 500 vendors
4. **Deal Rooms System** - Complete collaboration workspace with 4 optimized tabs
5. **Enterprise eSignature** - DocuSign alternative fully integrated into platform
6. **Company Profiles** - 5-tab buyer enablement system
7. **My Listings & Proposals** - Comprehensive management centers
8. **AI-Powered Create Listing** - Revolutionary TurboTax-style RFQ creation workflow with 8 comprehensive sections
9. **My Tech Stack** - Comprehensive software asset management platform
10. **Request Quote Workflow** - Streamlined vendor engagement system
11. **Quote Requests & Leads** - Seller opportunity management hub
12. **Your Clients CRM** - Lightweight client relationship management for sellers
13. **Client Record Pages** - 360-degree view of individual client relationships
14. **Browse Project Listings** - Seller opportunity discovery with advanced filtering
15. **Proposal Submission System** - AI-powered TurboTax-style proposal creation workflow
16. **RFQ Details Page** - Revolutionary "RFQ Command Center" with 5-tab deep-dive interface
17. **StackTalk Forum** - Community discussion platform
18. **UI Component System** - Complete design system with animations

### Recent Enhancements (January 2025):
- **Sidebar Widget Standardization** - Complete refactoring of all sidebar portlets to use centralized SidebarWidget component
- **Buyer Dashboard Portlet Refinements** - Professional UI/UX overhaul with improved information hierarchy
- **RFQ Details Page** - Revolutionary "RFQ Command Center" transforming linear wizard to comprehensive tabbed interface
- **Proposal Submission System** - Revolutionary AI-powered seller response workflow mirroring buyer's RFQ creation
- **Browse Project Listings** - Seller opportunity discovery page with 2-column layout and enhanced UI/UX
- **Your Clients CRM Hub** - Professional client relationship management with revenue tracking and insights
- **Client Record System** - Comprehensive client profiles with agreements, contacts, and activity history
- **Seller Dashboard** - Complete command center mirroring buyer dashboard with seller-specific features
- **Quote Requests & Leads** - Revolutionary opportunity management hub for sellers
- **My Tech Stack Platform** - Revolutionary software asset management system with $548K tracking
- **Request Quote Workflow** - Streamlined vendor engagement with multi-step modal system
- **AI-First Create Listing** - Revolutionary TurboTax-style workflow with expanded 8-section review process
- Enhanced Buyer Dashboard with calendar integration and smart reminders
- Strategic B2B marketplace transformation
- Enterprise company profile system
- My Listings & Proposals management pages
- eSignature field editor with drag-and-drop
- Technical improvements and bug fixes

> **Note**: For detailed recent updates, see [CLAUDE-RECENT.md](./CLAUDE-RECENT.md)

## Key Directories
- `/app/` - Next.js pages and API routes
- `/components/` - Reusable UI components organized by feature
- `/lib/` - Utility functions and Supabase clients
- `/types/` - TypeScript type definitions

> **Note**: For complete file structure and technical architecture, see [CLAUDE-TECHNICAL.md](./CLAUDE-TECHNICAL.md)

## Design System

### Brand Colors
- **Primary**: StackMatch Navy (#1A2B4C), StackMatch Blue (#4A73CC)
- **Success**: Trust Green (#22C55E)
- **Typography**: Inter (display) + Source Sans 3 (body)

### Design Principles
1. **Clarity Over Clutter**: Clean, uncluttered interfaces
2. **Guided at Every Step**: Clear navigation and progress indicators
3. **Trust Through Transparency**: Visual cues and progress tracking
4. **Intelligent Simplicity**: AI features without overwhelming UI
5. **Connection-Focused**: Emphasize human relationships and collaboration

## Next Priority Features
1. **Real-time Deal Room Features**: Live chat, presence indicators, notification system
2. **Deal Room APIs**: Backend integration for deal room data and real-time updates
3. **eSignature Backend Integration**: API endpoints for document signing workflow and audit trails
4. **Calendar Sync APIs**: Google Calendar/Outlook integration
5. **Advanced AI Features**: Enhanced document analysis and vendor matching
6. **Real-time Messaging**: Live chat and notification system
7. **Notification System**: Email and in-app notifications for important events

## Current Development Status
✅ **COMPLETED**: Authentication, Enhanced Buyer Dashboard Command Center with Right Sidebar, **Seller Dashboard Command Center**, Database Integration, **Revolutionary AI-Powered Create Listing Workflow with 8-Section Review**, Browse Vendors B2B Enterprise Marketplace, Global Navigation, StackTalk Community Forum, Complete Deal Rooms System, Advanced eSignature System with Field Editor, Inbox/Sent Document Management, Header Navigation Enhancements, Calendar & Smart Reminders Integration, Strategic B2B Marketplace Transformation, Enterprise Company Profile System with 5-Tab Architecture, My Listings Core Management Page, Comprehensive Received Proposals Management Center, **My Tech Stack Software Asset Management Platform**, **Request Quote Workflow System**, **Quote Requests & Leads Page**, **Your Clients CRM Hub**, **Client Record Pages with Activity Tracking**, **Browse Project Listings with Enhanced UI/UX**, **Proposal Submission System with AI-Powered 8-Section Workflow**, **RFQ Details Page with 5-Tab Command Center Interface**, Complete Navigation Routing
🚧 **IN PROGRESS**: Real-time Features Integration, Calendar Sync APIs, Advanced AI Enhancement  
📋 **NEXT**: Real-time Messaging, Google Calendar/Outlook Integration, Vendor API Integration, Company Profile Backend APIs, Deal Room APIs

## Quick Start

### Development Commands
- **Dev Server**: `npm run dev --turbo`
- **Build**: `npm run build`
- **Type Check**: `npm run type-check`
- **Lint**: `npm run lint`


## Technical Documentation

For comprehensive technical documentation including:
- Complete API endpoint documentation
- Database schema and enum values
- Development patterns and best practices
- Security implementation details
- Performance optimization strategies
- Component development guidelines

**See [CLAUDE-TECHNICAL.md](./CLAUDE-TECHNICAL.md)**

## Latest Updates

> **Note**: For comprehensive recent updates and bug fixes, see [CLAUDE-RECENT.md](./CLAUDE-RECENT.md)

### January 2025 Highlights:
- **Buyer Dashboard Portlet Refinements**: Professional UI/UX enhancement with simplified titles, stacked stats layout, and actions menus
- **Your Clients CRM Hub**: Revolutionary client relationship management for sellers with revenue tracking
- **Client Record Pages**: Comprehensive 360-degree view with agreements, contacts, and activity history
- **Revolutionary AI-Powered Create Listing**: Complete TurboTax-style workflow with expanded 8-section review process
- **Enhanced AI-Assisted Review**: Added 4 new comprehensive sections for deeper business context
- **AI Navigation Fix**: Fixed "Looks Good, Next" button navigation with smooth section transitions
- My Listings & Proposals management pages with complete navigation fixes
- Enterprise Company Profile System with 5-tab architecture
- Enhanced Buyer Dashboard with calendar and smart reminders
- Strategic B2B marketplace transformation
- Advanced eSignature field editor
- Major technical improvements and TypeScript compliance

## Project Impact

StackMatch represents a **world-class B2B marketplace** with enterprise-grade design, comprehensive collaboration tools, and Steve Jobs-level user experience, positioned to capture significant market share in the $384B software procurement space. 

Key differentiators:
- **AI-First RFQ Creation**: Industry's first TurboTax-style listing workflow with 8 comprehensive sections
- Complete deal negotiation and project management system
- Revolutionary eSignature system eliminating external dependencies
- Enterprise company profile system for comprehensive buyer enablement
- Streamlined workflows from discovery to signature

The platform directly addresses the $260B annual waste in software procurement through integrated workflows that justify premium pricing and transform how procurement teams operate.