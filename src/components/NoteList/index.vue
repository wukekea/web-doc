<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useNotesStore } from "@/stores/notes";
import NoteListItem from "./NoteListItem.vue";
import type { NoteNode } from "@/types";

const notesStore = useNotesStore();
const { t } = useI18n();

const emit = defineEmits<{
  edit: [id: string];
  addChild: [parentId: string];
  delete: [id: string];
}>();

// 展开的节点 ID
const expandedIds = ref<Set<string>>(new Set());

// 切换展开/折叠
function toggleExpand(id: string) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id);
  } else {
    expandedIds.value.add(id);
  }
}

// 计算属性：根节点列表
const rootNotes = computed(() => {
  const notes: NoteNode[] = [];
  for (const id of notesStore.rootIds) {
    const note = notesStore.getNote(id);
    if (note) {
      notes.push(note);
    }
  }
  return notes;
});
</script>

<template>
  <div class="note-list">
    <div v-if="rootNotes.length === 0" class="empty-state">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class="empty-icon"
      >
        <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <circle cx="12" cy="12" r="10" />
      </svg>
      <p class="empty-text">{{ t("noteList.empty") }}</p>
    </div>
    <div v-else class="note-tree">
      <NoteListItem
        v-for="note in rootNotes"
        :key="note.id"
        :note="note"
        :level="0"
        :expanded-ids="expandedIds"
        @toggle="toggleExpand"
        @edit="(id) => emit('edit', id)"
        @add-child="(id) => emit('addChild', id)"
        @delete="(id) => emit('delete', id)"
      />
    </div>
  </div>
</template>

<style scoped>
.note-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.note-tree {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.note-item {
  position: relative;
}

.note-card {
  display: flex;
  align-items: flex-start;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-soft);
}

.note-card:hover {
  border-color: var(--accent-secondary);
  box-shadow: var(--shadow-medium);
  transform: translateY(-2px);
}

.note-indent {
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
  min-width: 24px;
}

.expand-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.expand-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-primary);
}

.expand-btn .icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.expand-btn .icon-expanded {
  transform: rotate(90deg);
}

.note-content {
  flex: 1;
  min-width: 0;
}

.note-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.note-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.note-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.action-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-primary);
}

.action-btn.delete-btn:hover {
  background: var(--danger-soft);
  color: var(--danger);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.note-preview {
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.note-preview :deep(.markdown-renderer) {
  font-size: 0.9375rem;
}

.note-preview :deep(h1),
.note-preview :deep(h2),
.note-preview :deep(h3) {
  font-size: 1rem;
  margin-top: 0.75em;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.meta-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-children {
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: 100px;
}

.note-children {
  margin-top: 12px;
  margin-left: 32px;
  padding-left: 20px;
  border-left: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 1rem;
  color: var(--text-secondary);
}

/* 响应式 */
@media (max-width: 640px) {
  .note-list {
    padding: 12px;
  }

  .note-card {
    padding: 16px;
  }

  .note-children {
    margin-left: 20px;
    padding-left: 16px;
  }

  .note-title {
    font-size: 1rem;
  }
}
</style>
