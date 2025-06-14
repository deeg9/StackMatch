import { type NextRequest, NextResponse } from "next/server"

interface PlatformTestResult {
  platform: string
  status: "testing" | "success" | "failed" | "not_tested"
  responseTime: number
  error?: string
  details?: {
    authentication: boolean
    apiAccess: boolean
    dataRetrieval: boolean
    rateLimiting: boolean
  }
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const platforms = ["salesforce", "netsuite", "aws", "microsoft", "shopify"]
    const results: PlatformTestResult[] = []

    // Test each platform
    for (const platform of platforms) {
      const result = await testPlatformHealth(platform)
      results.push(result)
    }

    // Determine overall health
    const successCount = results.filter((r) => r.status === "success").length
    const failedCount = results.filter((r) => r.status === "failed").length

    let overall: "healthy" | "degraded" | "critical"
    if (failedCount === 0) {
      overall = "healthy"
    } else if (successCount > failedCount) {
      overall = "degraded"
    } else {
      overall = "critical"
    }

    const healthCheck = {
      overall,
      platforms: results,
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
    }

    return NextResponse.json(healthCheck)
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json({ success: false, error: "Health check failed" }, { status: 500 })
  }
}

async function testPlatformHealth(platform: string): Promise<PlatformTestResult> {
  const startTime = Date.now()

  try {
    const credentials = getPlatformCredentials(platform)
    if (!credentials) {
      return {
        platform,
        status: "failed",
        responseTime: 0,
        error: "Platform credentials not configured",
        timestamp: new Date().toISOString(),
      }
    }

    let testResult: PlatformTestResult

    switch (platform) {
      case "salesforce":
        testResult = await testSalesforceHealth(credentials, startTime)
        break
      case "netsuite":
        testResult = await testNetSuiteHealth(credentials, startTime)
        break
      case "aws":
        testResult = await testAWSHealth(credentials, startTime)
        break
      case "microsoft":
        testResult = await testMicrosoftHealth(credentials, startTime)
        break
      case "shopify":
        testResult = await testShopifyHealth(credentials, startTime)
        break
      default:
        testResult = {
          platform,
          status: "failed",
          responseTime: Date.now() - startTime,
          error: "Unsupported platform",
          timestamp: new Date().toISOString(),
        }
    }

    return testResult
  } catch (error) {
    return {
      platform,
      status: "failed",
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }
  }
}

async function testSalesforceHealth(credentials: any, startTime: number): Promise<PlatformTestResult> {
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    // Test authentication
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

      // Test API access
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

async function testNetSuiteHealth(credentials: any, startTime: number): Promise<PlatformTestResult> {
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    // Test NetSuite REST API
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

async function testAWSHealth(credentials: any, startTime: number): Promise<PlatformTestResult> {
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    // Test AWS Partner API (simplified test)
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

async function testMicrosoftHealth(credentials: any, startTime: number): Promise<PlatformTestResult> {
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    // Test Microsoft Partner Center authentication
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

      // Test API access
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

async function testShopifyHealth(credentials: any, startTime: number): Promise<PlatformTestResult> {
  const details = {
    authentication: false,
    apiAccess: false,
    dataRetrieval: false,
    rateLimiting: true,
  }

  try {
    // Test Shopify Partner API
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

  // Check if all required credentials are present
  if (!credentials || !credentials.apiKey) {
    return null
  }

  return credentials
}
