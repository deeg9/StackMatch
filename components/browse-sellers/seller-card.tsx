"use client"

import type React from "react"
import type { Seller } from "@/types"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

interface SellerCardProps {
  seller: Seller
}

const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
            {seller.company_name?.[0] || "S"}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{seller.company_name}</h3>
            <p className="text-sm text-gray-400">{seller.location}</p>
          </div>
          {seller.is_top_rated && (
            <span className="ml-auto bg-amber-900/30 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-800">
              TOP RATED
            </span>
          )}
        </div>

        <div className="flex items-center mb-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(seller.rating || 0) ? "text-yellow-400" : "text-gray-600"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          <span className="ml-2 text-white">{seller.rating}</span>
          <span className="ml-2 text-gray-400">({seller.projects_count || 0} projects)</span>
        </div>

        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{seller.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {seller.expertise?.slice(0, 3).map((skill, index) => (
            <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
          {(seller.expertise?.length || 0) > 3 && (
            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
              +{(seller.expertise?.length || 0) - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {seller.response_time}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {seller.experience}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {seller.hourly_rate}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white"
            onClick={() => {
              /* Open proposal request modal */
            }}
          >
            Request Proposal
          </Button>
          <Link href={`/sellers/${seller.id}`} passHref>
            <Button variant="default" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SellerCard
