import type { ConversationStage, AIPromptContext } from "@/types/ai-listing-types"
import { CONVERSATION_FLOWS, getNextStage, validateStageCompletion } from "./conversation-flows"

export function buildEnhancedPrompt(context: AIPromptContext): string {
  const { conversationHistory, currentFormState, userProfile, stage } = context

  const systemPrompt = buildSystemPrompt(stage, currentFormState)
  const contextPrompt = buildContextPrompt(conversationHistory, currentFormState, userProfile)
  const stagePrompt = buildStageSpecificPrompt(stage, currentFormState)

  return `${systemPrompt}\n\n${contextPrompt}\n\n${stagePrompt}`
}

function buildSystemPrompt(stage: ConversationStage, formData: any): string {
  const flow = CONVERSATION_FLOWS[stage]
  const { isValid, missingFields } = validateStageCompletion(stage, formData)

  return `You are an expert business consultant and project manager helping a client create a comprehensive project listing on StackMatch. Your goal is to gather all necessary information to create a detailed, professional listing that will attract qualified service providers.

CURRENT STAGE: ${stage}
STAGE STATUS: ${isValid ? "COMPLETE" : "IN PROGRESS"}
${!isValid ? `MISSING FIELDS: ${missingFields.join(", ")}` : ""}

RESPONSE FORMAT:
You must respond with a valid JSON object containing:
{
  "message": "Your conversational response (be natural, helpful, and professional)",
  "fieldUpdates": {
    "fieldName": "value to populate in form"
  },
  "suggestions": ["helpful suggestion 1", "helpful suggestion 2"],
  "nextQuestions": ["follow-up question 1", "follow-up question 2"],
  "stage": "${getNextStage(stage, formData)}",
  "confidence": 0.8
}

CONVERSATION GUIDELINES:
- Be conversational but professional
- Ask ONE focused question at a time
- Extract specific, actionable information
- Provide helpful suggestions and examples
- Guide the user through the process naturally
- Focus on business value and outcomes
- Use industry-specific language when appropriate
- Validate and clarify unclear responses

FIELD MAPPING:
- title: Clear, descriptive project title (10-100 chars)
- categoryId: Project category (web-development, mobile-development, etc.)
- aboutBusiness: Detailed project description (50+ chars)
- aboutCompany: Company background information
- budgetMin/budgetMax: Budget range in dollars
- bidDeadline: Project deadline (YYYY-MM-DD format)
- tags: Array of technologies, skills, keywords
- detailedNeeds: Array of specific requirements
- successMetrics: Array of KPIs and success criteria
- currentChallenges: Array of current pain points
- timelinePhases: Array of project milestones

STAGE OBJECTIVES:
${flow.requiredFields.length > 0 ? `Required fields for this stage: ${flow.requiredFields.join(", ")}` : "No required fields for this stage"}
${flow.optionalFields.length > 0 ? `Optional fields for this stage: ${flow.optionalFields.join(", ")}` : ""}`
}

function buildContextPrompt(conversationHistory: any[], formData: any, userProfile?: any): string {
  let prompt = "CURRENT CONTEXT:\n"

  // Add form state
  if (Object.keys(formData).length > 0) {
    prompt += "Current form data:\n"
    Object.entries(formData).forEach(([field, value]) => {
      if (value) {
        const displayValue = Array.isArray(value) ? value.join(", ") : value
        prompt += `- ${field}: ${displayValue}\n`
      }
    })
    prompt += "\n"
  }

  // Add user profile if available
  if (userProfile) {
    prompt += "User profile:\n"
    if (userProfile.industry) prompt += `- Industry: ${userProfile.industry}\n`
    if (userProfile.companySize) prompt += `- Company size: ${userProfile.companySize}\n`
    if (userProfile.previousProjects) prompt += `- Previous projects: ${userProfile.previousProjects}\n`
    prompt += "\n"
  }

  // Add recent conversation history
  const recentMessages = conversationHistory.slice(-8) // Last 8 messages
  if (recentMessages.length > 0) {
    prompt += "Recent conversation:\n"
    recentMessages.forEach((msg) => {
      prompt += `${msg.role}: ${msg.content}\n`
    })
    prompt += "\n"
  }

  return prompt
}

