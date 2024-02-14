import { Logger } from '@nestjs/common';
import { BaseUtils } from './base.utils';

export type IntervalOptions = {
  refreshRateMs: number;
};

/**
 * Represents a recurring task executed at a configurable interval.
 */
export class Interval {
  /**
   * Internal ID of the Node.js timeout used for the interval.
   */
  private intervalId: NodeJS.Timeout;

  /**
   * Configuration options for the interval.
   */
  readonly options: IntervalOptions = {
    /**
     * Refresh rate in milliseconds for executing the action.
     */
    refreshRateMs: 5000,
  };

  /**
   * Name of the interval for identification and logging.
   */
  readonly name: string;

  /**
   * The action to be executed repeatedly at the specified interval.
   */
  readonly action: () => Promise<void>;

  /**
   * Creates a new Interval instance.
   * @param name - Name of the interval.
   * @param action - The action to be executed repeatedly.
   * @param options - Optional configuration options for the interval.
   */
  constructor(name: string, action: () => Promise<void>, options?: IntervalOptions) {
    this.name = name;
    this.action = action;
    if (options) {
      this.options = options;
    }
  }

  /**
   * Starts the interval, executing the action repeatedly at the defined refresh rate.
   * Handles potential errors and restarts the interval after each execution.
   */
  async start() {
    try {
      await this.action();
      await BaseUtils.wait(this.options.refreshRateMs);
      await this.start(); // Recursive call to continue the interval
    } catch (error) {
      console.log({ error });
      Logger.error(`Interval ${this.name} error:`, error);
    }
  }

  /**
   * Stops the interval by clearing the internal timeout.
   */
  stop() {
    clearInterval(this.intervalId);
    Logger.log(`Stopped interval: ${this.name}`);
  }

  /**
   * Restarts the interval by first stopping it and then starting it again.
   */
  restart() {
    this.stop();
    this.start();
  }
}
