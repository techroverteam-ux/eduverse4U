// Error handling service following SOLID principles
export interface IErrorHandler {
  handleError(error: Error, context?: string): void
  logError(error: Error, context?: string): void
}

export class ErrorHandler implements IErrorHandler {
  handleError(error: Error, context = 'Unknown'): void {
    this.logError(error, context)
    
    // In production, you might want to send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service (e.g., Sentry)
      console.error(`[${context}] Production Error:`, error)
    }
  }

  logError(error: Error, context = 'Unknown'): void {
    const timestamp = new Date().toISOString()
    console.error(`[${timestamp}] [${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
  }
}

export const errorHandler = new ErrorHandler()