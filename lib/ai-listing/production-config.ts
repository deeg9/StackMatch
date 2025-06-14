/**
 * Production configuration for AI listing system
 */
export const PRODUCTION_CONFIG = {
  // Model configuration
  model: {
    provider: "deepinfra", // Options: "deepinfra", "openai", "anthropic"
    modelName: "meta-llama/Meta-Llama-3.1-70B-Instruct", // Default model
    fallbackModel: "meta-llama/Meta-Llama-3-8B-Instruct", // Fallback model if primary fails
    temperature: 0.7,
    maxTokens: 1000,
    timeout: 30000, // 30 seconds
  },

  // Rate limiting
  rateLimit: {
    maxRequestsPerMinute: 10,
    maxRequestsPerHour: 100,
    maxTokensPerDay: 100000,
  },

  // Caching
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour
    maxSize: 1000, // Max cache entries
  },

  // Monitoring
  monitoring: {
    enabled: true,
    logLevel: "info", // Options: "debug", "info", "warn", "error"
    sampleRate: 0.1, // Log 10% of requests for performance analysis
    trackMetrics: true,
  },

  // Error handling
  errorHandling: {
    maxRetries: 2,
    retryDelay: 1000, // 1 second
    fallbackToSimpleResponse: true,
  },

  // Feature flags
  features: {
    enhancedPrompts: true,
    conversationCompression: true,
    smartSuggestions: true,
    fieldValidation: true,
    realTimeMetrics: true,
  },

  // Integration settings
  integration: {
    saveConversationHistory: true,
    trackFieldChanges: true,
    minCompletionForDraft: 30, // Minimum completion percentage for drafts
    minCompletionForPublish: 70, // Minimum completion percentage for publishing
  },

  // UI settings
  ui: {
    animations: true,
    showSuggestions: true,
    autoSaveInterval: 30000, // 30 seconds
    maxVisibleMessages: 50,
  },
}

/**
 * Get configuration based on environment
 */
export function getConfig(env: string = process.env.NODE_ENV || "development") {
  // Base configuration
  const config = { ...PRODUCTION_CONFIG }

  // Override based on environment
  if (env === "development") {
    config.monitoring.logLevel = "debug"
    config.monitoring.sampleRate = 1.0 // Log all requests in development
    config.cache.enabled = false // Disable cache in development
  } else if (env === "test") {
    config.model.provider = "deepinfra"
    config.model.modelName = "meta-llama/Meta-Llama-3-8B-Instruct" // Use smaller model for tests
    config.monitoring.enabled = false
    config.cache.enabled = false
  }

  return config
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureName: keyof typeof PRODUCTION_CONFIG.features): boolean {
  const config = getConfig()
  return config.features[featureName] || false
}
