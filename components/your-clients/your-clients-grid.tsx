'use client';

import { useState, useEffect } from 'react';
import { ClientCard, Client } from './client-card';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data for clients
const sampleClients: Client[] = [
  {
    id: '1',
    companyName: 'TechCorp Industries',
    logo: 'https://logo.clearbit.com/techcorp.com',
    industry: 'Technology',
    currentAnnualValue: 450000,
    activeAgreements: 3,
    nextRenewalDate: '2025-03-15',
    status: 'renewal-approaching',
    primaryService: 'CRM Solutions',
    contractStartDate: '2023-03-15',
    lastContactDate: '2025-01-20',
    accountManager: 'Sarah Chen'
  },
  {
    id: '2',
    companyName: 'HealthTech Solutions',
    logo: 'https://logo.clearbit.com/healthtech.com',
    industry: 'Healthcare',
    currentAnnualValue: 280000,
    activeAgreements: 2,
    nextRenewalDate: '2025-06-30',
    status: 'active',
    primaryService: 'Analytics Platform',
    contractStartDate: '2023-06-30',
    lastContactDate: '2025-01-15',
    accountManager: 'Michael Ross'
  },
  {
    id: '3',
    companyName: 'Global Finance Corp',
    logo: 'https://logo.clearbit.com/globalfinance.com',
    industry: 'Finance',
    currentAnnualValue: 520000,
    activeAgreements: 4,
    nextRenewalDate: '2025-04-20',
    status: 'active',
    primaryService: 'Security Solutions',
    contractStartDate: '2022-04-20',
    lastContactDate: '2025-01-18',
    accountManager: 'Jessica Martinez'
  },
  {
    id: '4',
    companyName: 'RetailFlow Systems',
    logo: 'https://logo.clearbit.com/retailflow.com',
    industry: 'Retail',
    currentAnnualValue: 125000,
    activeAgreements: 1,
    nextRenewalDate: '2025-02-28',
    status: 'renewal-approaching',
    primaryService: 'E-commerce Platform',
    contractStartDate: '2024-02-28',
    lastContactDate: '2025-01-10',
    accountManager: 'David Kim'
  },
  {
    id: '5',
    companyName: 'EduTech Partners',
    logo: 'https://logo.clearbit.com/edutech.com',
    industry: 'Education',
    currentAnnualValue: 95000,
    activeAgreements: 1,
    nextRenewalDate: '2025-08-15',
    status: 'active',
    primaryService: 'HR Management',
    contractStartDate: '2023-08-15',
    lastContactDate: '2025-01-05',
    accountManager: 'Emily Johnson'
  },
  {
    id: '6',
    companyName: 'Manufacturing Plus',
    logo: 'https://logo.clearbit.com/manufacturingplus.com',
    industry: 'Manufacturing',
    currentAnnualValue: 340000,
    activeAgreements: 3,
    nextRenewalDate: '2025-05-10',
    status: 'active',
    primaryService: 'CRM Solutions',
    contractStartDate: '2022-05-10',
    lastContactDate: '2025-01-22',
    accountManager: 'Robert Chen'
  },
  {
    id: '7',
    companyName: 'DataCorp Analytics',
    logo: 'https://logo.clearbit.com/datacorp.com',
    industry: 'Data & Analytics',
    currentAnnualValue: 180000,
    activeAgreements: 2,
    nextRenewalDate: '2024-12-31',
    status: 'inactive',
    primaryService: 'Analytics Platform',
    contractStartDate: '2023-01-01',
    lastContactDate: '2024-12-15',
    accountManager: 'Lisa Wang'
  },
  {
    id: '8',
    companyName: 'MarketingPro Agency',
    logo: 'https://logo.clearbit.com/marketingpro.com',
    industry: 'Marketing',
    currentAnnualValue: 75000,
    activeAgreements: 1,
    nextRenewalDate: '2025-07-01',
    status: 'active',
    primaryService: 'Marketing Automation',
    contractStartDate: '2024-07-01',
    lastContactDate: '2025-01-19',
    accountManager: 'James Wilson'
  }
];

interface YourClientsGridProps {
  searchQuery: string;
  selectedService: string;
  selectedStatus: string;
  sortBy: string;
  viewType: 'list' | 'grid';
}

export function YourClientsGrid({
  searchQuery,
  selectedService,
  selectedStatus,
  sortBy,
  viewType
}: YourClientsGridProps) {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [filteredClients, setFilteredClients] = useState<Client[]>(sampleClients);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...clients];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Service filter
    if (selectedService !== 'all') {
      filtered = filtered.filter(client => {
        const serviceMap: { [key: string]: string } = {
          'crm': 'CRM Solutions',
          'analytics': 'Analytics Platform',
          'ecommerce': 'E-commerce Platform',
          'marketing': 'Marketing Automation',
          'hr': 'HR Management',
          'security': 'Security Solutions'
        };
        return client.primaryService === serviceMap[selectedService];
      });
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(client => client.status === selectedStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value-high':
          return b.currentAnnualValue - a.currentAnnualValue;
        case 'value-low':
          return a.currentAnnualValue - b.currentAnnualValue;
        case 'renewal-soon':
          return new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
        case 'name-asc':
          return a.companyName.localeCompare(b.companyName);
        case 'name-desc':
          return b.companyName.localeCompare(a.companyName);
        default:
          return 0;
      }
    });

    setFilteredClients(filtered);
  }, [searchQuery, selectedService, selectedStatus, sortBy, clients]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredClients.length === 0) {
    return (
      <Card className="text-center py-16">
        <CardContent>
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stackmatch-navy mb-2">No clients found</h3>
          <p className="text-medium-gray">Try adjusting your filters or search criteria</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn(
      viewType === 'grid' 
        ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
        : 'space-y-4'
    )}>
      {filteredClients.map((client) => (
        <ClientCard 
          key={client.id} 
          client={client} 
          viewType={viewType}
        />
      ))}
    </div>
  );
}