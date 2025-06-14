import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface VerificationDocument {
  id: string
  type: "certification" | "business_registration" | "tax_document" | "insurance" | "identity"
  name: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
  status: "pending" | "under_review" | "verified" | "rejected"
  rejectionReason?: string
  verifiedAt?: string
  verifiedBy?: string
  expiryDate?: string
  metadata?: Record<string, any>
}

export interface VerificationRequest {
  id: string
  providerId: string
  type: "certification" | "business_registration" | "background_check"
  status: "pending" | "under_review" | "verified" | "rejected"
  documents: VerificationDocument[]
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
  priority: "low" | "medium" | "high"
}

export interface BusinessRegistration {
  businessName: string
  registrationNumber: string
  registrationType: "llc" | "corporation" | "partnership" | "sole_proprietorship"
  registrationState: string
  registrationCountry: string
  taxId: string
  incorporationDate: string
  businessAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  documents: VerificationDocument[]
  verificationStatus: "pending" | "verified" | "rejected"
}

export interface CertificationVerification {
  id: string
  name: string
  issuer: string
  credentialId: string
  issuedDate: string
  expiryDate?: string
  verificationUrl?: string
  documents: VerificationDocument[]
  verificationStatus: "pending" | "verified" | "rejected"
  autoVerified: boolean
}

interface VerificationState {
  verificationRequests: VerificationRequest[]
  businessRegistration: BusinessRegistration | null
  certifications: CertificationVerification[]
  documents: VerificationDocument[]
  isLoading: boolean
  uploadProgress: Record<string, number>
  currentRequest: VerificationRequest | null
}

const initialState: VerificationState = {
  verificationRequests: [],
  businessRegistration: null,
  certifications: [],
  documents: [],
  isLoading: false,
  uploadProgress: {},
  currentRequest: null,
}

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setVerificationRequests: (state, action: PayloadAction<VerificationRequest[]>) => {
      state.verificationRequests = action.payload
    },
    addVerificationRequest: (state, action: PayloadAction<VerificationRequest>) => {
      state.verificationRequests.push(action.payload)
    },
    updateVerificationRequest: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<VerificationRequest> }>,
    ) => {
      const index = state.verificationRequests.findIndex((req) => req.id === action.payload.id)
      if (index !== -1) {
        state.verificationRequests[index] = { ...state.verificationRequests[index], ...action.payload.updates }
      }
    },
    setBusinessRegistration: (state, action: PayloadAction<BusinessRegistration>) => {
      state.businessRegistration = action.payload
    },
    updateBusinessRegistration: (state, action: PayloadAction<Partial<BusinessRegistration>>) => {
      if (state.businessRegistration) {
        state.businessRegistration = { ...state.businessRegistration, ...action.payload }
      }
    },
    setCertifications: (state, action: PayloadAction<CertificationVerification[]>) => {
      state.certifications = action.payload
    },
    addCertification: (state, action: PayloadAction<CertificationVerification>) => {
      state.certifications.push(action.payload)
    },
    updateCertification: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<CertificationVerification> }>,
    ) => {
      const index = state.certifications.findIndex((cert) => cert.id === action.payload.id)
      if (index !== -1) {
        state.certifications[index] = { ...state.certifications[index], ...action.payload.updates }
      }
    },
    removeCertification: (state, action: PayloadAction<string>) => {
      state.certifications = state.certifications.filter((cert) => cert.id !== action.payload)
    },
    setDocuments: (state, action: PayloadAction<VerificationDocument[]>) => {
      state.documents = action.payload
    },
    addDocument: (state, action: PayloadAction<VerificationDocument>) => {
      state.documents.push(action.payload)
    },
    updateDocument: (state, action: PayloadAction<{ id: string; updates: Partial<VerificationDocument> }>) => {
      const index = state.documents.findIndex((doc) => doc.id === action.payload.id)
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...action.payload.updates }
      }
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter((doc) => doc.id !== action.payload)
    },
    setUploadProgress: (state, action: PayloadAction<{ fileId: string; progress: number }>) => {
      state.uploadProgress[action.payload.fileId] = action.payload.progress
    },
    clearUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload]
    },
    setCurrentRequest: (state, action: PayloadAction<VerificationRequest | null>) => {
      state.currentRequest = action.payload
    },
  },
})

export const {
  setLoading,
  setVerificationRequests,
  addVerificationRequest,
  updateVerificationRequest,
  setBusinessRegistration,
  updateBusinessRegistration,
  setCertifications,
  addCertification,
  updateCertification,
  removeCertification,
  setDocuments,
  addDocument,
  updateDocument,
  removeDocument,
  setUploadProgress,
  clearUploadProgress,
  setCurrentRequest,
} = verificationSlice.actions

export default verificationSlice.reducer
