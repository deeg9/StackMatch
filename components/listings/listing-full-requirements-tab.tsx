'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  Settings, 
  Link2, 
  Shield, 
  Server, 
  Zap,
  FileText,
  Users,
  Database,
  Cloud,
  Lock,
  BarChart
} from 'lucide-react'

interface ListingFullRequirementsTabProps {
  listing: any
}

export function ListingFullRequirementsTab({ listing }: ListingFullRequirementsTabProps) {
  return (
    <div className="space-y-6">
      {/* Requirements Overview */}
      <Card className="border-2 border-stackmatch-blue bg-gradient-to-br from-stackmatch-blue/5 to-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-stackmatch-navy">
            Comprehensive Requirements Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-medium-gray leading-relaxed">
            This section contains all technical and functional requirements for the project. 
            Review each category carefully to ensure your solution meets all specified needs.
          </p>
        </CardContent>
      </Card>

      {/* Core Requirements */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-trust-green" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Core Requirements
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employee Count */}
          <div>
            <h4 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-stackmatch-blue" />
              Organization Size
            </h4>
            <p className="text-lg text-charcoal bg-light-gray/30 p-3 rounded-lg">
              {listing.coreRequirements?.employeeCount || 'Not specified'}
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-attention-orange" />
              Required Features & Functionality
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {listing.coreRequirements?.features?.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-light-gray/20 rounded-lg hover:bg-light-gray/40 transition-colors">
                  <CheckCircle className="h-4 w-4 text-trust-green flex-shrink-0" />
                  <span className="text-charcoal">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-stackmatch-blue" />
              Required Integrations
            </h4>
            <div className="flex flex-wrap gap-2">
              {listing.coreRequirements?.integrations?.map((integration: string, index: number) => (
                <Badge key={index} className="bg-stackmatch-blue/10 text-stackmatch-blue border border-stackmatch-blue/20 px-3 py-1">
                  {integration}
                </Badge>
              ))}
            </div>
          </div>

          {/* Compliance */}
          <div>
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-trust-green" />
              Compliance Requirements
            </h4>
            <div className="flex flex-wrap gap-2">
              {listing.coreRequirements?.complianceNeeds?.map((compliance: string, index: number) => (
                <Badge key={index} className="bg-trust-green/10 text-trust-green border border-trust-green/20 px-3 py-1">
                  {compliance}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-stackmatch-blue" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Technical Specifications
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deployment" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="deployment" className="text-xs sm:text-sm">
                <Cloud className="h-3 w-3 mr-1" />
                Deployment
              </TabsTrigger>
              <TabsTrigger value="scalability" className="text-xs sm:text-sm">
                <BarChart className="h-3 w-3 mr-1" />
                Scalability
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs sm:text-sm">
                <Lock className="h-3 w-3 mr-1" />
                Security
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs sm:text-sm">
                <Database className="h-3 w-3 mr-1" />
                Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deployment" className="space-y-4">
              <div className="p-4 bg-light-gray/20 rounded-lg">
                <h5 className="font-semibold text-charcoal mb-2">Deployment Model</h5>
                <p className="text-medium-gray">{listing.technicalSpecs?.deployment || 'Not specified'}</p>
              </div>
            </TabsContent>

            <TabsContent value="scalability" className="space-y-4">
              <div className="p-4 bg-light-gray/20 rounded-lg">
                <h5 className="font-semibold text-charcoal mb-2">Scalability Requirements</h5>
                <p className="text-medium-gray">{listing.technicalSpecs?.scalability || 'Not specified'}</p>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="space-y-3">
                <h5 className="font-semibold text-charcoal">Security Requirements</h5>
                {listing.technicalSpecs?.security?.map((requirement: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-light-gray/20 rounded-lg">
                    <Shield className="h-4 w-4 text-trust-green flex-shrink-0" />
                    <span className="text-charcoal">{requirement}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <div className="p-4 bg-light-gray/20 rounded-lg">
                <h5 className="font-semibold text-charcoal mb-2">Data Requirements</h5>
                <p className="text-medium-gray">{listing.technicalSpecs?.dataRequirements || 'Not specified'}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

    </div>
  )
}