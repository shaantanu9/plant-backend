import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Log levels
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

/**
 * Logger configuration interface
 */
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  logDirectory: string;
  logFileName: string;
  maxLogFileSize: number; // in bytes
  maxLogFiles: number;
  isEnabled: boolean;
}

// Default logger configuration
const defaultConfig: LoggerConfig = {
  level: LogLevel.INFO,
  enableConsole: true,
  enableFile: true,
  logDirectory: path.join(process.cwd(), 'logs'),
  logFileName: 'app.log',
  maxLogFileSize: 5 * 1024 * 1024, // 5MB
  maxLogFiles: 5,
  isEnabled: true,
};

// Global configuration
let loggerConfig: LoggerConfig = { ...defaultConfig };

// Create logs directory if it doesn't exist
if (!fs.existsSync(loggerConfig.logDirectory)) {
  fs.mkdirSync(loggerConfig.logDirectory, { recursive: true });
}

/**
 * Format log message with timestamp, level, and additional context
 */
const formatLogMessage = (
  level: string,
  message: string | object,
  context?: Record<string, any>,
): string => {
  const timestamp = new Date().toISOString();
  const formattedMessage =
    typeof message === 'object' ? util.inspect(message, { depth: 5, colors: false }) : message;

  const contextString = context
    ? ` | ${Object.entries(context)
        .map(
          ([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`,
        )
        .join(', ')}`
    : '';

  return `[${timestamp}] [${level.toUpperCase()}]${contextString} - ${formattedMessage}`;
};

/**
 * Manage log file rotation
 */
const rotateLogFileIfNeeded = (): void => {
  if (!loggerConfig.enableFile) return;

  const logFilePath = path.join(loggerConfig.logDirectory, loggerConfig.logFileName);

  try {
    // Check if file exists
    if (fs.existsSync(logFilePath)) {
      const stats = fs.statSync(logFilePath);

      // Rotate if file size exceeds max size
      if (stats.size >= loggerConfig.maxLogFileSize) {
        // Get existing log files
        const logFiles = fs
          .readdirSync(loggerConfig.logDirectory)
          .filter(
            file => file.startsWith(loggerConfig.logFileName) && file !== loggerConfig.logFileName,
          )
          .sort((a, b) => {
            const numA = parseInt(a.split('.').slice(-1)[0]) || 0;
            const numB = parseInt(b.split('.').slice(-1)[0]) || 0;
            return numB - numA; // Sort in descending order
          });

        // Remove oldest log file if we've reached max files
        if (logFiles.length >= loggerConfig.maxLogFiles - 1) {
          const oldestFile = logFiles[logFiles.length - 1];
          if (oldestFile) {
            fs.unlinkSync(path.join(loggerConfig.logDirectory, oldestFile));
          }
        }

        // Shift all log files
        for (let i = logFiles.length - 1; i >= 0; i--) {
          const file = logFiles[i];
          const num = parseInt(file.split('.').slice(-1)[0]) || 1;
          const oldPath = path.join(loggerConfig.logDirectory, file);
          const newPath = path.join(
            loggerConfig.logDirectory,
            `${loggerConfig.logFileName}.${num + 1}`,
          );
          fs.renameSync(oldPath, newPath);
        }

        // Rename current log file
        fs.renameSync(
          logFilePath,
          path.join(loggerConfig.logDirectory, `${loggerConfig.logFileName}.1`),
        );
      }
    }
  } catch (error) {
    console.error('Error rotating log file:', error);
  }
};

/**
 * Write log to file
 */
const writeToLogFile = (formattedMessage: string): void => {
  if (!loggerConfig.enableFile) return;

  try {
    rotateLogFileIfNeeded();

    const logFilePath = path.join(loggerConfig.logDirectory, loggerConfig.logFileName);
    fs.appendFileSync(logFilePath, formattedMessage + '\n', { encoding: 'utf8' });
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
};

/**
 * Core logger function
 */
const logMessage = (
  level: LogLevel,
  message: string | object,
  context?: Record<string, any>,
): void => {
  if (!loggerConfig.isEnabled || level > loggerConfig.level) return;

  const levelString = LogLevel[level];
  const formattedMessage = formatLogMessage(levelString, message, context);

  // Log to console if enabled
  if (loggerConfig.enableConsole) {
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
    }
  }

  // Log to file if enabled
  if (loggerConfig.enableFile) {
    writeToLogFile(formattedMessage);
  }
};

/**
 * Logger interface
 */
export interface Logger {
  error(message: string | object, context?: Record<string, any>): void;
  warn(message: string | object, context?: Record<string, any>): void;
  info(message: string | object, context?: Record<string, any>): void;
  debug(message: string | object, context?: Record<string, any>): void;
}

/**
 * Global logger functions
 */
export const logger: Logger = {
  error: (message: string | object, context?: Record<string, any>) =>
    logMessage(LogLevel.ERROR, message, context),
  warn: (message: string | object, context?: Record<string, any>) =>
    logMessage(LogLevel.WARN, message, context),
  info: (message: string | object, context?: Record<string, any>) =>
    logMessage(LogLevel.INFO, message, context),
  debug: (message: string | object, context?: Record<string, any>) =>
    logMessage(LogLevel.DEBUG, message, context),
};

/**
 * Get logger configuration
 */
export const getLoggerConfig = (): LoggerConfig => ({ ...loggerConfig });

/**
 * Update logger configuration
 */
export const configureLogger = (config: Partial<LoggerConfig>): void => {
  loggerConfig = { ...loggerConfig, ...config };

  // Create logs directory if it doesn't exist
  if (loggerConfig.enableFile && !fs.existsSync(loggerConfig.logDirectory)) {
    fs.mkdirSync(loggerConfig.logDirectory, { recursive: true });
  }

  logger.info('Logger configuration updated', { config: loggerConfig });
};

/**
 * Stop logging
 */
export const disableLogger = (): void => {
  loggerConfig.isEnabled = false;
};

/**
 * Start logging
 */
export const enableLogger = (): void => {
  loggerConfig.isEnabled = true;
  logger.info('Logger enabled');
};

/**
 * Create a request-scoped logger with context
 */
export const createScopedLogger = (context: Record<string, any>): Logger => ({
  error: (message: string | object, additionalContext?: Record<string, any>) =>
    logMessage(LogLevel.ERROR, message, { ...context, ...additionalContext }),
  warn: (message: string | object, additionalContext?: Record<string, any>) =>
    logMessage(LogLevel.WARN, message, { ...context, ...additionalContext }),
  info: (message: string | object, additionalContext?: Record<string, any>) =>
    logMessage(LogLevel.INFO, message, { ...context, ...additionalContext }),
  debug: (message: string | object, additionalContext?: Record<string, any>) =>
    logMessage(LogLevel.DEBUG, message, { ...context, ...additionalContext }),
});

/**
 * Express middleware to log requests and responses
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (!loggerConfig.isEnabled || LogLevel.INFO > loggerConfig.level) {
    next();
    return;
  }

  // Generate unique request ID if not already present
  const requestId =
    (req.headers['x-request-id'] as string) ||
    `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add request ID to headers
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);

  // Capture request start time
  const startTime = Date.now();

  // Create request context
  const context = {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
  };

  // Log request
  logger.info(`Request received: ${req.method} ${req.url}`, context);

  // Log request body if not a GET request and not a file upload
  if (req.method !== 'GET' && !req.headers['content-type']?.includes('multipart/form-data')) {
    logger.debug('Request body', {
      ...context,
      body: req.body || {},
    });
  }

  // Capture original response methods
  const originalSend = res.send;
  const originalJson = res.json;
  const originalEnd = res.end;
  let responseBody: any;

  // Override response methods to capture response data
  res.send = function (body: any): Response {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.json = function (body: any): Response {
    responseBody = body;
    return originalJson.call(this, body);
  };

  res.end = function (chunk?: any): Response {
    if (chunk && typeof chunk !== 'function') {
      responseBody = chunk;
    }

    // Calculate request duration
    const duration = Date.now() - startTime;

    // Create response context
    const responseContext = {
      ...context,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    // Log response
    if (res.statusCode >= 400) {
      logger.error(`Response error: ${req.method} ${req.url} ${res.statusCode}`, responseContext);

      // Log response body for errors
      if (responseBody) {
        try {
          const parsedBody =
            typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
          logger.debug('Response body', { ...responseContext, body: parsedBody });
        } catch (error) {
          logger.debug('Response body (not JSON)', { ...responseContext, body: responseBody });
        }
      }
    } else {
      logger.info(
        `Response sent: ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`,
        responseContext,
      );

      // Log response body for debug level
      if (responseBody && loggerConfig.level >= LogLevel.DEBUG) {
        try {
          const parsedBody =
            typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
          logger.debug('Response body', { ...responseContext, body: parsedBody });
        } catch (error) {
          // Only log raw body if it's not too large
          if (typeof responseBody === 'string' && responseBody.length < 1000) {
            logger.debug('Response body (not JSON)', { ...responseContext, body: responseBody });
          } else {
            logger.debug('Response body too large to log', responseContext);
          }
        }
      }
    }

    return originalEnd.call(this, chunk);
  };

  next();
};

/**
 * Error logger middleware
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const requestId = (req.headers['x-request-id'] as string) || 'unknown';

  const context = {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
  };

  logger.error(`Unhandled exception: ${err.message}`, {
    ...context,
    stack: err.stack,
  });

  next(err);
};

// Initialize logger
logger.info('Logger initialized', { config: loggerConfig });

export default {
  logger,
  requestLogger,
  errorLogger,
  configureLogger,
  enableLogger,
  disableLogger,
  getLoggerConfig,
  createScopedLogger,
};
