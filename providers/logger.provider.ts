import { ConsoleLogger, Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@Injectable()
export class AppLogger extends ConsoleLogger {
  private logFiles = {
    log: path.join(__dirname, '../../logs/app.log'),
    error: path.join(__dirname, '../../logs/error.log'),
    warn: path.join(__dirname, '../../logs/warn.log'),
    debug: path.join(__dirname, '../../logs/debug.log'),
    verbose: path.join(__dirname, '../../logs/verbose.log'),
    combined: path.join(__dirname, '../../logs/combined.log'),
  };

  private writeLog(level: keyof typeof this.logFiles, message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}`;
    try {
      fs.appendFileSync(this.logFiles[level], logMessage + '\n');
      fs.appendFileSync(this.logFiles['combined'], logMessage + '\n');
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        fs.mkdirSync(path.dirname(this.logFiles[level]), { recursive: true });
        fs.appendFileSync(this.logFiles[level], logMessage + '\n');
        fs.appendFileSync(this.logFiles['combined'], logMessage + '\n');
      } else {
        throw error;
      }
    }
  }

  log(message: string) {
    super.log(message);
    this.writeLog('log', `LOG: ${message}`);
  }

  error(message: string, trace: string) {
    super.error(message, trace);
    this.writeLog('error', `ERROR: ${message} - TRACE: ${trace}`);
  }

  warn(message: string) {
    super.warn(message);
    this.writeLog('warn', `WARN: ${message}`);
  }

  debug(message: string) {
    super.debug(message);
    this.writeLog('debug', `DEBUG: ${message}`);
  }

  verbose(message: string) {
    super.verbose(message);
    this.writeLog('verbose', `VERBOSE: ${message}`);
  }
}
