/**
 * 笔记节点类型定义
 */
export interface NoteNode {
  id: string;
  title: string;
  content: string; // Markdown 内容
  children: string[]; // 子节点 ID 列表
  parentId?: string; // 父节点 ID
  createdAt: number;
  updatedAt: number;
}

/**
 * 存储接口
 */
export interface Storage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

/**
 * 应用配置
 */
export interface AppConfig {
  locale: string;
  theme: "light" | "dark";
}
