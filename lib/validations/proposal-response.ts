import { z } from "zod"

export const proposalResponseSchema = z.object({
  proposal_text: z.string().min(50, "Proposal text must be at least 50 characters"),
  technical_approach: z.string().optional(),
  proposed_budget: z.number().min(1, "Budget must be greater than 0"),
  proposed_timeline: z.string().min(1, "Timeline is required"),
  proposed_start_date: z.string().optional(),
  additional_notes: z.string().optional(),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
})

export type ProposalResponseData = z.infer<typeof proposalResponseSchema>

export const proposalResponseUpdateSchema = proposalResponseSchema.partial().extend({
  id: z.string().uuid(),
})

export type ProposalResponseUpdateData = z.infer<typeof proposalResponseUpdateSchema>