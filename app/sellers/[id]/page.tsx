import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLinkIcon, User2Icon } from "lucide-react"
import { ProposalRequestButton } from "@/components/proposal-requests/proposal-request-button"

async function getSeller(id: string) {
  const supabase = createClient()
  const { data: seller, error } = await supabase.from("sellers").select("*").eq("user_id", id).single()

  if (error) {
    console.log(error)
    return null
  }

  return seller
}

export default async function SellerPage({ params }: { params: { id: string } }) {
  const seller = await getSeller(params.id)

  if (!seller) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={seller.logo_url || "/placeholder.svg"} />
              <AvatarFallback>
                <User2Icon />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{seller.company_name}</CardTitle>
              <CardDescription>{seller.company_description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <p>Email: {seller.contact_email}</p>
              <p>Phone: {seller.contact_phone}</p>
              <p>
                Website:{" "}
                <a
                  href={seller.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {seller.website_url} <ExternalLinkIcon className="inline-block w-4 h-4" />
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p>Address: {seller.address}</p>
              <p>City: {seller.city}</p>
              <p>Country: {seller.country}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex gap-4">
            <ProposalRequestButton sellerId={seller.user_id} sellerName={seller.company_name} />
          </div>
          <Badge>{seller.category}</Badge>
        </CardFooter>
      </Card>
    </div>
  )
}
