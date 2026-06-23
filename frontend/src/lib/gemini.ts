export const isGeminiConfigured = typeof process !== 'undefined' && process.env ? Boolean(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_CONFIGURED) : false
