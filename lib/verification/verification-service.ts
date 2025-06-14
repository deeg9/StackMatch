import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
export interface VerificationResult {
  isValid: boolean
  status: "verified" | "expired" | "revoked" | "not_found" | "error"
  lastVerified: string
  expiryDate?: string
  certificationLevel?: string
  specializations?: string[]
  projectCount?: number
  satisfactionScore?: number
  errorMessage?: string
  rawResponse?: any
}

export interface PlatformCredentials {
  apiKey: string
  apiSecret?: string
  clientId?: string
  environment: "sandbox" | "production"
  baseUrl: string
}

export interface VerificationRequest {
  platformId: string
  providerId: string
  certificationId: string
  partnerEmail: string
  credentials: PlatformCredentials
}

export class VerificationService {
  private static instance: VerificationService
  private verificationCache = new Map<string, { result: VerificationResult; timestamp: number }>()
  private readonly CACHE_DURATION = 1000 * 60 * 60 // 1 hour

  static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService()
    }
    return VerificationService.instance
  }

  async verifyEndorsement(request: VerificationRequest): Promise<VerificationResult> {
    const cacheKey = `${request.platformId}-${request.certificationId}`
    const cached = this.verificationCache.get(cacheKey)

    // Return cached result if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result
    }

    try {
      let result: VerificationResult

      switch (request.platformId) {
        case "salesforce":
          result = await this.verifySalesforce(request)
          break
        case "netsuite":
          result = await this.verifyNetSuite(request)
          break
        case "aws":
          result = await this.verifyAWS(request)
          break
        case "microsoft":
          result = await this.verifyMicrosoft(request)
          break
        case "shopify":
          result = await this.verifyShopify(request)
          break
        default:
          result = {
            isValid: false,
            status: "error",
            lastVerified: new Date().toISOString(),
            errorMessage: `Unsupported platform: ${request.platformId}`,
          }
      }

      // Cache the result
      this.verificationCache.set(cacheKey, {
        result,
        timestamp: Date.now(),
      })

      return result
    } catch (error) {
      console.error(`Verification failed for ${request.platformId}:`, error)
      return {
        isValid: false,
        status: "error",
        lastVerified: new Date().toISOString(),
        errorMessage: error instanceof Error ? getErrorMessage(error) : "Unknown verification error",
      }
    }
  }

  private async verifySalesforce(request: VerificationRequest): Promise<VerificationResult> {
    const { credentials, certificationId, partnerEmail } = request

    try {
      // Authenticate with Salesforce
      const authResponse = await fetch(`${credentials.baseUrl}/services/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: credentials.clientId!,
          client_secret: credentials.apiSecret!,
        }),
      })

      if (!authResponse.ok) {
        throw new Error("Salesforce authentication failed")
      }

      const authData = await authResponse.json()
      const accessToken = authData.access_token

      // Query partner certification status
      const certResponse = await fetch(
        `${credentials.baseUrl}/services/data/v58.0/query?q=SELECT Id,Status,ExpirationDate,CertificationLevel,SpecializationAreas FROM PartnerCertification WHERE CertificationId='${certificationId}' AND PartnerEmail='${partnerEmail}'`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!certResponse.ok) {
        throw new Error("Failed to query Salesforce certification")
      }

      const certData = await certResponse.json()

      if (certData.records && certData.records.length > 0) {
        const cert = certData.records[0]
        const isActive = cert.Status === "Active"
        const expiryDate = cert.ExpirationDate

        return {
          isValid: isActive && (!expiryDate || new Date(expiryDate) > new Date()),
          status: isActive ? "verified" : "expired",
          lastVerified: new Date().toISOString(),
          expiryDate: expiryDate,
          certificationLevel: cert.CertificationLevel,
          specializations: cert.SpecializationAreas ? cert.SpecializationAreas.split(";") : [],
          rawResponse: certData,
        }
      }

      return {
        isValid: false,
        status: "not_found",
        lastVerified: new Date().toISOString(),
        errorMessage: "Certification not found in Salesforce records",
      }
    } catch (error) {
      throw new Error(`Salesforce verification failed: ${error}`)
    }
  }

  private async verifyNetSuite(request: VerificationRequest): Promise<VerificationResult> {
    const { credentials, certificationId, partnerEmail } = request

    try {
      // NetSuite uses OAuth 1.0 or Token-based authentication
      const response = await fetch(`${credentials.baseUrl}/services/rest/record/v1/partner`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          "Content-Type": "application/json",
          "X-NetSuite-Authorization": `NLAuth nlauth_account=${credentials.clientId}, nlauth_email=${partnerEmail}, nlauth_signature=${credentials.apiSecret}`,
        },
      })

      if (!response.ok) {
        throw new Error("NetSuite API request failed")
      }

      const data = await response.json()

      // Mock NetSuite response structure
      const partnerData = data.items?.find((item: any) => item.certificationId === certificationId)

      if (partnerData) {
        return {
          isValid: partnerData.status === "ACTIVE",
          status: partnerData.status === "ACTIVE" ? "verified" : "expired",
          lastVerified: new Date().toISOString(),
          expiryDate: partnerData.expirationDate,
          certificationLevel: partnerData.level,
          projectCount: partnerData.completedProjects,
          satisfactionScore: partnerData.customerRating,
          rawResponse: data,
        }
      }

      return {
        isValid: false,
        status: "not_found",
        lastVerified: new Date().toISOString(),
        errorMessage: "Partner certification not found in NetSuite",
      }
    } catch (error) {
      throw new Error(`NetSuite verification failed: ${error}`)
    }
  }

  private async verifyAWS(request: VerificationRequest): Promise<VerificationResult> {
    const { credentials, certificationId, partnerEmail } = request

    try {
      // AWS Partner Central API
      const response = await fetch(`${credentials.baseUrl}/partner/v1/certifications/${certificationId}`, {
        method: "GET",
        headers: {
          Authorization: `AWS4-HMAC-SHA256 Credential=${credentials.apiKey}`,
          "Content-Type": "application/json",
          "X-Amz-Target": "AWSPartnerCentral.GetCertification",
        },
      })

      if (!response.ok) {
        throw new Error("AWS Partner API request failed")
      }

      const data = await response.json()

      return {
        isValid: data.status === "ACTIVE",
        status: data.status === "ACTIVE" ? "verified" : data.status.toLowerCase(),
        lastVerified: new Date().toISOString(),
        expiryDate: data.expirationDate,
        certificationLevel: data.competencyLevel,
        specializations: data.serviceAreas || [],
        rawResponse: data,
      }
    } catch (error) {
      throw new Error(`AWS verification failed: ${error}`)
    }
  }

  private async verifyMicrosoft(request: VerificationRequest): Promise<VerificationResult> {
    const { credentials, certificationId, partnerEmail } = request

    try {
      // Microsoft Partner Center API
      const authResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: credentials.clientId!,
          client_secret: credentials.apiSecret!,
          scope: "https://api.partnercenter.microsoft.com/.default",
        }),
      })

      const authData = await authResponse.json()
      const accessToken = authData.access_token

      const response = await fetch(`${credentials.baseUrl}/v1/partners/certifications/${certificationId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Microsoft Partner API request failed")
      }

      const data = await response.json()

      return {
        isValid: data.isActive,
        status: data.isActive ? "verified" : "expired",
        lastVerified: new Date().toISOString(),
        expiryDate: data.expirationDate,
        certificationLevel: data.competencyLevel,
        specializations: data.specializations || [],
        rawResponse: data,
      }
    } catch (error) {
      throw new Error(`Microsoft verification failed: ${error}`)
    }
  }

  private async verifyShopify(request: VerificationRequest): Promise<VerificationResult> {
    const { credentials, certificationId, partnerEmail } = request

    try {
      // Shopify Partner API
      const response = await fetch(`${credentials.baseUrl}/admin/api/2023-10/partners/${certificationId}.json`, {
        headers: {
          "X-Shopify-Access-Token": credentials.apiKey,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Shopify Partner API request failed")
      }

      const data = await response.json()
      const partner = data.partner

      return {
        isValid: partner.status === "active",
        status: partner.status === "active" ? "verified" : "expired",
        lastVerified: new Date().toISOString(),
        certificationLevel: partner.tier,
        specializations: partner.expertise_areas || [],
        projectCount: partner.app_count,
        satisfactionScore: partner.average_rating,
        rawResponse: data,
      }
    } catch (error) {
      throw new Error(`Shopify verification failed: ${error}`)
    }
  }

  async batchVerify(requests: VerificationRequest[]): Promise<Map<string, VerificationResult>> {
    const results = new Map<string, VerificationResult>()

    // Process verifications in parallel with rate limiting
    const batchSize = 5
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize)
      const batchPromises = batch.map(async (request) => {
        const result = await this.verifyEndorsement(request)
        return { key: `${request.platformId}-${request.certificationId}`, result }
      })

      const batchResults = await Promise.allSettled(batchPromises)
      batchResults.forEach((result) => {
        if (result.status === "fulfilled") {
          results.set(result.value.key, result.value.result)
        }
      })

      // Rate limiting delay between batches
      if (i + batchSize < requests.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return results
  }

  clearCache(): void {
    this.verificationCache.clear()
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.verificationCache.size,
      entries: Array.from(this.verificationCache.keys()),
    }
  }
}