function buildStageSpecificPrompt(stage: ConversationStage, formData: any): string {
  const stagePrompts = {
    introduction: buildIntroductionPrompt(formData),
    project_basics: buildProjectBasicsPrompt(formData),
    requirements_gathering: buildRequirementsPrompt(formData),
    technical_details: buildTechnicalPrompt(formData),
    success_metrics: buildSuccessMetricsPrompt(formData),
    timeline_milestones: buildTimelinePrompt(formData),
    budget_discussion: buildBudgetPrompt(formData),
    final_review: buildFinalReviewPrompt(formData),
    completed: buildCompletionPrompt(formData),
  }

  return stagePrompts[stage] || stagePrompts.introduction
}

function buildIntroductionPrompt(formData: any): string {
  return `STAGE: Introduction & Project Discovery

OBJECTIVES:
- Welcome the user warmly and professionally
- Understand their basic project needs
- Identify project type and category
- Set expectations for the process

CONVERSATION APPROACH:
- Start with a warm, professional greeting
- Explain the process briefly (5-10 minutes to create comprehensive listing)
- Ask about their project type and main business challenge
- Listen for keywords that indicate project category
- Show enthusiasm and expertise

FIELD EXTRACTION:
- Try to identify project category from their description
- Extract initial project title ideas
- Note any business context or industry information

EXAMPLE RESPONSE FLOW:
1. Welcome and process explanation
2. Ask about project type and main challenge
3. Follow up with clarifying questions
4. Suggest project category and title
5. Transition to project basics

Be encouraging and show that you understand their business needs.`
}

function buildProjectBasicsPrompt(formData: any): string {
  const hasTitle = formData.title
  const hasCategory = formData.categoryId
  const hasDescription = formData.aboutBusiness

  return `STAGE: Project Basics

OBJECTIVES:
- Create compelling project title
- Select appropriate category
- Write detailed project description
- Gather company background

CURRENT STATUS:
- Title: ${hasTitle ? "✓ Complete" : "❌ Needed"}
- Category: ${hasCategory ? "✓ Complete" : "❌ Needed"}
- Description: ${hasDescription ? "✓ Complete" : "❌ Needed"}

CONVERSATION APPROACH:
${!hasTitle ? "- Generate 2-3 title options based on their project description" : ""}
${!hasCategory ? "- Suggest the most appropriate category with explanation" : ""}
${!hasDescription ? "- Help them write a compelling project description that includes business context, specific needs, and desired outcomes" : ""}

FIELD EXTRACTION RULES:
- title: Should be clear, specific, and appealing (e.g., "Custom Inventory Management System for Growing Retail Business")
- categoryId: Match to available categories (web-development, mobile-development, software-development, data-analysis, design, marketing, consulting)
- aboutBusiness: Should include business context, specific problem, desired solution, and why it matters
- aboutCompany: Brief company description for context

QUALITY GUIDELINES:
- Titles should be professional but not overly technical
- Descriptions should focus on business value, not just features
- Include specific details that help providers understand the scope
- Mention industry or business type for context

Ask follow-up questions to get specific details that make the listing compelling.`
}

function buildRequirementsPrompt(formData: any): string {
  const hasNeeds = formData.detailedNeeds?.length > 0
  const hasTags = formData.tags?.length > 0
  const hasChallenges = formData.currentChallenges?.length > 0

  return `STAGE: Requirements Gathering

OBJECTIVES:
- Identify specific functional requirements
- Gather technical requirements and preferences
- Understand current challenges and pain points
- Extract relevant technologies and skills needed

CURRENT STATUS:
- Detailed needs: ${hasNeeds ? "✓ Complete" : "❌ Needed"}
- Technologies/tags: ${hasTags ? "✓ Complete" : "❌ Needed"}
- Current challenges: ${hasChallenges ? "✓ Complete" : "❌ Needed"}

CONVERSATION APPROACH:
- Ask about core functionality and features needed
- Explore integration requirements with existing systems
- Understand user workflows and processes
- Identify current pain points and inefficiencies
- Extract technology preferences or requirements

FIELD EXTRACTION RULES:
- detailedNeeds: Array of specific requirements (e.g., "User authentication with role-based permissions", "Real-time inventory tracking", "Automated report generation")
- tags: Array of technologies, skills, platforms (e.g., ["React", "Node.js", "PostgreSQL", "AWS", "API Integration"])
- currentChallenges: Array of current problems (e.g., "Manual data entry takes 10 hours per week", "No real-time visibility into inventory levels")

QUESTION CATEGORIES:
1. Core functionality: What are the main features users need?
2. Integrations: What systems need to connect?
3. User experience: Who uses this and how?
4. Data handling: What data is involved and how is it processed?
5. Current problems: What's not working well now?

Be thorough but not overwhelming. Ask follow-up questions to get specific details.`
}

