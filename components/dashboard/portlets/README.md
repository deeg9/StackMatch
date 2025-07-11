# Dashboard Portlets

Reusable dashboard components for displaying listings, proposals, and other dashboard data.

## Components

### RecentListingsPortlet

Displays a list of recent listings with status badges, budget information, and engagement metrics.

```tsx
import { RecentListingsPortlet } from '@/components/dashboard/portlets'

<RecentListingsPortlet
  listings={listings}
  loading={false}
  viewAllLink="/my-listings"
  maxItems={5}
  showCreateButton={true}
  createLink="/create-listing"
/>
```

### RecentProposalsPortlet

Shows recent proposals with seller information, status, and proposal amounts.

```tsx
import { RecentProposalsPortlet } from '@/components/dashboard/portlets'

<RecentProposalsPortlet
  proposals={proposals}
  loading={false}
  viewAllLink="/proposals"
  maxItems={5}
  emptyMessage="No proposals yet"
  emptySubMessage="Create listings to receive proposals"
/>
```

### DashboardPortlet

Generic portlet wrapper for consistent styling across all dashboard components.

```tsx
import { DashboardPortlet } from '@/components/dashboard/portlets'

<DashboardPortlet
  title="Custom Portlet"
  viewAllLink="/custom-link"
  hoverBorderColor="hover:border-[#22C55E]"
>
  {/* Your custom content */}
</DashboardPortlet>
```

## Utilities

### getStatusColor(status: string)
Returns appropriate Tailwind classes for listing status badges.

### getProposalStatusColor(status: string)
Returns appropriate Tailwind classes for proposal status badges.

### formatBudget(min: number | null, max: number | null)
Formats budget ranges into human-readable strings.

### calculateTimeAgo(dateString: string)
Converts timestamps into relative time strings (e.g., "2 hours ago").

## Usage in Different Contexts

These portlets can be used in:
- Buyer Dashboard
- Seller Dashboard
- Admin Dashboard
- Company Profile Pages
- Analytics Pages
- Mobile App Views

## Customization

All portlets support:
- Custom styling via className prop
- Configurable links
- Adjustable item limits
- Loading states
- Empty states with custom messages
- Hover effects and animations