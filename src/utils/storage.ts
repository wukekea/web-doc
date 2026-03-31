import type { Storage } from "@/types";

/**
 * LocalStorage 实现类
 */
class LocalStorage implements Storage {
  async get<T>(key: string): Promise<T | null> {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

/**
 * 存储实例
 * 可通过修改此实例切换到其他存储实现（如后端 API）
 */
export const storage = new LocalStorage();