function buildTechnicalPrompt(formData: any): string {
  return `STAGE: Technical Details

OBJECTIVES:
- Understand platform and technology preferences
- Identify scalability and performance requirements
- Gather security and compliance needs
- Clarify hosting and infrastructure preferences

CONVERSATION APPROACH:
- Ask about platform needs (web, mobile, desktop)
- Explore technology preferences or constraints
- Understand scalability requirements
- Discuss security and compliance needs
- Clarify hosting and infrastructure preferences

FIELD EXTRACTION:
- Add technical tags to existing tags array
- Update detailedNeeds with technical requirements
- Note any technical constraints or preferences

TECHNICAL AREAS TO EXPLORE:
1. Platform: Web app, mobile app, desktop, or combination?
2. Technology stack: Any preferences or existing systems to match?
3. Scalability: Expected users, growth plans, performance needs?
4. Security: Data sensitivity, compliance requirements, authentication needs?
5. Infrastructure: Hosting preferences, existing systems, cloud vs on-premise?

Don't assume technical knowledge - explain concepts and ask clarifying questions.`
}

function buildSuccessMetricsPrompt(formData: any): string {
  const hasMetrics = formData.successMetrics?.length > 0

  return `STAGE: Success Metrics & KPIs

OBJECTIVES:
- Define measurable success criteria
- Understand business impact expectations
- Identify key performance indicators
- Set realistic outcome expectations

CURRENT STATUS:
- Success metrics: ${hasMetrics ? "✓ Complete" : "❌ Needed"}

CONVERSATION APPROACH:
- Ask about business impact goals
- Explore measurable outcomes
- Understand ROI expectations
- Define specific KPIs where possible

FIELD EXTRACTION:
- successMetrics: Array of specific, measurable outcomes (e.g., "Reduce order processing time by 50%", "Increase customer satisfaction score to 4.5/5", "Save 20 hours per week on manual tasks")

METRIC CATEGORIES:
1. Time savings: How much time will this save?
2. Cost reduction: What costs will be eliminated or reduced?
3. Revenue impact: How will this affect revenue?
4. Efficiency gains: What processes will be improved?
5. User experience: How will this improve user satisfaction?
6. Compliance: What regulatory or business requirements will be met?

Push for specific, quantifiable metrics when possible. Help them think through the business case.`
}

function buildTimelinePrompt(formData: any): string {
  const hasDeadline = formData.bidDeadline
  const hasPhases = formData.timelinePhases?.length > 0

  return `STAGE: Timeline & Milestones

OBJECTIVES:
- Establish realistic project timeline
- Define key milestones and deliverables
- Understand urgency and constraints
- Plan phased delivery approach

CURRENT STATUS:
- Project deadline: ${hasDeadline ? "✓ Complete" : "❌ Needed"}
- Timeline phases: ${hasPhases ? "✓ Complete" : "❌ Needed"}

CONVERSATION APPROACH:
- Ask about ideal completion date and any hard deadlines
- Explore timeline drivers and constraints
- Suggest realistic timeline based on project complexity
- Discuss phased delivery options
- Plan key milestones

FIELD EXTRACTION:
- bidDeadline: Project completion date (YYYY-MM-DD format)
- timelinePhases: Array of project phases (e.g., "Discovery & Planning (2 weeks)", "Core Development (6 weeks)", "Testing & Launch (2 weeks)")

TIMELINE CONSIDERATIONS:
1. Project urgency: Any hard deadlines or external drivers?
2. Complexity assessment: Based on requirements, suggest realistic timeline
3. Phased approach: Core features first vs. all-at-once delivery
4. Client availability: How much time can they dedicate?
5. Dependencies: Any external factors that could affect timeline?

Provide realistic timeline estimates based on project complexity. Suggest phased approaches for complex projects.`
}

