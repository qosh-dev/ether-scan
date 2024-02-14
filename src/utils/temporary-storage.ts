import * as redis from 'redis';
import { RedisConnectionOptions } from 'src/types/config.type';

/**
 * This class provides temporary storage using Redis with automatic key prefixing and expiration.
 * It offers methods for setting, getting, and retrieving all data stored in Redis by the class.
 */
export class TemporaryStorage {
  /**
   * Internal storage client instance, created based on provided options.
   */
  private storage: ReturnType<typeof redis.createClient>;

  /**
   * List of all currently stored keys, automatically updated on get operations.
   */
  public get keys(): string[] {
    return Object.keys(this.storage);
  }

  /**
   * @param options - Configuration options for connecting to Redis.
   * @param prefix - Key prefix used for all stored data to avoid namespace conflicts.
   * @param delay - Default expiration time for stored data in milliseconds, defaults to 15 seconds.
   */
  constructor(
    readonly options: RedisConnectionOptions,
    readonly prefix: string,
    readonly delay: number = 15000,
  ) {
    this.initialize();
  }

  /**
   * Initializes the class by creating a Redis client and connecting to the server.
   */
  private async initialize() {
    this.storage = redis.createClient({
      socket: {
        host: this.options.host,
        port: this.options.port,
        passphrase: this.options.passphrase,
      },
    });
    await this.storage.connect();
  }

  /**
   * Gets the value associated with the specified key(s).
   * Checks keys in order, returning the first non-null value found.
   * @param keys - List of keys to retrieve values for.
   * @returns The first non-null value found, or undefined if none exist.
   */
  async get(...keys: string[]): Promise<string | undefined> {
    if (!this.storage) {
      return;
    }
    for (const key of keys) {
      const value = await this.storage.get(this.prefix + `_${key}`);
      if (value) return value;
    }
    return;
  }

  /**
   * Sets the value for the specified key with an optional expiration time.
   * @param key - The key to store the value under.
   * @param value - The value to store.
   * @returns A promise resolving to true if the operation was successful, otherwise false.
   */
  async set(key: string, value: string) {
    return this.storage.setEx(
      this.prefix + `_${key}`,
      this.delay / 1000,
      value,
    );
  }

  /**
   * Retrieves all data stored by the class in Redis as a key-value object.
   * @returns An object containing all stored keys and their corresponding values.
   */
  async getAllData(): Promise<{ [key: string]: string }> {
    const keys = await this.storage.keys('*');
    const values = await this.storage.mGet(keys);
    return keys.reduce((o, k, i) => ({ ...o, [k]: values[i] }), {});
  }
}
