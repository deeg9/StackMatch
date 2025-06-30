'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  Search,
  Building2,
  DollarSign,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  QuoteRequestModalProps, 
  QuoteRequestData, 
  ExistingListing,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
  SOFTWARE_CATEGORIES 
} from '@/types/quote-request';

// Sample existing listings data
const mockExistingListings: ExistingListing[] = [
  {
    id: '1',
    title: 'CRM Solution for Sales Team',
    category: 'CRM',
    budget: { min: 50000, max: 100000, currency: 'USD' },
    deadline: '2025-03-15',
    status: 'active',
    description: 'Looking for a comprehensive CRM solution to manage our growing sales pipeline',
    requirements: ['Lead management', 'Email integration', 'Reporting dashboard', 'Mobile app'],
    createdAt: '2024-12-15'
  },
  {
    id: '2',
    title: 'Marketing Automation Platform',
    category: 'Marketing Automation',
    budget: { min: 20000, max: 50000, currency: 'USD' },
    deadline: '2025-02-28',
    status: 'draft',
    description: 'Need marketing automation tools for email campaigns and lead nurturing',
    requirements: ['Email campaigns', 'Lead scoring', 'Analytics', 'A/B testing'],
    createdAt: '2024-12-20'
  },
  {
    id: '3',
    title: 'Project Management Tool',
    category: 'Project Management',
    budget: { min: 10000, max: 25000, currency: 'USD' },
    deadline: '2025-04-01',
    status: 'active',
    description: 'Team collaboration and project tracking solution',
    requirements: ['Task management', 'Time tracking', 'Team collaboration', 'Reporting'],
    createdAt: '2024-12-10'
  }
];

export function RequestQuoteModal({ isOpen, onClose, vendor, onSubmit }: QuoteRequestModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<QuoteRequestData['requestType'] | 'initial-choice' | 'confirmation'>('initial-choice');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState<QuoteRequestData>({
    vendor,
    requestType: 'existing-listing',
    contactInfo: {
      preferredContact: 'email',
      email: '',
      urgency: 'standard'
    },
    status: 'draft'
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('initial-choice');
      setFormData(prev => ({
        ...prev,
        vendor,
        selectedListing: undefined,
        personalNote: '',
        customBudget: undefined,
        customDeadline: undefined
      }));
    }
  }, [isOpen, vendor]);

  const filteredListings = mockExistingListings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInitialChoice = (choice: 'existing-listing' | 'new-rfq') => {
    if (choice === 'new-rfq') {
      // Close modal and navigate to create listing page
      onClose();
      router.push('/create-listing');
      return;
    }
    
    setFormData(prev => ({ ...prev, requestType: choice }));
    setCurrentStep(choice);
  };

  const handleListingSelect = (listing: ExistingListing) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedListing: listing,
      customBudget: listing.budget,
      customDeadline: listing.deadline
    }));
    setCurrentStep('confirmation');
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'sent' as const
    };
    onSubmit(finalData);
    onClose();
  };

  const getModalTitle = () => {
    switch (currentStep) {
      case 'initial-choice':
        return (
          <div className="flex items-center gap-3">
            {vendor.logo && (
              <div className="relative h-8 w-8 rounded-lg overflow-hidden">
                <Image src={vendor.logo} alt={vendor.name} fill className="object-contain" />
              </div>
            )}
            <span>Request a Quote from {vendor.name}</span>
          </div>
        );
      case 'existing-listing':
        return 'Select a Listing to Send';
      case 'confirmation':
        return `Customize Request for ${vendor.name}`;
      default:
        return 'Request Quote';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stackmatch-navy">
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {currentStep === 'initial-choice' && (
            <motion.div
              key="initial-choice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 mt-6"
            >
              <p className="text-gray-600">
                How would you like to request a quote from {vendor.name}?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-stackmatch-blue"
                  onClick={() => handleInitialChoice('existing-listing')}
                >
                  <div className="text-center space-y-4">
                    <div className="p-3 bg-stackmatch-blue/10 rounded-xl mx-auto w-fit">
                      <FileText className="h-8 w-8 text-stackmatch-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
                        Use an Existing Listing
                      </h3>
                      <p className="text-sm text-gray-600">
                        Send one of your previously created RFQs directly to this vendor.
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-stackmatch-blue">
                      <span className="text-sm font-medium">Continue</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Card>

                <Card 
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-trust-green"
                  onClick={() => handleInitialChoice('new-rfq')}
                >
                  <div className="text-center space-y-4">
                    <div className="p-3 bg-trust-green/10 rounded-xl mx-auto w-fit">
                      <Sparkles className="h-8 w-8 text-trust-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
                        Create a New RFQ
                      </h3>
                      <p className="text-sm text-gray-600">
                        We&apos;ll guide you through creating a new listing to send.
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-trust-green">
                      <span className="text-sm font-medium">Start Creating</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {currentStep === 'existing-listing' && (
            <motion.div
              key="existing-listing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 mt-6"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search your listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredListings.map((listing) => (
                  <Card 
                    key={listing.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-stackmatch-blue"
                    onClick={() => handleListingSelect(listing)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div>
                            <h3 className="font-semibold text-stackmatch-navy">{listing.title}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                <Badge variant="secondary">{listing.category}</Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                ${listing.budget.min.toLocaleString()} - ${listing.budget.max.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(listing.deadline).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                          {listing.status}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('initial-choice')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'confirmation' && formData.selectedListing && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 mt-6"
            >
              {/* Listing Summary */}
              <Card className="p-4 bg-gray-50">
                <h3 className="font-semibold text-stackmatch-navy mb-3">Selected Listing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Title:</span>
                    <span className="text-sm">{formData.selectedListing.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Budget:</span>
                    <span className="text-sm">
                      ${formData.selectedListing.budget.min.toLocaleString()} - ${formData.selectedListing.budget.max.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Deadline:</span>
                    <span className="text-sm">{new Date(formData.selectedListing.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>

              {/* Personal Note */}
              <div className="space-y-2">
                <Label htmlFor="personal-note">
                  Add a Personal Note or Specific Instructions for {vendor.name} (Optional)
                </Label>
                <Textarea
                  id="personal-note"
                  placeholder={`Hi ${vendor.name} team,\n\nI&apos;m interested in getting a quote for this project. Please let me know if you need any additional information.\n\nBest regards`}
                  value={formData.personalNote || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, personalNote: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Quick Edit Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-dashed border-2 border-gray-300 hover:border-stackmatch-blue cursor-pointer">
                  <div className="text-center">
                    <DollarSign className="h-5 w-5 mx-auto text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Adjust Budget for this Request</span>
                  </div>
                </Card>
                <Card className="p-4 border-dashed border-2 border-gray-300 hover:border-stackmatch-blue cursor-pointer">
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Change Deadline for this Request</span>
                  </div>
                </Card>
              </div>

              {/* Contact Preferences */}
              <div className="space-y-4">
                <Label>Preferred Contact Method</Label>
                <RadioGroup 
                  value={formData.contactInfo.preferredContact} 
                  onValueChange={(value: 'email' | 'phone' | 'both') => 
                    setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, preferredContact: value }
                    }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone" />
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Both Email & Phone
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('existing-listing')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  className="bg-trust-green hover:bg-trust-green/90"
                  onClick={handleSubmit}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Send Customized Request to {vendor.name}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}