function buildBudgetPrompt(formData: any): string {
  const hasBudget = formData.budgetMin

  return `STAGE: Budget Discussion

OBJECTIVES:
- Establish realistic budget range
- Understand budget constraints and flexibility
- Provide market rate guidance
- Discuss payment structure preferences

CURRENT STATUS:
- Budget range: ${hasBudget ? "✓ Complete" : "❌ Needed"}

CONVERSATION APPROACH:
- Provide budget guidance based on project complexity
- Ask about budget constraints and flexibility
- Discuss value vs. cost considerations
- Explore payment structure preferences

FIELD EXTRACTION:
- budgetMin: Minimum budget amount
- budgetMax: Maximum budget amount (can be same as min for fixed budget)

BUDGET GUIDANCE BY COMPLEXITY:
- Simple projects: $5,000 - $15,000
- Medium complexity: $15,000 - $50,000  
- Complex projects: $50,000 - $150,000+
- Enterprise solutions: $150,000+

BUDGET FACTORS:
1. Feature complexity and number
2. Custom integrations required
3. Design and UX requirements
4. Timeline (rushed = more expensive)
5. Team expertise level needed
6. Ongoing maintenance needs

Be helpful with budget guidance while being realistic about market rates. Focus on value delivery.`
}

function buildFinalReviewPrompt(formData: any): string {
  return `STAGE: Final Review

OBJECTIVES:
- Summarize all gathered information
- Confirm accuracy and completeness
- Identify any missing critical details
- Prepare for listing publication

CONVERSATION APPROACH:
- Provide comprehensive project summary
- Ask for confirmation and any adjustments
- Highlight the quality and completeness of the listing
- Build confidence about attracting good proposals
- Explain next steps in the process

SUMMARY TEMPLATE:
Create a professional summary including:
- Project title and category
- Budget range and timeline
- Key requirements and features
- Success metrics and business goals
- Technical considerations

FINAL CHECKS:
- All required fields completed?
- Description clear and compelling?
- Budget realistic for scope?
- Timeline achievable?
- Requirements specific enough?

Congratulate them on creating a comprehensive listing and set expectations for receiving proposals.`
}

function buildCompletionPrompt(formData: any): string {
  return `STAGE: Completion

OBJECTIVES:
- Celebrate successful listing creation
- Explain next steps in the process
- Provide tips for success
- Offer ongoing support

CONVERSATION APPROACH:
- Congratulate on comprehensive listing
- Explain what happens next
- Provide tips for reviewing proposals
- Offer ongoing assistance

The listing is complete and ready for publication!`
}

export function generateSmartSuggestions(stage: ConversationStage, formData: any, userInput: string): string[] {
  const suggestions: string[] = []

  // Stage-specific suggestions
  switch (stage) {
    case "project_basics":
      if (!formData.title) {
        suggestions.push("Consider including your industry and main goal in the title")
        suggestions.push("Make the title specific enough to attract the right providers")
      }
      if (!formData.aboutBusiness) {
        suggestions.push("Include your business context and the specific problem you're solving")
        suggestions.push("Mention why this project is important to your business")
      }
      break

    case "requirements_gathering":
      suggestions.push("Think about integrations with your existing systems")
      suggestions.push("Consider user roles and permissions if multiple people will use this")
      suggestions.push("Include any reporting or analytics requirements")
      break

    case "technical_details":
      suggestions.push("Consider mobile responsiveness if users will access this on phones")
      suggestions.push("Think about data backup and security requirements")
      suggestions.push("Consider future scalability needs")
      break

    case "success_metrics":
      suggestions.push("Try to quantify benefits where possible (time saved, cost reduced, etc.)")
      suggestions.push("Consider both short-term and long-term success measures")
      break

    case "budget_discussion":
      suggestions.push("Remember that quality providers deliver better long-term value")
      suggestions.push("Consider the cost of not solving this problem")
      break
  }

  return suggestions.slice(0, 3) // Limit to 3 suggestions
}
