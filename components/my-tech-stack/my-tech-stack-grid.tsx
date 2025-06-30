'use client';

import { useState } from 'react';
import { TechStackCard, TechStackItem } from './tech-stack-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, AlertCircle, XCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Sample data for tech stack items
const sampleTechStack: TechStackItem[] = [
  {
    id: '1',
    name: 'Salesforce',
    logo: '/logos/salesforce.png',
    category: 'CRM',
    annualCost: 156000,
    monthlyCost: 13000,
    renewalDate: '2025-03-15',
    status: 'renewal-approaching',
    owner: 'Sarah Chen',
    department: 'Sales Dept',
    totalLicenses: 150,
    activeLicenses: 142,
    utilizationRate: 95,
    contractType: 'Enterprise',
    vendor: 'Salesforce Inc.'
  },
  {
    id: '2',
    name: 'Microsoft 365',
    logo: '/logos/microsoft.png',
    category: 'Productivity',
    annualCost: 84000,
    monthlyCost: 7000,
    renewalDate: '2025-06-01',
    status: 'active',
    owner: 'Michael Ross',
    department: 'IT Dept',
    totalLicenses: 350,
    activeLicenses: 342,
    utilizationRate: 98,
    contractType: 'Enterprise',
    vendor: 'Microsoft Corporation'
  },
  {
    id: '3',
    name: 'Slack',
    logo: '/logos/slack.png',
    category: 'Communication',
    annualCost: 28800,
    monthlyCost: 2400,
    renewalDate: '2025-02-10',
    status: 'renewal-approaching',
    owner: 'Jessica Martinez',
    department: 'Operations Dept',
    totalLicenses: 300,
    activeLicenses: 285,
    utilizationRate: 95,
    contractType: 'Business+',
    vendor: 'Slack Technologies'
  },
  {
    id: '4',
    name: 'HubSpot',
    logo: '/logos/hubspot.png',
    category: 'Marketing',
    annualCost: 45600,
    monthlyCost: 3800,
    renewalDate: '2025-08-20',
    status: 'active',
    owner: 'David Kim',
    department: 'Marketing Dept',
    totalLicenses: 50,
    activeLicenses: 48,
    utilizationRate: 96,
    contractType: 'Professional',
    vendor: 'HubSpot Inc.'
  },
  {
    id: '5',
    name: 'Zoom',
    logo: '/logos/zoom.png',
    category: 'Communication',
    annualCost: 19200,
    monthlyCost: 1600,
    renewalDate: '2025-04-05',
    status: 'active',
    owner: 'Emily Johnson',
    department: 'HR Dept',
    totalLicenses: 200,
    activeLicenses: 180,
    utilizationRate: 90,
    contractType: 'Business',
    vendor: 'Zoom Video Communications'
  },
  {
    id: '6',
    name: 'Jira',
    logo: '/logos/atlassian.png',
    category: 'Project Management',
    annualCost: 24000,
    monthlyCost: 2000,
    renewalDate: '2025-05-15',
    status: 'active',
    owner: 'Alex Thompson',
    department: 'Engineering Dept',
    totalLicenses: 100,
    activeLicenses: 95,
    utilizationRate: 95,
    contractType: 'Premium',
    vendor: 'Atlassian Corporation'
  },
  {
    id: '7',
    name: 'DocuSign',
    logo: '/logos/docusign.png',
    category: 'Legal',
    annualCost: 14400,
    monthlyCost: 1200,
    renewalDate: '2025-02-28',
    status: 'renewal-approaching',
    owner: 'Rachel Green',
    department: 'Legal Dept',
    totalLicenses: 30,
    activeLicenses: 25,
    utilizationRate: 83,
    contractType: 'Business Pro',
    vendor: 'DocuSign Inc.'
  },
  {
    id: '8',
    name: 'Tableau',
    logo: '/logos/tableau.png',
    category: 'Analytics',
    annualCost: 42000,
    monthlyCost: 3500,
    renewalDate: '2025-07-10',
    status: 'active',
    owner: 'Chris Anderson',
    department: 'Finance Dept',
    totalLicenses: 25,
    activeLicenses: 20,
    utilizationRate: 80,
    contractType: 'Creator',
    vendor: 'Salesforce Inc.'
  },
  {
    id: '9',
    name: 'Adobe Creative Cloud',
    logo: '/logos/adobe.png',
    category: 'Design',
    annualCost: 31200,
    monthlyCost: 2600,
    renewalDate: '2025-09-01',
    status: 'active',
    owner: 'Lisa Wong',
    department: 'Marketing Dept',
    totalLicenses: 40,
    activeLicenses: 35,
    utilizationRate: 88,
    contractType: 'Teams',
    vendor: 'Adobe Inc.'
  },
  {
    id: '10',
    name: 'Workday',
    logo: '/logos/workday.png',
    category: 'HR',
    annualCost: 96000,
    monthlyCost: 8000,
    renewalDate: '2025-01-30',
    status: 'renewal-approaching',
    owner: 'Mark Davis',
    department: 'HR Dept',
    totalLicenses: 400,
    activeLicenses: 380,
    utilizationRate: 95,
    contractType: 'Enterprise',
    vendor: 'Workday Inc.'
  },
  {
    id: '11',
    name: 'GitHub Enterprise',
    logo: '/logos/github.png',
    category: 'Development',
    annualCost: 21000,
    monthlyCost: 1750,
    renewalDate: '2025-10-15',
    status: 'active',
    owner: 'Tom Wilson',
    department: 'Engineering Dept',
    totalLicenses: 100,
    activeLicenses: 85,
    utilizationRate: 85,
    contractType: 'Enterprise',
    vendor: 'GitHub Inc.'
  },
  {
    id: '12',
    name: 'Zendesk',
    logo: '/logos/zendesk.png',
    category: 'Customer Service',
    annualCost: 36000,
    monthlyCost: 3000,
    renewalDate: '2025-04-20',
    status: 'active',
    owner: 'Nancy Taylor',
    department: 'Support Dept',
    totalLicenses: 60,
    activeLicenses: 42,
    utilizationRate: 70,
    contractType: 'Professional',
    vendor: 'Zendesk Inc.'
  },
  {
    id: '13',
    name: 'QuickBooks',
    logo: '/logos/quickbooks.png',
    category: 'Accounting',
    annualCost: 1800,
    monthlyCost: 150,
    renewalDate: '2025-11-01',
    status: 'inactive',
    owner: 'John Smith',
    department: 'Finance Dept',
    totalLicenses: 5,
    activeLicenses: 0,
    utilizationRate: 0,
    contractType: 'Plus',
    vendor: 'Intuit Inc.'
  },
  {
    id: '14',
    name: 'Okta',
    logo: '/logos/okta.png',
    category: 'Security',
    annualCost: 48000,
    monthlyCost: 4000,
    renewalDate: '2025-03-01',
    status: 'trial',
    owner: 'Security Team',
    department: 'IT Dept',
    totalLicenses: 400,
    activeLicenses: 50,
    utilizationRate: 13,
    contractType: 'Trial',
    vendor: 'Okta Inc.'
  }
];

