import { defineStore } from "pinia";
import { ref } from "vue";
import type { Note } from "@/types";
import { storage } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "notes";

export const useNotesStore = defineStore("notes", () => {
  const notes = ref<Map<string, Note>>(new Map());

  // 初始化：从存储加载笔记，如果没有则创建示例数据
  async function init() {
    const data = await storage.get<{ notes: Note[] }>(STORAGE_KEY);
    if (data && data.notes.length > 0) {
      notes.value = new Map(data.notes.map((n) => [n.id, n]));
    } else {
      // 创建示例数据
      createSampleData();
    }
  }

  // 创建示例数据
  function createSampleData() {
    createNote("我的笔记");
    createNote("学习笔记");
    createNote("工作计划");
  }

  // 保存到存储
  async function save() {
    const data = {
      notes: Array.from(notes.value.values()),
    };
    await storage.set(STORAGE_KEY, data);
  }

  // 创建笔记
  function createNote(title: string): Note {
    const now = Date.now();
    const note: Note = {
      id: uuidv4(),
      title,
      content: "",
      createdAt: now,
      updatedAt: now,
    };
    notes.value.set(note.id, note);
    save();
    return note;
  }

  // 更新笔记
  function updateNote(id: string, updates: Partial<Note>) {
    const note = notes.value.get(id);
    if (note) {
      Object.assign(note, updates, { updatedAt: Date.now() });
      save();
    }
  }

  // 删除笔记
  function deleteNote(id: string) {
    notes.value.delete(id);
    save();
  }

  // 获取笔记
  function getNote(id: string): Note | undefined {
    return notes.value.get(id);
  }

  // 获取所有笔记（按更新时间降序）
  function getAllNotes(): Note[] {
    return Array.from(notes.value.values()).sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
  }

  return {
    notes,
    init,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    getAllNotes,
  };
});
