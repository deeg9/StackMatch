'use client';

import { motion } from 'framer-motion';
import { CheckCircle, MessageSquare, Calendar, ArrowRight, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuoteRequestSuccessProps {
  vendorName: string;
  requestType: 'existing-listing' | 'new-rfq';
  listingTitle?: string;
  isVisible: boolean;
  onClose: () => void;
  onViewDashboard: () => void;
}

export function QuoteRequestSuccess({
  vendorName,
  requestType,
  listingTitle,
  isVisible,
  onClose,
  onViewDashboard
}: QuoteRequestSuccessProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <Card className="max-w-lg mx-4 p-6 bg-white">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-trust-green/10 rounded-full">
              <CheckCircle className="h-6 w-6 text-trust-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stackmatch-navy">
                Quote Request Sent!
              </h3>
              <p className="text-sm text-gray-600">
                Your request has been sent to {vendorName}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Request Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Request Type:</span>
              <Badge variant={requestType === 'existing-listing' ? 'default' : 'secondary'}>
                {requestType === 'existing-listing' ? 'Existing Listing' : 'New RFQ'}
              </Badge>
            </div>
            {listingTitle && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Listing:</span>
                <span className="text-sm text-gray-600">{listingTitle}</span>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h4 className="font-medium text-stackmatch-navy">What happens next?</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-stackmatch-blue/10 rounded-full mt-0.5">
                  <MessageSquare className="h-3 w-3 text-stackmatch-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium">Vendor Review</p>
                  <p className="text-xs text-gray-600">
                    {vendorName} will review your request and requirements
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-stackmatch-blue/10 rounded-full mt-0.5">
                  <Calendar className="h-3 w-3 text-stackmatch-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium">Response Timeline</p>
                  <p className="text-xs text-gray-600">
                    Most vendors respond within 1-2 business days
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-trust-green/10 rounded-full mt-0.5">
                  <CheckCircle className="h-3 w-3 text-trust-green" />
                </div>
                <div>
                  <p className="text-sm font-medium">Quote Delivery</p>
                  <p className="text-xs text-gray-600">
                    You&apos;ll receive their proposal in your dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Continue Browsing
            </Button>
            <Button 
              onClick={onViewDashboard}
              className="flex-1 bg-stackmatch-blue hover:bg-stackmatch-blue/90"
            >
              View Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Toast notification component for inline feedback
export function QuoteRequestToast({
  vendorName,
  isVisible,
  onClose
}: {
  vendorName: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="p-4 shadow-lg border-l-4 border-l-trust-green max-w-sm">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-trust-green/10 rounded-full">
            <CheckCircle className="h-4 w-4 text-trust-green" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-stackmatch-navy">
              Quote request sent!
            </p>
            <p className="text-xs text-gray-600">
              {vendorName} will review your request
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}