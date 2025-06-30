'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Calculator, 
  Mail, 
  PenTool, 
  ArrowRight,
  FileSpreadsheet,
  Receipt,
  Keyboard,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddSoftwareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const integrationOptions = [
  {
    id: 'accounting',
    title: 'Connect Accounting Software',
    description: 'Automatically sync software expenses from NetSuite, QuickBooks, or other accounting platforms',
    icon: Calculator,
    color: 'blue',
    examples: ['NetSuite', 'QuickBooks', 'Xero', 'SAP'],
    benefits: [
      'Real-time expense tracking',
      'Automatic categorization',
      'Historical data import'
    ]
  },
  {
    id: 'invoices',
    title: 'Forward Vendor Invoices',
    description: 'Get a unique email address to forward all software invoices for automatic processing',
    icon: Mail,
    color: 'green',
    email: 'invoices-384729@stackmatch.io',
    benefits: [
      'AI-powered invoice parsing',
      'Automatic vendor matching',
      'Contract term extraction'
    ]
  },
  {
    id: 'manual',
    title: 'Enter Manually',
    description: 'Add software details manually with our guided form for complete control',
    icon: PenTool,
    color: 'purple',
    benefits: [
      'Full customization',
      'Immediate availability',
      'Bulk import option'
    ]
  }
];

export function AddSoftwareModal({ isOpen, onClose }: AddSoftwareModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    if (optionId === 'invoices') {
      // Copy email to clipboard
      navigator.clipboard.writeText('invoices-384729@stackmatch.io');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const getColorClasses = (color: string) => {
    const classes = {
      blue: 'bg-stackmatch-blue/10 text-stackmatch-blue border-stackmatch-blue/20',
      green: 'bg-trust-green/10 text-trust-green border-trust-green/20',
      purple: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return classes[color as keyof typeof classes];
  };

  const getIconBgClasses = (color: string) => {
    const classes = {
      blue: 'bg-stackmatch-blue/10',
      green: 'bg-trust-green/10',
      purple: 'bg-purple-100'
    };
    return classes[color as keyof typeof classes];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stackmatch-navy">
            Add Software to Your Tech Stack
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Choose how you&apos;d like to import your software subscriptions
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {integrationOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? `ring-2 ring-offset-2 ${
                          option.color === 'blue' ? 'ring-stackmatch-blue' :
                          option.color === 'green' ? 'ring-trust-green' :
                          'ring-purple-500'
                        }` 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${getIconBgClasses(option.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-stackmatch-navy">
                          {option.title}
                        </h3>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="p-1 bg-trust-green rounded-full"
                          >
                            <Check className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{option.description}</p>

                      {option.examples && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {option.examples.map((example) => (
                            <span
                              key={example}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      )}

                      {option.email && (
                        <div className="mb-3">
                          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getColorClasses(option.color)}`}>
                            <Mail className="h-4 w-4" />
                            <code className="text-sm font-mono">{option.email}</code>
                            {copiedEmail && option.id === 'invoices' && (
                              <span className="text-xs font-medium">Copied!</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        {option.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            {benefit}
                          </div>
                        ))}
                      </div>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t"
                          >
                            {option.id === 'accounting' && (
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700">
                                  Select your accounting platform:
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                  {option.examples?.map((platform) => (
                                    <Button
                                      key={platform}
                                      variant="outline"
                                      className="justify-start gap-2"
                                    >
                                      <FileSpreadsheet className="h-4 w-4" />
                                      {platform}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {option.id === 'invoices' && (
                              <div className="space-y-3">
                                <p className="text-sm text-gray-700">
                                  <strong>Next Steps:</strong> Forward any software invoice to the email address above. 
                                  Our AI will automatically parse and add it to your tech stack.
                                </p>
                                <Button className="w-full bg-trust-green hover:bg-trust-green/90">
                                  <Receipt className="h-4 w-4 mr-2" />
                                  I&apos;ve Copied the Email Address
                                </Button>
                              </div>
                            )}

                            {option.id === 'manual' && (
                              <div className="space-y-3">
                                <p className="text-sm text-gray-700">
                                  Add software details using our simple form
                                </p>
                                <Button className="w-full bg-stackmatch-blue hover:bg-stackmatch-blue/90">
                                  <Keyboard className="h-4 w-4 mr-2" />
                                  Open Manual Entry Form
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-500">
            Import your entire tech stack in minutes
          </p>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}