export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'active': return 'bg-[#22C55E] text-white'
    case 'in review': return 'bg-[#F59E0B] text-white'
    case 'draft': return 'bg-[#6B7280] text-white'
    case 'closed': return 'bg-[#6B7280] text-white'
    case 'archived': return 'bg-[#374151] text-white'
    default: return 'bg-[#D1D5DB] text-[#374151]'
  }
}

export function getProposalStatusColor(status: string) {
  switch (status.toLowerCase().replace(' ', '_')) {
    case 'submitted': return 'bg-[#3B82F6] text-white'
    case 'under_review': return 'bg-[#F59E0B] text-white'
    case 'in_review': return 'bg-[#F59E0B] text-white'
    case 'accepted': return 'bg-[#22C55E] text-white'
    case 'rejected': return 'bg-red-500 text-white'
    default: return 'bg-[#D1D5DB] text-[#374151]'
  }
}

export function formatBudget(min: number | null, max: number | null) {
  if (!min && !max) return 'Not specified'
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  if (min) return `From $${min.toLocaleString()}`
  if (max) return `Up to $${max.toLocaleString()}`
  return 'Not specified'
}

export function calculateTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffHours < 1) {
    return 'Just now'
  } else if (diffHours === 1) {
    return '1 hour ago'
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else if (diffDays === 1) {
    return '1 day ago'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  } else {
    const months = Math.ceil(diffDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }
}

export function getListingStatusDotColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active': return '#22C55E' // green
    case 'in review': return '#F59E0B' // orange
    case 'closed': return '#6B7280' // gray
    default: return '#6B7280' // gray
  }
}

export function formatCompactBudget(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`
  }
  return `$${value}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}