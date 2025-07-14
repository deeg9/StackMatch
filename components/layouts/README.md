# Unified Layout System

This directory contains the unified layout components that provide consistent structure and behavior across StackMatch pages.

## Overview

The unified layout system eliminates code duplication and ensures consistency across all pages that follow similar patterns (listings, grids, filters, etc.).

## Components

### UnifiedPageLayout

Base layout component that provides the common structure for all pages.

```tsx
import { UnifiedPageLayout } from '@/components/layouts/unified-page-layout'

<UnifiedPageLayout className="custom-class">
  {/* Page content */}
</UnifiedPageLayout>
```

**Props:**
- `children`: ReactNode - Page content
- `className?`: string - Additional CSS classes for the main container
- `containerClassName?`: string - Additional CSS classes for the content container

### GridPageLayout

Extended layout for pages with grid/sidebar structure and common state management.

```tsx
import { GridPageLayout, useGridPageState } from '@/components/layouts/grid-page-layout'

const state = useGridPageState({
  filters: { status: 'all' },
  sortBy: 'recent'
})

<GridPageLayout
  header={<PageHeader title="My Page" />}
  stats={<StatsDashboard stats={myStats} />}
  filters={<FiltersBar {...filterProps} />}
  grid={(props) => <ContentGrid items={items} />}
  sidebar={<CustomSidebar />}
/>
```

**Props:**
- `header`: ReactNode - Page header component
- `stats?`: ReactNode - Stats dashboard component
- `filters`: ReactNode - Filters component
- `grid`: Function returning grid content
- `sidebar?`: ReactNode - Sidebar component
- `showSidebar?`: boolean - Whether to show sidebar (default: true)
- `contentClassName?`: string - Custom layout for main content area

## Shared Components

### PageHeader

Unified header component for consistent page titles and actions.

```tsx
import { PageHeader } from '@/components/shared/page-header'

<PageHeader
  title="Page Title"
  subtitle="Optional description"
  showBackButton
  actions={<Button>Action</Button>}
/>
```

### StatsDashboard

Flexible stats display component.

```tsx
import { StatsDashboard } from '@/components/shared/stats-dashboard'

const stats = [
  {
    label: 'Total Items',
    value: 42,
    icon: FileText,
    trend: { value: 12, isPositive: true }
  }
]

<StatsDashboard stats={stats} columns={4} />
```

### FiltersBar

Unified filters component with search and dropdowns.

```tsx
import { FiltersBar } from '@/components/shared/filters-bar'

const filters = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' }
    ]
  }
]

<FiltersBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  filters={filters}
  filterValues={filterValues}
  onFilterChange={handleFilterChange}
/>
```

### ContentGrid

Generic grid component with loading, error, and empty states.

```tsx
import { ContentGrid } from '@/components/shared/content-grid'

<ContentGrid
  items={items}
  CardComponent={MyCard}
  isLoading={loading}
  emptyState={{
    title: 'No items found',
    description: 'Try adjusting your filters',
    action: { label: 'Create New', onClick: handleCreate }
  }}
  columns={3}
/>
```

### PageSidebar

Unified sidebar container.

```tsx
import { PageSidebar } from '@/components/shared/page-sidebar'

<PageSidebar sticky>
  {/* Sidebar content */}
</PageSidebar>
```

## Migration Guide

### Before (Old Pattern)

```tsx
export default function MyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  
  return (
    <div className="min-h-screen bg-gradient...">
      <TickerBanner />
      <NavigationWrapper />
      <div className="container mx-auto px-4 py-8">
        <MyHeader />
        <MyStats />
        <MyFilters ... />
        <div className="flex gap-8">
          <div className="flex-1">
            <MyGrid ... />
          </div>
          <div className="w-80 hidden xl:block">
            <MySidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
```

### After (New Pattern)

```tsx
export default function MyPage() {
  const state = useGridPageState({
    filters: { status: 'all' }
  })
  
  return (
    <GridPageLayout
      header={<MyHeader />}
      stats={<MyStats />}
      filters={<MyFilters {...state} />}
      grid={(props) => <MyGrid {...state} />}
      sidebar={<MySidebar />}
    />
  )
}
```

## Benefits

1. **DRY Principle**: Eliminates duplicate layout code
2. **Consistency**: Ensures uniform behavior across pages
3. **Maintainability**: Single source of truth for layouts
4. **Type Safety**: Full TypeScript support
5. **Flexibility**: Customizable while maintaining standards
6. **State Management**: Built-in hooks for common patterns

## Best Practices

1. Use the layout components for all new pages that follow grid patterns
2. Migrate existing pages incrementally
3. Keep page-specific logic in page components
4. Use shared components for common UI patterns
5. Customize through props rather than overriding styles