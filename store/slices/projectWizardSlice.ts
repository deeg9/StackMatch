import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

export type ProjectCategory = "Web Development" | "Mobile Development" | "Enterprise Software" | "AI/ML" | "Other"
export type ProjectStatus = "DRAFT" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export interface ProjectRequirement {
  id: string
  title: string
  description: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  category: string
}

interface ProjectWizardData {
  // Step 1: Project Basics
  title: string
  description: string
  category: ProjectCategory | null

  // Step 2: Requirements
  requirements: ProjectRequirement[]
  skills: string[]
  timeline: string
  technicalSpecs: string
  preferredTechnologies: string[]
  constraints: string

  // Step 3: Budget & Location
  budget: number | null
  budgetType: "fixed" | "hourly" | null
  location: string
  isRemote: boolean

  // Step 4: Additional Details
  deadline: string
  attachments: string[]
  additionalNotes: string
}

interface ProjectWizardState {
  currentStep: number
  totalSteps: number
  data: ProjectWizardData
  isSubmitting: boolean
  error: string | null
}

const initialData: ProjectWizardData = {
  title: "",
  description: "",
  category: null,
  requirements: [],
  skills: [],
  timeline: "",
  technicalSpecs: "",
  preferredTechnologies: [],
  constraints: "",
  budget: null,
  budgetType: null,
  location: "",
  isRemote: false,
  deadline: "",
  attachments: [],
  additionalNotes: "",
}

const initialState: ProjectWizardState = {
  currentStep: 1,
  totalSteps: 4,
  data: initialData,
  isSubmitting: false,
  error: null,
}

const projectWizardSlice = createSlice({
  name: "projectWizard",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      const step = action.payload
      if (step >= 1 && step <= state.totalSteps) {
        state.currentStep = step
      }
    },
    updateData: (state, action: PayloadAction<Partial<ProjectWizardData>>) => {
      state.data = { ...state.data, ...action.payload }
    },

    // Requirement actions
    addRequirement: (state, action: PayloadAction<Omit<ProjectRequirement, "id">>) => {
      const newRequirement: ProjectRequirement = {
        ...action.payload,
        id: uuidv4(),
      }
      state.data.requirements.push(newRequirement)
    },
    updateRequirement: (state, action: PayloadAction<ProjectRequirement>) => {
      const index = state.data.requirements.findIndex((req) => req.id === action.payload.id)
      if (index !== -1) {
        state.data.requirements[index] = action.payload
      }
    },
    removeRequirement: (state, action: PayloadAction<string>) => {
      state.data.requirements = state.data.requirements.filter((req) => req.id !== action.payload)
    },

    // Technology actions
    addTechnology: (state, action: PayloadAction<string>) => {
      if (!state.data.preferredTechnologies.includes(action.payload)) {
        state.data.preferredTechnologies.push(action.payload)
      }
    },
    removeTechnology: (state, action: PayloadAction<string>) => {
      state.data.preferredTechnologies = state.data.preferredTechnologies.filter((tech) => tech !== action.payload)
    },

    // Skill actions
    addSkill: (state, action: PayloadAction<string>) => {
      if (!state.data.skills.includes(action.payload)) {
        state.data.skills.push(action.payload)
      }
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.data.skills = state.data.skills.filter((skill) => skill !== action.payload)
    },

    // Attachment actions
    addAttachment: (state, action: PayloadAction<string>) => {
      state.data.attachments.push(action.payload)
    },
    removeAttachment: (state, action: PayloadAction<string>) => {
      state.data.attachments = state.data.attachments.filter((attachment) => attachment !== action.payload)
    },

    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    resetWizard: (state) => {
      state.currentStep = 1
      state.data = initialData
      state.isSubmitting = false
      state.error = null
    },
  },
})

export const {
  nextStep,
  prevStep,
  goToStep,
  updateData,
  addRequirement,
  updateRequirement,
  removeRequirement,
  addTechnology,
  removeTechnology,
  addSkill,
  removeSkill,
  addAttachment,
  removeAttachment,
  setSubmitting,
  setError,
  resetWizard,
} = projectWizardSlice.actions

export default projectWizardSlice.reducer
