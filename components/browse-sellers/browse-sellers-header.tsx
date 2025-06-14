"use client"

import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"

export function BrowseSellersHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 mb-2">
          Browse Sellers
        </h1>
        <p className="text-slate-400">Discover talented software developers and connect with top providers</p>
      </div>
      <div className="flex gap-3">
        <Link href="/saved-sellers">
          <Button variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
            <FileText className="w-4 h-4 mr-2" />
            Saved Sellers
          </Button>
        </Link>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Post a Project
        </Button>
      </div>
    </div>
  )
}
