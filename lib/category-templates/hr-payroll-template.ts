import type { CategoryTemplate, QuestionSection } from "@/types/guided-listing-types"

export const hrPayrollQualificationSections: QuestionSection[] = [
  {
    id: "general",
    title: "General Information",
    description: "Understanding your current HR/Payroll landscape and goals",
    proTip: "Do not be single threaded. Align with Finance & HR at a minimum.",
    questions: [
      {
        id: "current_systems",
        text: "Can you tell me a little bit about your current HR/Payroll systems?",
        type: "group",
        required: true,
        subQuestions: [
          {
            id: "current_systems_what",
            text: "What are they?",
            type: "textarea",
            required: true,
            placeholder: "Describe your current HR/Payroll systems...",
          },
          {
            id: "current_systems_why_change",
            text: "Why are you looking to make changes?",
            type: "textarea",
            required: true,
            placeholder: "Explain the reasons for considering a change...",
          },
        ],
      },
      {
        id: "goals_success",
        text: "What goals are you hoping to achieve and how will you measure the success of your investment?",
        type: "textarea",
        required: true,
        placeholder: "Describe your goals and success metrics...",
      },
      {
        id: "decision_makers",
        text: "Who will be involved in this evaluation and who has the power to make the final decision?",
        type: "textarea",
        required: true,
        placeholder: "List the stakeholders and decision makers...",
      },
      {
        id: "buying_team_needs",
        text: "What does the buying team need to see and learn about in order to feel confident making an informed decision?",
        type: "textarea",
        required: true,
        placeholder: "Describe what information the team needs...",
      },
      {
        id: "decision_process",
        text: "How is a decision made? What does the path to approvals look like?",
        type: "textarea",
        required: true,
        placeholder: "Outline your decision-making process...",
      },
      {
        id: "other_solutions",
        text: "What other solutions are you evaluating? How do you feel about how those other solutions achieve this initiative's goals?",
        type: "textarea",
        required: true,
        placeholder: "List other solutions and your thoughts on them...",
      },
      {
        id: "headcount_growth",
        text: "What are your anticipated headcount growth goals over the next 12 months?",
        type: "textarea",
        required: true,
        placeholder: "Describe your hiring plans and growth expectations...",
        proTip: "Heavy EC users could convert to HR for more value",
      },
    ],
  },
  {
    id: "payroll",
    title: "Payroll (US Only)",
    description: "Understanding your current payroll processes and requirements",
    questions: [
      {
        id: "payroll_process",
        text: "Walk me through your current Payroll Run Process.",
        type: "group",
        required: true,
        subQuestions: [
          {
            id: "payroll_feins",
            text: "How many Payroll FEINs/Subs do you pay people out of?",
            type: "number",
            required: true,
            contextTooltip:
              "The Employer Identification Number, also known as the Federal Employer Identification Number or the Federal Tax Identification Number, is a unique nine-digit number assigned by the Internal Revenue Service to business entities operating in the United States for the purposes of identification.",
          },
          {
            id: "employee_types",
            text: "How many salaried, hourly, and overtime eligible employees do you pay each run?",
            type: "textarea",
            required: true,
            placeholder: "Break down by employee type (salaried, hourly, overtime eligible)...",
          },
          {
            id: "states_jurisdictions",
            text: "Which states and jurisdictions do you operate in?",
            type: "textarea",
            required: true,
            placeholder: "List all states and jurisdictions...",
          },
          {
            id: "payroll_frequency",
            text: "What frequency(s) do you currently run Payroll?",
            type: "textarea",
            required: true,
            placeholder: "Describe your current payroll frequency...",
          },
          {
            id: "payroll_frequency_change",
            text: "Are you looking to continue to run with the same frequency(s) or is this something that you are looking to make a change to? If you are looking to make a change, what would that be?",
            type: "textarea",
            required: false,
            placeholder: "Describe any desired changes to payroll frequency...",
          },
          {
            id: "gl_update",
            text: "How do you update your GL today? How does finance have the ability to understand the impact of Payroll to the bottom line?",
            type: "textarea",
            required: true,
            placeholder: "Describe your GL update process and finance visibility...",
          },
          {
            id: "payroll_time",
            text: "How long does it take to run payroll today? Specifically, how long does it take to reconcile Payroll against your GL?",
            type: "textarea",
            required: true,
            placeholder: "Describe timing for payroll processing and reconciliation...",
            helpText: "If it is a manual effort - potential value to reduce time/improve accuracy through automation.",
          },
          {
            id: "garnishments",
            text: "Approximately how many garnishments do you process and what types are they?",
            type: "textarea",
            required: false,
            placeholder: "Describe garnishment volume and types...",
            contextTooltip:
              "Garnishment, or wage garnishment, is when money is legally withheld by the employer from an employee's paycheck and sent to a 3rd party. Garnishments are used for debts such as taxes, monetary fines, child support payments, and student loans.",
          },
        ],
      },
      {
        id: "fines_penalties",
        text: "Are you dealing with fines/penalties today due to errors?",
        type: "textarea",
        required: false,
        placeholder: "Describe any current compliance issues or penalties...",
        proTip: "This in itself is a major cost saving SuitePeople can protect/provide.",
      },
    ],
  },
  {
    id: "hr",
    title: "HR Management",
    description: "Understanding your global workforce and HR processes",
    questions: [
      {
        id: "global_workforce",
        text: "How many people do you employ globally?",
        type: "group",
        required: true,
        subQuestions: [
          {
            id: "total_employees",
            text: "Total number of employees",
            type: "number",
            required: true,
          },
          {
            id: "countries_breakdown",
            text: "What countries are they working in? How many employees are in each country?",
            type: "textarea",
            required: true,
            placeholder: "List countries and employee counts for each...",
          },
        ],
      },
      {
        id: "global_hr_management",
        text: "How do you generally manage your global workforce in terms of HR across your global locations?",
        type: "textarea",
        required: true,
        placeholder: "Describe your global HR management approach...",
      },
      {
        id: "system_tracking",
        text: "Is this all tracked and maintained in the same system? If not, do the numbers in your HR system match what you see in your Financial System?",
        type: "textarea",
        required: true,
        placeholder: "Describe your system integration and data consistency...",
      },
      {
        id: "reporting_analytics",
        text: "How are you generating reports and analytics around your workforce (headcount reporting, YoY turnover, census, etc.)?",
        type: "group",
        required: true,
        subQuestions: [
          {
            id: "reporting_process",
            text: "Describe your current reporting process",
            type: "textarea",
            required: true,
            placeholder: "How do you currently generate workforce reports...",
          },
          {
            id: "reporting_time",
            text: "How much time is spent to generate reports and analytics around your workforce and who needs to be involved each time?",
            type: "textarea",
            required: true,
            placeholder: "Describe time investment and people involved...",
            proTip:
              "HERE IS OUR CHANCE TO PROMOTE SUITEVALUE AND THE SUITEPPL STORY – single unified view, bring together payroll, hr, financial all in a single dashboard etc.",
          },
        ],
      },
      {
        id: "employee_self_service",
        text: "How does your organization achieve employee self-service for HR needs (e.g. address changes, viewing benefits, payroll, etc.)?",
        type: "group",
        required: true,
        subQuestions: [
          {
            id: "self_service_process",
            text: "Describe your current self-service capabilities",
            type: "textarea",
            required: true,
            placeholder: "How do employees currently handle self-service tasks...",
          },
          {
            id: "time_off_policy",
            text: "Could you send me an example of your time off policy? How do you manage time off requests?",
            type: "textarea",
            required: true,
            placeholder: "Describe your time off policy and request process...",
          },
          {
            id: "vacation_liabilities",
            text: "How do you manage vacation liabilities today? How do you track the financial impact of this time out of office? What is the risk to your books?",
            type: "textarea",
            required: true,
            placeholder: "Describe vacation liability tracking and financial impact...",
          },
          {
            id: "self_service_time",
            text: "How long do employees spend on self service level activities? (address changes, viewing benefits, payroll)",
            type: "textarea",
            required: false,
            placeholder: "Estimate time employees spend on self-service tasks...",
            proTip: "HERE IS OUR CHANCE TO PROMOTE SUITEVALUE AND THE SUITEPPL STORY",
          },
        ],
      },
    ],
  },
  {
    id: "performance",
    title: "Performance Management",
    description: "Understanding your performance review processes",
    questions: [
      {
        id: "performance_process",
        text: "What is your current process for managing employee performance and performance reviews?",
        type: "group",
        required: true,
        subQuestions: [
          {
            id: "review_coverage",
            text: "How many employees get performance reviews? Are there any employee groups you would not want to set goals for?",
            type: "textarea",
            required: true,
            placeholder: "Describe who gets reviews and any exclusions...",
          },
          {
            id: "review_time",
            text: "How long does it take to manage the performance review process and who is involved each time?",
            type: "textarea",
            required: true,
            placeholder: "Describe time investment and people involved in reviews...",
          },
        ],
      },
      {
        id: "performance_improvements",
        text: "How would you like to improve your organization's current performance review process (biggest pain points?)",
        type: "textarea",
        required: true,
        placeholder: "Describe your biggest pain points and desired improvements...",
      },
    ],
  },
]

export const hrPayrollTemplate: CategoryTemplate = {
  value: "hr-payroll",
  label: "HR & Payroll",
  name: "HR & Payroll",
  description: "Human resources management and payroll processing solutions",
  icon: "👥",
  color: "emerald",
  popularity: 1,
  avgTime: "15-20 min",
  qualificationQuestions: [], // Will be populated from sections
  qualificationSections: hrPayrollQualificationSections,
  scopingQuestions: [], // Will be provided later
  scopingSections: [], // Will be provided later
}
