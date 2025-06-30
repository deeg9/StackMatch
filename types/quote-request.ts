export interface Vendor {
  id: string;
  name: string;
  logo?: string;
  description: string;
  categories: string[];
  location: string;
  founded: number;
  employeeCount: string;
  pricing: {
    tier: string;
    startingPrice: string;
  };
}

export interface ExistingListing {
  id: string;
  title: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  status: 'active' | 'draft' | 'closed';
  description: string;
  requirements: string[];
  createdAt: string;
}

export interface QuoteRequestStep {
  step: 'initial-choice' | 'select-listing' | 'customize-request' | 'create-new' | 'confirmation';
  isValid: boolean;
}

export interface QuoteRequestData {
  vendor: Vendor;
  requestType: 'existing-listing' | 'new-rfq';
  
  // For existing listing path
  selectedListing?: ExistingListing;
  personalNote?: string;
  customBudget?: {
    min: number;
    max: number;
    currency: string;
  };
  customDeadline?: string;
  
  // For new RFQ path (minimal quick requirements)
  quickRequirements?: {
    category: string;
    budget: {
      min: number;
      max: number;
      currency: string;
    };
    timeline: string;
    description: string;
    keyFeatures: string[];
  };
  
  // Contact and submission details
  contactInfo: {
    preferredContact: 'email' | 'phone' | 'both';
    phoneNumber?: string;
    email: string;
    urgency: 'standard' | 'urgent' | 'flexible';
  };
  
  // Metadata
  submittedAt?: string;
  status: 'draft' | 'sent' | 'responded' | 'accepted' | 'declined';
}

export interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
  onSubmit: (request: QuoteRequestData) => void;
}

export interface QuoteRequestStepProps {
  data: QuoteRequestData;
  onDataChange: (data: Partial<QuoteRequestData>) => void;
  onNext: () => void;
  onBack: () => void;
  vendor: Vendor;
}

// Budget ranges for quick selection
export const BUDGET_RANGES = [
  { label: 'Under $10K', min: 0, max: 10000 },
  { label: '$10K - $50K', min: 10000, max: 50000 },
  { label: '$50K - $100K', min: 50000, max: 100000 },
  { label: '$100K - $500K', min: 100000, max: 500000 },
  { label: '$500K+', min: 500000, max: 2000000 },
  { label: 'Custom Range', min: 0, max: 0 }
] as const;

// Timeline options for quick selection
export const TIMELINE_OPTIONS = [
  { label: 'ASAP (1-2 weeks)', value: '1-2 weeks' },
  { label: '1 Month', value: '1 month' },
  { label: '2-3 Months', value: '2-3 months' },
  { label: '6 Months', value: '6 months' },
  { label: '1+ Years', value: '1+ years' },
  { label: 'Flexible', value: 'flexible' }
] as const;

// Software categories aligned with existing system
export const SOFTWARE_CATEGORIES = [
  'CRM',
  'Marketing Automation',
  'Sales Tools',
  'Project Management',
  'Communication',
  'HR & Recruiting',
  'Accounting & Finance',
  'Analytics & BI',
  'Security',
  'Productivity',
  'Development Tools',
  'E-commerce',
  'Customer Support',
  'ERP',
  'Other'
] as const;