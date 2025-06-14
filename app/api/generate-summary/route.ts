// import { deepinfra } from "@ai-sdk/deepinfra"
import { streamText, type CoreMessage } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const {
      uploadedFiles, // For now, let's assume this is an array of text content from files
      industry,
      companySize,
      tags,
      currentSummary, // Optional: if user has already typed something
    }: {
      uploadedFiles?: string[]
      industry?: string
      companySize?: string
      tags?: string[]
      currentSummary?: string
    } = await req.json()

    const messages: CoreMessage[] = []

    let prompt = `You are an expert project manager helping a business draft a project summary for a new listing on StackMatch, a platform connecting businesses with service providers.

    Your goal is to create a comprehensive and compelling project summary.

    Consider the following information about the business and project:
    `

    if (industry) {
      prompt += `\n- Industry: ${industry}`
    }
    if (companySize) {
      prompt += `\n- Company Size: ${companySize}`
    }
    if (tags && tags.length > 0) {
      prompt += `\n- Key Technologies/Areas: ${tags.join(", ")}`
    }
    if (uploadedFiles && uploadedFiles.length > 0) {
      prompt += `\n\nUploaded Document Contents:\n`
      uploadedFiles.forEach((fileContent, index) => {
        prompt += `--- Document ${index + 1} ---\n${fileContent}\n--- End Document ${index + 1} ---\n\n`
      })
    }

    if (currentSummary) {
      prompt += `\n\nThe user has already started writing a summary, please build upon or refine it if appropriate:\n"${currentSummary}"\n`
    }

    prompt += `
    Please generate a project summary draft that includes:
    1. Background on the company's current situation and needs.
    2. Key pain points the project aims to address.
    3. Required modules, tools, or specific functionalities (if inferable).
    4. Desired timeline and expected outcomes.
    5. (Optional) Context around the budget, if information is available or can be reasonably inferred as a general need for cost-effectiveness.

    Structure the summary clearly. Be professional and concise.
    `

    messages.push({ role: "user", content: prompt })

    const result = await streamText({
      // You can find more models at https://deepinfra.com/models
      // Consider a model good at instruction following and summarization.
      // For example, 'meta-llama/Meta-Llama-3-70B-Instruct' or 'mistralai/Mixtral-8x7B-Instruct-v0.1'
      // The DeepInfra integration uses DEEPINFRA_API_KEY from your Vercel project's environment variables [^2]
      model: deepinfra("meta-llama/Meta-Llama-3-8B-Instruct"),
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[GENERATE_SUMMARY_ERROR]", error)
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    return new Response(JSON.stringify({ error: "An unknown error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
