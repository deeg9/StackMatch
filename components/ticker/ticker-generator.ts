import { v4 as uuidv4 } from "uuid"

export type TickerType = "deadline" | "new_projects" | "award" | "milestone" | "trending"

export interface TickerItem {
  id: string
  type: TickerType
  message: string
  link?: string
  timestamp: number
}

// Helper functions to generate ticker items based on platform events
export const TickerGenerator = {
  // Generate a ticker item for a project deadline
  projectDeadline: (projectId: string, projectName: string, hoursRemaining: number): TickerItem => {
    return {
      id: uuidv4(),
      type: "deadline",
      message: `Project "${projectName}" due in ${hoursRemaining} ${hoursRemaining === 1 ? "hour" : "hours"}`,
      link: `/projects/${projectId}`,
      timestamp: Date.now(),
    }
  },

  // Generate a ticker item for new projects
  newProjects: (count: number, timeFrame: string): TickerItem => {
    return {
      id: uuidv4(),
      type: "new_projects",
      message: `${count} new project${count === 1 ? "" : "s"} submitted in the last ${timeFrame}`,
      link: "/projects",
      timestamp: Date.now(),
    }
  },

  // Generate a ticker item for a project award
  projectAward: (
    providerId: string,
    providerName: string,
    clientId: string,
    clientName: string,
    projectId: string,
  ): TickerItem => {
    return {
      id: uuidv4(),
      type: "award",
      message: `${providerName} just won a project with ${clientName}`,
      link: `/projects/${projectId}`,
      timestamp: Date.now(),
    }
  },

  // Generate a ticker item for a platform milestone
  platformMilestone: (milestone: string): TickerItem => {
    return {
      id: uuidv4(),
      type: "milestone",
      message: `StackMatch just reached ${milestone}!`,
      timestamp: Date.now(),
    }
  },

  // Generate a ticker item for trending categories
  trendingCategory: (category: string): TickerItem => {
    return {
      id: uuidv4(),
      type: "trending",
      message: `${category} projects are trending this week`,
      link: `/projects?category=${encodeURIComponent(category.toLowerCase())}`,
      timestamp: Date.now(),
    }
  },
}
