enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: this.getTimestamp(),
      level,
      message,
      ...(data && { data }),
    };
  }

  private output(entry: LogEntry): void {
    const logMessage = `[${entry.timestamp}] ${entry.level}: ${entry.message}`;
    const output = entry.data ? `${logMessage}\n${JSON.stringify(entry.data, null, 2)}` : logMessage;

    if (entry.level === LogLevel.ERROR) {
      console.error(output);
    } else if (entry.level === LogLevel.WARN) {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  error(message: string, data?: unknown): void {
    this.output(this.formatLog(LogLevel.ERROR, message, data));
  }

  warn(message: string, data?: unknown): void {
    this.output(this.formatLog(LogLevel.WARN, message, data));
  }

  info(message: string, data?: unknown): void {
    this.output(this.formatLog(LogLevel.INFO, message, data));
  }

  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      this.output(this.formatLog(LogLevel.DEBUG, message, data));
    }
  }
}

export const logger = new Logger();
