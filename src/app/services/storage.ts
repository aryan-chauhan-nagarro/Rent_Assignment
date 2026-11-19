/**
 * Storage service providing safe typed read, write, and delete operations over browser localStorage.
 */
import { Service } from '@angular/core';

@Service()
export class StorageService {
  /**
   * Retrieves and deserializes a JSON value from localStorage by key.
   *
   * @param key - The localStorage key name.
   * @returns Parsed object of type T, or null if key does not exist or JSON parsing fails.
   */
  get<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      return null;
    }
  }

  /**
   * Serializes and stores a value into localStorage under the given key.
   *
   * @param key - The localStorage key name.
   * @param value - The data value to serialize and store.
   */
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Removes an item from localStorage by its key.
   *
   * @param key - The localStorage key name to remove.
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
