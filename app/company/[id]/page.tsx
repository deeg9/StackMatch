import { Suspense } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { CompanyHeader } from '@/components/company/company-header'
import { CompanyTabs } from '@/components/company/company-tabs'
import { CompanySidebar } from '@/components/company/company-sidebar'
import CompanyLoading from './loading'

interface CompanyProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function CompanyProfilePage({ params }: CompanyProfilePageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <Suspense fallback={<CompanyLoading />}>
        <main>
          {/* Company Header Banner */}
          <CompanyHeader companyId={id} />
          
          {/* Main Content Area */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content - Tabs */}
              <div className="lg:col-span-3">
                <CompanyTabs companyId={id} />
              </div>
              
              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                <CompanySidebar companyId={id} />
              </div>
            </div>
          </div>
        </main>
      </Suspense>
    </div>
  )
}