interface MyTechStackGridProps {
  searchQuery: string;
  selectedOwner: string;
  selectedStatus: string;
  sortBy: string;
  viewType: 'list' | 'grid';
}

export function MyTechStackGrid({
  searchQuery,
  selectedOwner,
  selectedStatus,
  sortBy,
  viewType
}: MyTechStackGridProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  // Filter function
  const filterItems = (items: TechStackItem[]) => {
    return items.filter(item => {
      // Search filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Owner/Department filter
      if (selectedOwner !== 'all') {
        const dept = selectedOwner.charAt(0).toUpperCase() + selectedOwner.slice(1) + ' Dept';
        if (item.department !== dept) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  };

  // Sort function
  const sortItems = (items: TechStackItem[]) => {
    const sorted = [...items];
    
    switch (sortBy) {
      case 'cost-high':
        return sorted.sort((a, b) => b.annualCost - a.annualCost);
      case 'cost-low':
        return sorted.sort((a, b) => a.annualCost - b.annualCost);
      case 'renewal-soon':
        return sorted.sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
      case 'renewal-late':
        return sorted.sort((a, b) => new Date(b.renewalDate).getTime() - new Date(a.renewalDate).getTime());
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'usage-high':
        return sorted.sort((a, b) => b.utilizationRate - a.utilizationRate);
      case 'usage-low':
        return sorted.sort((a, b) => a.utilizationRate - b.utilizationRate);
      default:
        return sorted;
    }
  };

  // Get filtered and sorted items
  const processedItems = sortItems(filterItems(sampleTechStack));

  // Tab filtering
  const getTabItems = () => {
    switch (activeTab) {
      case 'active':
        return processedItems.filter(item => item.status === 'active');
      case 'expiring':
        return processedItems.filter(item => item.status === 'renewal-approaching');
      case 'unused':
        return processedItems.filter(item => item.utilizationRate < 50);
      default:
        return processedItems;
    }
  };

  const tabItems = getTabItems();

  const handleViewDetails = (id: string) => {
    // Navigate to software details page
    router.push(`/my-tech-stack/${id}`);
  };

  const handleExploreAlternatives = (item: TechStackItem) => {
    // Navigate to create listing page with pre-filled data
    router.push(`/listings/create?category=${item.category}&replacing=${item.name}`);
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
        <Package className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border">
          <TabsTrigger value="all" className="gap-2">
            <Package className="h-4 w-4" />
            All ({processedItems.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <Zap className="h-4 w-4" />
            Active ({processedItems.filter(item => item.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="expiring" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Expiring Soon ({processedItems.filter(item => item.status === 'renewal-approaching').length})
          </TabsTrigger>
          <TabsTrigger value="unused" className="gap-2">
            <XCircle className="h-4 w-4" />
            Underutilized ({processedItems.filter(item => item.utilizationRate < 50).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {tabItems.length === 0 ? (
            <EmptyState 
              message={
                activeTab === 'all' ? 'No software found matching your criteria' :
                activeTab === 'active' ? 'No active subscriptions' :
                activeTab === 'expiring' ? 'No subscriptions expiring soon' :
                'All software is being well utilized'
              }
            />
          ) : (
            <div className={
              viewType === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                : 'space-y-4'
            }>
              {tabItems.map((item, index) => (
                <TechStackCard
                  key={item.id}
                  item={item}
                  viewType={viewType}
                  onViewDetails={handleViewDetails}
                  onExploreAlternatives={handleExploreAlternatives}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}