import { type NextRequest, NextResponse } from "next/server"
import { VerificationService } from "@/lib/verification/verification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endorsements } = body

    if (!Array.isArray(endorsements) || endorsements.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid endorsements array" }, { status: 400 })
    }

    const verificationService = VerificationService.getInstance()
    const verificationRequests = []

    // Prepare verification requests
    for (const endorsement of endorsements) {
      const credentials = await getPlatformCredentials(endorsement.platformId)
      if (credentials) {
        verificationRequests.push({
          platformId: endorsement.platformId,
          providerId: "current-user-id", // This would come from auth
          certificationId: endorsement.certificationId,
          partnerEmail: endorsement.partnerEmail,
          credentials,
        })
      }
    }

    // Perform batch verification
    const results = await verificationService.batchVerify(verificationRequests)

    // Convert Map to object for JSON response
    const resultsObject = Object.fromEntries(results)

    return NextResponse.json({
      success: true,
      results: resultsObject,
      totalProcessed: verificationRequests.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Batch verification API error:", error)
    return NextResponse.json({ success: false, error: "Batch verification failed" }, { status: 500 })
  }
}

async function getPlatformCredentials(platformId: string) {
  // Same as in the verify route
  const credentialsMap: Record<string, any> = {
    salesforce: {
      apiKey: process.env.SALESFORCE_API_KEY,
      apiSecret: process.env.SALESFORCE_API_SECRET,
      clientId: process.env.SALESFORCE_CLIENT_ID,
      environment: process.env.SALESFORCE_ENVIRONMENT || "sandbox",
      baseUrl: process.env.SALESFORCE_BASE_URL || "https://test.salesforce.com",
    },
    netsuite: {
      apiKey: process.env.NETSUITE_API_KEY,
      apiSecret: process.env.NETSUITE_API_SECRET,
      clientId: process.env.NETSUITE_CLIENT_ID,
      environment: process.env.NETSUITE_ENVIRONMENT || "sandbox",
      baseUrl: process.env.NETSUITE_BASE_URL || "https://rest.sandbox.netsuite.com",
    },
    aws: {
      apiKey: process.env.AWS_ACCESS_KEY_ID,
      apiSecret: process.env.AWS_SECRET_ACCESS_KEY,
      environment: process.env.AWS_ENVIRONMENT || "sandbox",
      baseUrl: process.env.AWS_PARTNER_API_URL || "https://partnercenter.aws.amazon.com",
    },
    microsoft: {
      apiKey: process.env.MICROSOFT_API_KEY,
      apiSecret: process.env.MICROSOFT_API_SECRET,
      clientId: process.env.MICROSOFT_CLIENT_ID,
      environment: process.env.MICROSOFT_ENVIRONMENT || "sandbox",
      baseUrl: process.env.MICROSOFT_BASE_URL || "https://api.partnercenter.microsoft.com",
    },
    shopify: {
      apiKey: process.env.SHOPIFY_API_KEY,
      environment: process.env.SHOPIFY_ENVIRONMENT || "sandbox",
      baseUrl: process.env.SHOPIFY_BASE_URL || "https://partners.shopify.com",
    },
  }

  return credentialsMap[platformId]
}
