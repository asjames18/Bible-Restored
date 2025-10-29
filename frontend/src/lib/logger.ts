/**
 * Logger utility with environment-aware logging
 * Logs only in development, errors in production
 */

export type LogLevel = 'log' | 'warn' | 'error' | 'info';

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // In development, log everything
    if (isDevelopment) return true;
    
    // In production, only log errors
    return level === 'error';
  }

  log(...args: any[]): void {
    if (this.shouldLog('log')) {
      console.log(...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    // Always log errors
    console.error(...args);
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...args);
    }
  }

  debug(...args: any[]): void {
    // Only in development
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  }
}

export const logger = new Logger();

// Environment detection
export const env = {
  isDevelopment,
  isProduction,
  mode: import.meta.env.MODE,
  get isDev() {
    return isDevelopment;
  },
  get isProd() {
    return isProduction;
  },
};


