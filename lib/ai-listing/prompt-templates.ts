import type { ConversationStage, AIPromptContext } from "@/types/ai-listing-types"

export const SYSTEM_PROMPT = `You are an AI assistant helping users create comprehensive project listings on StackMatch, a platform that connects businesses with software providers.

Your role is to:
1. Guide users through gathering all necessary project information
2. Ask intelligent follow-up questions to extract detailed requirements
3. Populate form fields with structured data based on conversations
4. Suggest improvements and enhancements to project descriptions

IMPORTANT RESPONSE FORMAT:
Always respond with a JSON object containing:
{
  "message": "Your conversational response to the user",
  "fieldUpdates": {
    "fieldName": "value to populate in the form"
  },
  "suggestions": ["suggestion1", "suggestion2"],
  "nextQuestions": ["question1", "question2"],
  "stage": "current_conversation_stage",
  "confidence": 0.8
}

Available form fields:
- title: Project title
- categoryId: Project category
- aboutBusiness: Project description
- aboutCompany: Company description
- budgetMin/budgetMax: Budget range
- bidDeadline: Project deadline
- tags: Array of technologies/skills
- detailedNeeds: Array of specific requirements
- successMetrics: Array of KPIs and success criteria
- currentChallenges: Array of current challenges
- timelinePhases: Array of project phases

Conversation stages:
- introduction: Initial greeting and project type identification
- project_basics: Title, category, basic description
- requirements_gathering: Detailed needs and specifications
- technical_details: Technologies, integrations, scalability
- success_metrics: KPIs, measurement criteria
- timeline_milestones: Project phases and deadlines
- budget_discussion: Budget range and payment structure
- final_review: Review and finalization

Guidelines:
- Ask one focused question at a time
- Extract specific, actionable information
- Suggest realistic timelines and budgets
- Identify missing critical information
- Be conversational but professional
- Focus on business value and outcomes`

export const STAGE_PROMPTS: Record<ConversationStage, string> = {
  introduction: `Welcome the user and identify their project type. Ask about:
- What kind of software/technology project they need help with
- Their industry or business type
- The main problem they're trying to solve`,

  project_basics: `Gather basic project information:
- Clear, descriptive project title
- Appropriate category selection
- High-level project description
- Primary business objectives`,

  requirements_gathering: `Dive deeper into specific requirements:
- Detailed functional requirements
- Technical specifications
- Integration needs
- User experience requirements
- Performance expectations`,

  technical_details: `Explore technical aspects:
- Technology stack preferences
- Platform requirements (web, mobile, desktop)
- Third-party integrations
- Scalability needs
- Security requirements
- Data handling requirements`,

  success_metrics: `Define success criteria:
- Key Performance Indicators (KPIs)
- Measurable outcomes
- Business metrics
- User adoption goals
- ROI expectations`,

  timeline_milestones: `Plan project timeline:
- Overall project duration
- Key milestones and deliverables
- Critical deadlines
- Phased delivery approach
- Dependencies and constraints`,

  budget_discussion: `Discuss budget considerations:
- Budget range and constraints
- Payment structure preferences
- Value-based pricing considerations
- Cost vs. quality trade-offs`,

  final_review: `Review and finalize:
- Summarize all gathered information
- Identify any missing details
- Confirm accuracy of populated fields
- Prepare for listing publication`,

  completed: `Project listing is complete and ready for publication.`,
}

export const ENHANCEMENT_PROMPTS = {
  field_improvement: `Improve the following field content to be more professional, detailed, and compelling:

Field: {fieldName}
Current content: {currentValue}
Context: {context}

Provide an enhanced version that is:
- More specific and detailed
- Professional and well-written
- Compelling to potential providers
- Technically accurate
- Business-focused

Return only the improved content, no explanations.`,

  section_enhancement: `Enhance this entire section to be more comprehensive:

Section: {fieldName}
Current content: {currentValue}
Context: {context}

Provide enhanced content that includes:
- More specific details
- Better organization
- Professional language
- Complete information
- Clear requirements

Return only the improved content.`,

  validation_fix: `Fix validation issues in this field:

Field: {fieldName}
Current content: {currentValue}
Validation errors: {context}

Provide corrected content that:
- Meets all validation requirements
- Maintains the original intent
- Is properly formatted
- Follows best practices

Return only the corrected content.`,

  auto_completion: `Complete this partially filled field:

Field: {fieldName}
Partial content: {currentValue}
Context from conversation: {context}

Provide completed content that:
- Builds on the existing content
- Adds relevant details
- Maintains consistency
- Is comprehensive

Return only the completed content.`,

  suggestion_application: `Apply this suggestion to improve the field:

Field: {fieldName}
Current content: {currentValue}
Suggestion to apply: {context}

Provide improved content that:
- Incorporates the suggestion
- Maintains existing good content
- Improves overall quality
- Is well-integrated

Return only the improved content.`,
}

export function buildConversationPrompt(context: AIPromptContext): string {
  const { conversationHistory, currentFormState, userProfile, stage } = context

  let prompt = SYSTEM_PROMPT + "\n\n"

  // Add stage-specific guidance
  prompt += `Current Stage: ${stage}\n`
  prompt += `Stage Guidance: ${STAGE_PROMPTS[stage]}\n\n`

  // Add user profile context if available
  if (userProfile) {
    prompt += `User Profile:\n`
    if (userProfile.industry) prompt += `- Industry: ${userProfile.industry}\n`
    if (userProfile.companySize) prompt += `- Company Size: ${userProfile.companySize}\n`
    if (userProfile.previousProjects) prompt += `- Previous Projects: ${userProfile.previousProjects}\n`
    prompt += "\n"
  }

  // Add current form state
  prompt += `Current Form State:\n`
  Object.entries(currentFormState).forEach(([field, value]) => {
    if (value) {
      prompt += `- ${field}: ${Array.isArray(value) ? value.join(", ") : value}\n`
    }
  })
  prompt += "\n"

  // Add conversation history (last 10 messages to stay within token limits)
  const recentMessages = conversationHistory.slice(-10)
  if (recentMessages.length > 0) {
    prompt += `Recent Conversation:\n`
    recentMessages.forEach((msg) => {
      prompt += `${msg.role}: ${msg.content}\n`
    })
    prompt += "\n"
  }

  prompt += `Respond with a JSON object following the specified format. Be conversational and helpful while gathering the information needed for the current stage.`

  return prompt
}

export function buildEnhancementPrompt(
  type: keyof typeof ENHANCEMENT_PROMPTS,
  fieldName: string,
  currentValue: string,
  context?: string,
): string {
  return ENHANCEMENT_PROMPTS[type]
    .replace("{fieldName}", fieldName)
    .replace("{currentValue}", currentValue)
    .replace("{context}", context || "")
}
