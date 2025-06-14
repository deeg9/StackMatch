// import { deepinfra } from "@ai-sdk/deepinfra"
import { streamText, type CoreMessage } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const {
      listingTitle,
      listingDescription,
      listingRequirements, // This could be a string or structured data
      listingIndustry,
      listingTags, // Array of strings
      providerStrengths, // Optional: text describing provider's key strengths
      providerPreviousBidStyle, // Optional: example of a successful bid
    }: {
      listingTitle: string
      listingDescription: string
      listingRequirements?: string
      listingIndustry?: string
      listingTags?: string[]
      providerStrengths?: string
      providerPreviousBidStyle?: string
    } = await req.json()

    if (!listingTitle || !listingDescription) {
      return new Response("Missing listing title or description", {
        status: 400,
      })
    }

    const messages: CoreMessage[] = [
      {
        role: "system",
        content: `You are an expert proposal writer and project planner for a platform called StackMatch, which connects businesses with service providers.
        Your task is to help a service provider draft a compelling proposal for a project listing.
        Generate a draft that includes:
        1.  **Suggested Pricing Strategy**: Briefly explain a suitable pricing model (e.g., fixed-price, value-based, phased).
        2.  **Project Milestones & Phases**: Outline 3-5 key milestones with brief descriptions of deliverables for each.
        3.  **Tech Stack Recommendations**: Suggest a relevant technology stack if applicable to the project type.
        4.  **Differentiation Points**: Briefly highlight 1-2 potential ways the provider could differentiate themselves for this project.
        Format the output clearly with headings for each section.
        If provider-specific information (strengths, previous bid style) is given, try to incorporate that subtly.
        If listing requirements are provided, ensure milestones and tech stack align with them.
        Be concise and professional.
        `,
      },
      {
        role: "user",
        content: `
        Help me draft a proposal for the following project:

        **Project Title:** ${listingTitle}
        **Project Description:** ${listingDescription}
        ${listingIndustry ? `**Industry:** ${listingIndustry}` : ""}
        ${listingTags && listingTags.length > 0 ? `**Relevant Tags:** ${listingTags.join(", ")}` : ""}
        ${listingRequirements ? `**Key Requirements:** ${listingRequirements}` : ""}

        ${providerStrengths ? `**My Key Strengths as a Provider:** ${providerStrengths}` : ""}
        ${providerPreviousBidStyle ? `**Style from a Previous Successful Bid (for reference):** ${providerPreviousBidStyle}` : ""}

        Please generate a proposal draft covering pricing strategy, milestones, tech stack, and differentiation points.
        `,
      },
    ]

    const result = await streamText({
      model: deepinfra("meta-llama/Meta-Llama-3-8B-Instruct"), // Or your preferred DeepInfra model
      messages,
      temperature: 0.7,
      maxTokens: 1500,
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error("Error generating proposal:", error)
    return new Response(`Error generating proposal: ${error.message || "Unknown error"}`, {
      status: 500,
    })
  }
}
