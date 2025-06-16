import type { ConversationMessage, AIPromptContext } from "@/types/ai-listing-types"

/**
 * Service to optimize AI performance and token usage
 */
export class PerformanceOptimizer {
  /**
   * Optimize conversation history to reduce token usage
   */
  static optimizeConversationHistory(messages: ConversationMessage[], maxMessages = 8): ConversationMessage[] {
    if (messages.length <= maxMessages) {
      return messages
    }

    // Always keep the first system message if present
    const systemMessage = messages.find((m: any) => m.role === "system")

    // Get the most recent messages
    const recentMessages = messages.slice(-maxMessages)

    // If we found a system message and it's not in the recent messages, add it
    if (systemMessage && !recentMessages.includes(systemMessage)) {
      return [systemMessage, ...recentMessages.slice(1)]
    }

    return recentMessages
  }

  /**
   * Optimize prompt context to reduce token usage
   */
  static optimizePromptContext(context: AIPromptContext): AIPromptContext {
    // Optimize conversation history
    const optimizedHistory = this.optimizeConversationHistory(context.conversationHistory)

    // Optimize form state by removing null/undefined values
    const optimizedFormState = Object.entries(context.currentFormState || {}).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, any>,
    )

    return {
      ...context,
      conversationHistory: optimizedHistory,
      currentFormState: optimizedFormState,
    }
  }

  /**
   * Estimate token usage for a prompt
   */
  static estimateTokenUsage(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
  }

  /**
   * Compress conversation history for long-running sessions
   */
  static compressConversationHistory(messages: ConversationMessage[]): ConversationMessage[] {
    if (messages.length <= 10) {
      return messages
    }

    // Keep the first system message if present
    const systemMessage = messages.find((m: any) => m.role === "system")

    // Keep the 5 most recent exchanges (10 messages)
    const recentMessages = messages.slice(-10)

    // Summarize older messages
    const olderMessages = messages.slice(systemMessage ? 1 : 0, -10)
    if (olderMessages.length === 0) {
      return systemMessage ? [systemMessage, ...recentMessages] : recentMessages
    }

    // Create a summary message
    const summaryContent = `[Previous conversation summary: ${olderMessages.length} messages discussing ${this.generateSummaryTopics(olderMessages)}]`

    const summaryMessage: ConversationMessage = {
      id: "summary_" + Date.now(),
      role: "system",
      content: summaryContent,
      timestamp: new Date(),
      metadata: {
        isSummary: true,
        originalMessageCount: olderMessages.length,
      },
    }

    // Return the optimized conversation history
    return systemMessage ? [systemMessage, summaryMessage, ...recentMessages] : [summaryMessage, ...recentMessages]
  }

  /**
   * Generate summary topics from conversation
   */
  private static generateSummaryTopics(messages: ConversationMessage[]): string {
    // Extract key topics from messages
    const allText = messages.map((m: any) => m.content).join(" ")

    // Simple keyword extraction
    const words = allText.toLowerCase().split(/\W+/)
    const stopWords = new Set(["the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with"])

    // Count word frequencies
    const wordCounts = words.reduce(
      (acc, word) => {
        if (word.length > 3 && !stopWords.has(word)) {
          acc[word] = (acc[word] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    // Get top 5 keywords
    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]: any) => word)

    return topKeywords.join(", ")
  }

  /**
   * Dynamically adjust model parameters based on complexity
   */
  static getOptimalModelParameters(context: AIPromptContext): { temperature: number; maxTokens: number } {
    const formState = context.currentFormState || {}
    const stage = context.stage

    // Default parameters
    const defaults = { temperature: 0.7, maxTokens: 1000 }

    // Adjust based on stage
    switch (stage) {
      case "introduction":
        return { temperature: 0.8, maxTokens: 800 } // More creative, shorter

      case "project_basics":
        return { temperature: 0.7, maxTokens: 1000 } // Balanced

      case "requirements_gathering":
        return { temperature: 0.6, maxTokens: 1200 } // More precise, longer

      case "technical_details":
        return { temperature: 0.5, maxTokens: 1200 } // More precise, longer

      case "success_metrics":
        return { temperature: 0.6, maxTokens: 1000 } // Balanced

      case "budget_discussion":
        return { temperature: 0.5, maxTokens: 800 } // More precise, shorter

      case "final_review":
        return { temperature: 0.4, maxTokens: 1500 } // Very precise, comprehensive

      default:
        return defaults
    }
  }

  /**
   * Cache frequently used prompts
   */
  private static promptCache: Map<string, string> = new Map()

  static getCachedPrompt(key: string): string | undefined {
    return this.promptCache.get(key)
  }

  static cachePrompt(key: string, prompt: string): void {
    this.promptCache.set(key, prompt)

    // Limit cache size
    if (this.promptCache.size > 100) {
      // Remove oldest entry
      const firstKey = this.promptCache.keys().next().value
      this.promptCache.delete(firstKey)
    }
  }
}
