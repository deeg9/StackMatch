'use client';

import { Server, TrendingUp, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function MyTechStackHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="p-3 bg-stackmatch-blue/10 rounded-xl animate-float"
        >
          <Server className="h-8 w-8 text-stackmatch-blue" />
        </motion.div>
        <div>
          <h1 className="text-4xl font-bold text-stackmatch-navy">
            My Tech Stack
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Manage your software inventory and optimize your technology investments
          </p>
        </div>
      </div>

      {/* Quick Overview Stats */}
      <div className="flex flex-wrap gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-trust-green/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-trust-green" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Utilization Rate</p>
            <p className="text-lg font-semibold text-stackmatch-navy">87%</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-stackmatch-blue/10 rounded-lg">
            <DollarSign className="h-5 w-5 text-stackmatch-blue" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Spend</p>
            <p className="text-lg font-semibold text-stackmatch-navy">$45,670</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-orange-100 rounded-lg">
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Licenses</p>
            <p className="text-lg font-semibold text-stackmatch-navy">342</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}