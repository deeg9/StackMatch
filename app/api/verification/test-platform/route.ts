import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platformId } = body

    if (!platformId) {
      return NextResponse.json({ success: false, error: "Platform ID is required" }, { status: 400 })
    }

    const startTime = Date.now()
    const credentials = getPlatformCredentials(platformId)

    if (!credentials) {
      return NextResponse.json({
        platform: platformId,
        status: "failed",
        responseTime: 0,
        error: "Platform credentials not configured",
        timestamp: new Date().toISOString(),
      })
    }

    let result
    switch (platformId) {
      case "salesforce":
        result = await testSalesforce(credentials, startTime)
        break
      case "netsuite":
        result = await testNetSuite(credentials, startTime)
        break
      case "aws":
        result = await testAWS(credentials, startTime)
        break
      case "microsoft":
        result = await testMicrosoft(credentials, startTime)
        break
      case "shopify":
        result = await testShopify(credentials, startTime)
        break
      default:
        result = {
          platform: platformId,
          status: "failed",
          responseTime: Date.now() - startTime,
          error: "Unsupported platform",
          timestamp: new Date().toISOString(),
        }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Platform test failed:", error)
    return NextResponse.json({ success: false, error: "Platform test failed" }, { status: 500 })
  }
}

// Individual platform test functions (same as in health-check but focused on single platform)
async function testSalesforce(credentials: any, startTime: number) {
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    const authResponse = await fetch(`${credentials.baseUrl}/services/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: credentials.clientId,
        client_secret: credentials.apiSecret,
      }),
    })

    if (authResponse.ok) {
      details.authentication = true
      const authData = await authResponse.json()

      const apiResponse = await fetch(`${credentials.baseUrl}/services/data/v58.0/sobjects/`, {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      })

      if (apiResponse.ok) {
        details.apiAccess = true
        details.dataRetrieval = true
      }
    }

    const responseTime = Date.now() - startTime
    const success = details.authentication && details.apiAccess

    return {
      platform: "salesforce",
      status: success ? "success" : "failed",
      responseTime,
      details,
      error: success ? undefined : "Authentication or API access failed",
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      platform: "salesforce",
      status: "failed",
      responseTime: Date.now() - startTime,
      details,
      error: `Salesforce test failed: ${error}`,
      timestamp: new Date().toISOString(),
    }
  }
}

async function testNetSuite(credentials: any, startTime: number) {
  // Similar implementation as in health-check
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    const response = await fetch(`${credentials.baseUrl}/services/rest/record/v1/metadata-catalog`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${credentials.apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      details.authentication = true
      details.apiAccess = true
      details.dataRetrieval = true
    }

    const responseTime = Date.now() - startTime
    const success = details.authentication && details.apiAccess

    return {
      platform: "netsuite",
      status: success ? "success" : "failed",
      responseTime,
      details,
      error: success ? undefined : "NetSuite API access failed",
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      platform: "netsuite",
      status: "failed",
      responseTime: Date.now() - startTime,
      details,
      error: `NetSuite test failed: ${error}`,
      timestamp: new Date().toISOString(),
    }
  }
}

async function testAWS(credentials: any, startTime: number) {
  // AWS test implementation
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    const response = await fetch(`${credentials.baseUrl}/partner/v1/health`, {
      method: "GET",
      headers: {
        Authorization: `AWS4-HMAC-SHA256 Credential=${credentials.apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      details.authentication = true
      details.apiAccess = true
      details.dataRetrieval = true
    }

    const responseTime = Date.now() - startTime
    const success = details.authentication && details.apiAccess

    return {
      platform: "aws",
      status: success ? "success" : "failed",
      responseTime,
      details,
      error: success ? undefined : "AWS Partner API access failed",
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      platform: "aws",
      status: "failed",
      responseTime: Date.now() - startTime,
      details,
      error: `AWS test failed: ${error}`,
      timestamp: new Date().toISOString(),
    }
  }
}

async function testMicrosoft(credentials: any, startTime: number) {
  // Microsoft test implementation
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    const authResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: credentials.clientId,
        client_secret: credentials.apiSecret,
        scope: "https://api.partnercenter.microsoft.com/.default",
      }),
    })

    if (authResponse.ok) {
      details.authentication = true
      const authData = await authResponse.json()

      const apiResponse = await fetch(`${credentials.baseUrl}/v1/partners/profile`, {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      })

      if (apiResponse.ok) {
        details.apiAccess = true
        details.dataRetrieval = true
      }
    }

    const responseTime = Date.now() - startTime
    const success = details.authentication && details.apiAccess

    return {
      platform: "microsoft",
      status: success ? "success" : "failed",
      responseTime,
      details,
      error: success ? undefined : "Microsoft Partner API access failed",
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      platform: "microsoft",
      status: "failed",
      responseTime: Date.now() - startTime,
      details,
      error: `Microsoft test failed: ${error}`,
      timestamp: new Date().toISOString(),
    }
  }
}

async function testShopify(credentials: any, startTime: number) {
  // Shopify test implementation
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    const response = await fetch(`${credentials.baseUrl}/admin/api/2023-10/shop.json`, {
      headers: {
        "X-Shopify-Access-Token": credentials.apiKey,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      details.authentication = true
      details.apiAccess = true
      details.dataRetrieval = true
    }

    const responseTime = Date.now() - startTime
    const success = details.authentication && details.apiAccess

    return {
      platform: "shopify",
      status: success ? "success" : "failed",
      responseTime,
      details,
      error: success ? undefined : "Shopify Partner API access failed",
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      platform: "shopify",
      status: "failed",
      responseTime: Date.now() - startTime,
      details,
      error: `Shopify test failed: ${error}`,
      timestamp: new Date().toISOString(),
    }
  }
}

function getPlatformCredentials(platformId: string) {
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

  const credentials = credentialsMap[platformId]

  if (!credentials || !credentials.apiKey) {
    return null
  }

  return credentials
}
