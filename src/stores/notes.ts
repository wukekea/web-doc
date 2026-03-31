import { defineStore } from "pinia";
import { ref } from "vue";
import type { NoteNode } from "@/types";
import { storage } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "notes";

export const useNotesStore = defineStore("notes", () => {
  const notes = ref<Map<string, NoteNode>>(new Map());
  const rootIds = ref<string[]>([]);

  // 初始化：从存储加载笔记
  async function init() {
    const data = await storage.get<{ notes: NoteNode[]; rootIds: string[] }>(
      STORAGE_KEY,
    );
    if (data) {
      notes.value = new Map(data.notes.map((n) => [n.id, n]));
      rootIds.value = data.rootIds;
    }
  }

  // 保存到存储
  async function save() {
    const data = {
      notes: Array.from(notes.value.values()),
      rootIds: rootIds.value,
    };
    await storage.set(STORAGE_KEY, data);
  }

  // 创建笔记
  function createNote(title: string, parentId?: string): NoteNode {
    const now = Date.now();
    const note: NoteNode = {
      id: uuidv4(),
      title,
      content: "",
      children: [],
      parentId,
      createdAt: now,
      updatedAt: now,
    };
    notes.value.set(note.id, note);
    if (parentId) {
      const parent = notes.value.get(parentId);
      if (parent) {
        parent.children.push(note.id);
      }
    } else {
      rootIds.value.push(note.id);
    }
    save();
    return note;
  }

  // 更新笔记
  function updateNote(id: string, updates: Partial<NoteNode>) {
    const note = notes.value.get(id);
    if (note) {
      Object.assign(note, updates, { updatedAt: Date.now() });
      save();
    }
  }

  // 删除笔记
  function deleteNote(id: string) {
    const note = notes.value.get(id);
    if (!note) return;

    // 递归删除子节点
    note.children.forEach((childId) => deleteNote(childId));

    // 从父节点移除
    if (note.parentId) {
      const parent = notes.value.get(note.parentId);
      if (parent) {
        parent.children = parent.children.filter((cid) => cid !== id);
      }
    } else {
      rootIds.value = rootIds.value.filter((rid) => rid !== id);
    }

    notes.value.delete(id);
    save();
  }

  // 获取笔记
  function getNote(id: string): NoteNode | undefined {
    return notes.value.get(id);
  }

  // 获取子节点
  function getChildren(id: string): NoteNode[] {
    const note = notes.value.get(id);
    if (!note) return [];
    return note.children
      .map((cid) => notes.value.get(cid))
      .filter(Boolean) as NoteNode[];
  }

  return {
    notes,
    rootIds,
    init,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    getChildren,
  };
});
