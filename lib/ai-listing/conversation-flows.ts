import type { ConversationStage, ConversationFlow } from "@/types/ai-listing-types"

export const CONVERSATION_FLOWS: Record<ConversationStage, ConversationFlow> = {
  introduction: {
    stage: "introduction",
    requiredFields: [],
    optionalFields: [],
    nextStages: ["project_basics"],
    prompts: [
      {
        id: "welcome",
        name: "Welcome Message",
        stage: "introduction",
        template: `Welcome! I'm here to help you create a comprehensive project listing that will attract the right service providers.

I'll guide you through gathering all the important details about your project, including:
- Project overview and requirements
- Budget and timeline expectations  
- Success metrics and goals
- Technical specifications

This usually takes 5-10 minutes and results in a much more detailed and effective listing.

Let's start with the basics - what kind of project are you looking to get help with?`,
        variables: [],
      },
      {
        id: "project_type_identification",
        name: "Project Type Identification",
        stage: "introduction",
        template: `Based on what you've told me, it sounds like you need help with {projectType}. 

To make sure I understand correctly:
- What's the main business problem you're trying to solve?
- Who will be the primary users of this solution?
- Is this a new project or improving something existing?`,
        variables: ["projectType"],
      },
    ],
    validationRules: [],
  },

  project_basics: {
    stage: "project_basics",
    requiredFields: ["title", "categoryId", "aboutBusiness"],
    optionalFields: ["aboutCompany"],
    nextStages: ["requirements_gathering", "budget_discussion"],
    prompts: [
      {
        id: "title_generation",
        name: "Project Title Generation",
        stage: "project_basics",
        template: `Great! Based on our conversation, I can suggest a project title for you:

"{suggestedTitle}"

Does this capture what you're looking for, or would you like me to adjust it? A good title should be:
- Clear and specific about what you need
- Appealing to the right service providers
- Professional but not overly technical

What industry is your company in? This helps me tailor the project description.`,
        variables: ["suggestedTitle"],
      },
      {
        id: "category_selection",
        name: "Category Selection",
        stage: "project_basics",
        template: `Perfect! Now let me help categorize your project. Based on what you've described, this seems like it would fit in the "{suggestedCategory}" category.

The right category helps qualified providers find your project. Does this category seem right, or would you prefer a different one?

Available categories:
- Web Development
- Mobile Development  
- Software Development
- Data Analysis
- Design
- Marketing
- Consulting`,
        variables: ["suggestedCategory"],
      },
      {
        id: "business_description",
        name: "Business Description",
        stage: "project_basics",
        template: `Now let's create a compelling project description. I'll help you write something that clearly explains:

1. What your business does
2. The specific challenge you're facing
3. What kind of solution you're looking for
4. Why this project is important

Tell me more about:
- Your company's main business/industry
- The specific problem this project will solve
- What success looks like for you`,
        variables: [],
      },
    ],
    validationRules: [
      {
        field: "title",
        rule: "required",
        errorMessage: "Project title is required",
      },
      {
        field: "title",
        rule: "format",
        params: { minLength: 10, maxLength: 100 },
        errorMessage: "Title should be 10-100 characters",
      },
    ],
  },

  requirements_gathering: {
    stage: "requirements_gathering",
    requiredFields: ["detailedNeeds"],
    optionalFields: ["tags", "currentChallenges"],
    nextStages: ["technical_details", "success_metrics"],
    prompts: [
      {
        id: "functional_requirements",
        name: "Functional Requirements",
        stage: "requirements_gathering",
        template: `Let's dive into the specific requirements for your project. I'll help you think through all the important details that providers need to know.

For a {projectType} project, here are some key areas to consider:

**Core Functionality:**
- What are the main features users need?
- What workflows or processes should be supported?
- Are there any specific integrations required?

**User Experience:**
- Who are the primary users?
- What devices/platforms do they use?
- Any accessibility requirements?

**Data & Content:**
- What kind of data will be handled?
- Where does the data come from?
- Any reporting or analytics needs?

Let's start with the core functionality - what are the 3-5 most important things this solution needs to do?`,
        variables: ["projectType"],
      },
      {
        id: "integration_requirements",
        name: "Integration Requirements",
        stage: "requirements_gathering",
        template: `Great! Now let's talk about integrations and connections. Most projects need to work with existing systems or third-party services.

Do you need to integrate with any of these common systems?
- **Accounting:** QuickBooks, Xero, SAP, etc.
- **CRM:** Salesforce, HubSpot, Pipedrive, etc.
- **E-commerce:** Shopify, WooCommerce, Magento, etc.
- **Payment:** Stripe, PayPal, Square, etc.
- **Communication:** Slack, Teams, email systems, etc.
- **Analytics:** Google Analytics, Mixpanel, etc.
- **Other business tools:** What else do you use daily?

Also, do you have any existing databases or systems that need to be connected?`,
        variables: [],
      },
      {
        id: "challenges_identification",
        name: "Current Challenges",
        stage: "requirements_gathering",
        template: `Understanding your current challenges helps providers propose the best solutions.

What are the main pain points you're experiencing now?
- **Process inefficiencies:** Manual work that could be automated?
- **Data problems:** Hard to access, inconsistent, or scattered data?
- **User experience issues:** Difficult or time-consuming workflows?
- **Integration gaps:** Systems that don't talk to each other?
- **Scalability concerns:** Current solution can't handle growth?
- **Cost issues:** Current approach is too expensive?

What's the biggest frustration with your current situation?`,
        variables: [],
      },
    ],
    validationRules: [
      {
        field: "detailedNeeds",
        rule: "required",
        errorMessage: "At least one detailed requirement is needed",
      },
    ],
  },

  technical_details: {
    stage: "technical_details",
    requiredFields: [],
    optionalFields: ["tags"],
    nextStages: ["success_metrics", "timeline_milestones"],
    prompts: [
      {
        id: "technology_preferences",
        name: "Technology Preferences",
        stage: "technical_details",
        template: `Let's discuss the technical aspects. Don't worry if you're not technical - I'll help translate your needs into clear requirements.

**Platform & Access:**
- Do you need a web application, mobile app, or both?
- Should it work on all devices (responsive design)?
- Any specific browser requirements?

**Technology Preferences:**
Do you have any preferences or requirements for:
- Programming languages or frameworks?
- Database systems?
- Cloud platforms (AWS, Google Cloud, Azure)?
- Hosting preferences?

**Existing Technology:**
- What technology does your team currently use?
- Any systems this needs to integrate with?
- Do you have existing hosting or infrastructure?

If you're not sure about technical details, just tell me about your preferences for things like speed, reliability, and ease of use.`,
        variables: [],
      },
      {
        id: "scalability_security",
        name: "Scalability and Security",
        stage: "technical_details",
        template: `Now let's think about scalability and security - important considerations for any business solution.

**Scalability:**
- How many users do you expect initially?
- How much growth do you anticipate in the next 1-2 years?
- Are there peak usage times or seasonal variations?
- Any specific performance requirements?

**Security & Compliance:**
- Do you handle sensitive data (personal info, financial data, health records)?
- Any industry compliance requirements (HIPAA, PCI-DSS, GDPR, SOX)?
- Do you need user authentication and role-based access?
- Any specific security certifications required?

**Backup & Recovery:**
- How critical is this system to your business operations?
- What's acceptable downtime in case of issues?
- Any specific backup or disaster recovery needs?`,
        variables: [],
      },
    ],
    validationRules: [],
  },

  success_metrics: {
    stage: "success_metrics",
    requiredFields: ["successMetrics"],
    optionalFields: [],
    nextStages: ["timeline_milestones", "budget_discussion"],
    prompts: [
      {
        id: "kpi_definition",
        name: "KPI Definition",
        stage: "success_metrics",
        template: `Defining success metrics upfront helps ensure the project delivers real business value. Let's identify the key ways you'll measure success.

**Business Impact Metrics:**
- Revenue: Will this increase sales, reduce costs, or improve efficiency?
- Time savings: How much time will this save your team?
- User adoption: How many people will use this regularly?
- Customer satisfaction: Will this improve customer experience?

**Operational Metrics:**
- Process efficiency: Faster completion of tasks?
- Error reduction: Fewer mistakes or manual corrections?
- Data accuracy: Better reporting and decision-making?
- Compliance: Meeting regulatory requirements?

**Technical Metrics:**
- Performance: Page load times, response times?
- Reliability: Uptime, error rates?
- Scalability: Handling increased load?

What are the top 3-5 ways you'll know this project was successful? Try to be specific with numbers where possible (e.g., "reduce processing time by 50%" rather than "make things faster").`,
        variables: [],
      },
      {
        id: "roi_expectations",
        name: "ROI Expectations",
        stage: "success_metrics",
        template: `Understanding your return on investment expectations helps providers propose solutions that deliver real value.

**Cost Savings:**
- Will this reduce labor costs? By how much?
- Eliminate software licenses or subscriptions?
- Reduce errors or rework?
- Save time on manual processes?

**Revenue Impact:**
- Enable new revenue streams?
- Improve customer retention?
- Increase average order value?
- Faster time to market for products/services?

**Efficiency Gains:**
- How much time does your team currently spend on the processes this will improve?
- What's the hourly cost of that time?
- How many people will benefit from the improvements?

**Timeline for ROI:**
- When do you expect to see initial benefits?
- Full return on investment timeline?

What's the main business case for this project? What convinced you it was worth investing in?`,
        variables: [],
      },
    ],
    validationRules: [
      {
        field: "successMetrics",
        rule: "required",
        errorMessage: "At least one success metric is required",
      },
    ],
  },

  timeline_milestones: {
    stage: "timeline_milestones",
    requiredFields: ["bidDeadline"],
    optionalFields: ["timelinePhases"],
    nextStages: ["budget_discussion", "final_review"],
    prompts: [
      {
        id: "timeline_planning",
        name: "Timeline Planning",
        stage: "timeline_milestones",
        template: `Let's plan a realistic timeline for your project. Good timeline planning helps set proper expectations and ensures project success.

**Project Urgency:**
- Is there a hard deadline driving this project?
- Any external factors (compliance, seasonal business, etc.)?
- When would you ideally like to start?

**Typical Timeline for {projectType} projects:**
- **Discovery & Planning:** 1-2 weeks
- **Design & Architecture:** 2-4 weeks  
- **Development:** 4-12 weeks (depending on complexity)
- **Testing & Refinement:** 2-3 weeks
- **Deployment & Training:** 1-2 weeks

**Phased Approach:**
Would you prefer:
- All features delivered at once (big bang approach)?
- Phased delivery with core features first?
- MVP (minimum viable product) followed by enhancements?

**Your Involvement:**
- How much time can you dedicate to the project weekly?
- Who else from your team will be involved?
- Any periods when you'll be unavailable (vacations, busy seasons)?

When would you ideally like to have this completed?`,
        variables: ["projectType"],
      },
      {
        id: "milestone_definition",
        name: "Milestone Definition",
        stage: "timeline_milestones",
        template: `Let's break your project into clear milestones. This helps track progress and ensures everyone stays aligned.

Based on your requirements, here's a suggested milestone structure:

**Phase 1: Foundation (Weeks 1-2)**
- Requirements finalization
- Technical architecture
- Design mockups/wireframes
- Project kickoff

**Phase 2: Core Development (Weeks 3-6)**
- Core functionality implementation
- Basic user interface
- Initial integrations
- Weekly progress reviews

**Phase 3: Advanced Features (Weeks 7-10)**
- Advanced features
- Complete integrations
- Performance optimization
- User testing

**Phase 4: Launch Preparation (Weeks 11-12)**
- Final testing and bug fixes
- User training and documentation
- Deployment and go-live
- Post-launch support setup

Does this structure work for your timeline? Any adjustments needed?

What are the most critical milestones from your perspective?`,
        variables: [],
      },
    ],
    validationRules: [
      {
        field: "bidDeadline",
        rule: "required",
        errorMessage: "Project deadline is required",
      },
    ],
  },

  budget_discussion: {
    stage: "budget_discussion",
    requiredFields: ["budgetMin"],
    optionalFields: ["budgetMax"],
    nextStages: ["final_review"],
    prompts: [
      {
        id: "budget_guidance",
        name: "Budget Guidance",
        stage: "budget_discussion",
        template: `Let's discuss budget to ensure you get proposals that match your investment level. I'll help you think through realistic budget ranges.

**Typical Budget Ranges for {projectType}:**
- **Simple projects:** $5,000 - $15,000
- **Medium complexity:** $15,000 - $50,000
- **Complex projects:** $50,000 - $150,000+
- **Enterprise solutions:** $150,000+

**Factors affecting cost:**
- Number of features and complexity
- Custom integrations required
- User interface complexity
- Performance and scalability requirements
- Timeline (rushed projects cost more)
- Team size and expertise level needed

**Budget Considerations:**
- Development costs (60-70% of budget)
- Design and user experience (15-20%)
- Project management (10-15%)
- Testing and quality assurance (10-15%)
- Post-launch support and maintenance

**Your Budget:**
- What budget range are you comfortable with?
- Is this a fixed budget or flexible based on value?
- Any budget approval processes to consider?

Based on your requirements, what budget range feels realistic for this project?`,
        variables: ["projectType"],
      },
      {
        id: "payment_structure",
        name: "Payment Structure",
        stage: "budget_discussion",
        template: `Great! Now let's discuss payment structure preferences. Different approaches work better for different projects and cash flow situations.

**Common Payment Structures:**

**Milestone-Based (Recommended):**
- Pay as milestones are completed
- Typical: 25% upfront, 25% at midpoint, 25% at completion, 25% after launch
- Good for: Most projects, provides protection for both parties

**Fixed Price:**
- One price for entire project
- Usually paid in 2-3 installments
- Good for: Well-defined projects with clear scope

**Time & Materials:**
- Pay for actual hours worked
- Weekly or monthly billing
- Good for: Projects with evolving requirements

**Hybrid Approach:**
- Fixed price for core features
- Time & materials for additional requests
- Good for: Projects likely to have scope changes

**Your Preferences:**
- Do you prefer predictable costs or flexibility?
- Any cash flow considerations?
- Company policies on vendor payments?

What payment approach feels most comfortable for your situation?`,
        variables: [],
      },
    ],
    validationRules: [
      {
        field: "budgetMin",
        rule: "required",
        errorMessage: "Minimum budget is required",
      },
      {
        field: "budgetMin",
        rule: "range",
        params: { min: 1000, max: 1000000 },
        errorMessage: "Budget should be between $1,000 and $1,000,000",
      },
    ],
  },

  final_review: {
    stage: "final_review",
    requiredFields: [],
    optionalFields: [],
    nextStages: ["completed"],
    prompts: [
      {
        id: "project_summary",
        name: "Project Summary",
        stage: "final_review",
        template: `Excellent! Let me summarize your project listing to make sure we've captured everything correctly:

**Project Overview:**
- Title: {title}
- Category: {category}
- Budget: {budgetMin} - {budgetMax}
- Timeline: {timeline}

**Key Requirements:**
{requirements}

**Success Metrics:**
{successMetrics}

**Technical Details:**
{technicalDetails}

This looks like a comprehensive project listing that should attract qualified providers. 

**Before we publish:**
- Does this accurately represent your project?
- Any important details we missed?
- Any adjustments to the description or requirements?
- Ready to start receiving proposals?

**What happens next:**
1. Your listing will be published to qualified providers
2. You'll start receiving proposals within 24-48 hours
3. You can review proposals, ask questions, and interview providers
4. Choose the best fit and start your project!

Are you ready to publish this listing?`,
        variables: [
          "title",
          "category",
          "budgetMin",
          "budgetMax",
          "timeline",
          "requirements",
          "successMetrics",
          "technicalDetails",
        ],
      },
    ],
    validationRules: [],
  },

  completed: {
    stage: "completed",
    requiredFields: [],
    optionalFields: [],
    nextStages: [],
    prompts: [
      {
        id: "completion_message",
        name: "Completion Message",
        stage: "completed",
        template: `🎉 Congratulations! Your project listing has been created successfully.

**What's Next:**
1. **Review Period:** Take a final look at your listing before publishing
2. **Provider Matching:** We'll notify qualified providers about your project
3. **Proposal Review:** Start receiving and reviewing proposals
4. **Provider Selection:** Interview and choose the best fit

**Tips for Success:**
- Respond promptly to provider questions
- Be clear about your timeline and expectations
- Consider providers' experience and communication style
- Don't just choose the lowest price - value matters

**Need Help?**
- Use our messaging system to communicate with providers
- Our support team is available if you have questions
- You can always edit your listing if needed

Good luck with your project! 🚀`,
        variables: [],
      },
    ],
    validationRules: [],
  },
}

