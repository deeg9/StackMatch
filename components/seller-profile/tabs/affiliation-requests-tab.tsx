"use client"

import React from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useUser } from "hooks/useUser"
import type { AffiliationRequest } from "types/AffiliationRequest"
import type { Profile } from "types/Profile"
import type { BuyerProfile } from "types/BuyerProfile"
import type { SellerProfile } from "types/SellerProfile"

const AffiliationRequestsTab: React.FC = () => {
  const supabase = useSupabaseClient()
  const { user } = useUser()
  const [requests, setRequests] = React.useState<AffiliationRequest[]>([])
  const [profiles, setProfiles] = React.useState<Profile[]>([])
  const [buyerProfiles, setBuyerProfiles] = React.useState<BuyerProfile[]>([])
  const [sellerProfiles, setSellerProfiles] = React.useState<SellerProfile[]>([])

  React.useEffect(() => {
    const fetchAffiliationRequests = async () => {
      const { data, error } = await supabase.from("affiliation_requests").select("*").eq("seller_id", user?.id)

      if (error) {
        console.error("Error fetching affiliation requests:", error)
      } else {
        setRequests(data)
      }
    }

    const fetchProfiles = async () => {
      const { data, error } = await supabase.from("profiles").select("*")

      if (error) {
        console.error("Error fetching profiles:", error)
      } else {
        setProfiles(data)
      }
    }

    const fetchBuyerProfiles = async () => {
      const { data, error } = await supabase.from("buyer_profiles").select("*")

      if (error) {
        console.error("Error fetching buyer profiles:", error)
      } else {
        setBuyerProfiles(data)
      }
    }

    const fetchSellerProfiles = async () => {
      const { data, error } = await supabase.from("seller_profiles").select("*")

      if (error) {
        console.error("Error fetching seller profiles:", error)
      } else {
        setSellerProfiles(data)
      }
    }

    fetchAffiliationRequests()
    fetchProfiles()
    fetchBuyerProfiles()
    fetchSellerProfiles()
  }, [supabase, user])

  return (
    <div>
      <h2>Affiliation Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <p>Request ID: {request.id}</p>
            <p>Buyer ID: {request.buyer_id}</p>
            <p>Status: {request.status}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AffiliationRequestsTab