export function getNextStage(currentStage: ConversationStage, formData: any): ConversationStage {
  const flow = CONVERSATION_FLOWS[currentStage]

  // Check if current stage requirements are met
  const hasRequiredFields = flow.requiredFields.every((field: any) => {
    const value = formData[field]
    return value && (Array.isArray(value) ? value.length > 0 : true)
  })

  if (!hasRequiredFields) {
    return currentStage // Stay in current stage until requirements are met
  }

  // Determine next stage based on what's missing
  const nextStages = flow.nextStages

  for (const nextStage of nextStages) {
    const nextFlow = CONVERSATION_FLOWS[nextStage]
    const hasNextRequiredFields = nextFlow.requiredFields.every((field: any) => {
      const value = formData[field]
      return value && (Array.isArray(value) ? value.length > 0 : true)
    })

    if (!hasNextRequiredFields) {
      return nextStage // Move to next stage that needs completion
    }
  }

  // If all next stages are complete, move to final review or completion
  if (currentStage !== "final_review" && currentStage !== "completed") {
    return "final_review"
  }

  return "completed"
}

export function validateStageCompletion(
  stage: ConversationStage,
  formData: any,
): { isValid: boolean; missingFields: string[] } {
  const flow = CONVERSATION_FLOWS[stage]
  const missingFields: string[] = []

  flow.requiredFields.forEach((field: any) => {
    const value = formData[field]
    if (!value || (Array.isArray(value) && value.length === 0)) {
      missingFields.push(field)
    }
  })

  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}

export function getStageProgress(formData: any): {
  currentStage: ConversationStage
  completedStages: ConversationStage[]
  overallProgress: number
} {
  const stages: ConversationStage[] = [
    "introduction",
    "project_basics",
    "requirements_gathering",
    "technical_details",
    "success_metrics",
    "timeline_milestones",
    "budget_discussion",
    "final_review",
  ]

  const completedStages: ConversationStage[] = []
  let currentStage: ConversationStage = "introduction"

  for (const stage of stages) {
    const { isValid } = validateStageCompletion(stage, formData)
    if (isValid) {
      completedStages.push(stage)
    } else {
      currentStage = stage
      break
    }
  }

  const overallProgress = Math.round((completedStages.length / stages.length) * 100)

  return {
    currentStage,
    completedStages,
    overallProgress,
  }
}
