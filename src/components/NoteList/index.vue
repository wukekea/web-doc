<script setup lang="ts">
import { computed } from "vue";
import { useNotesStore } from "@/stores/notes";
import MarkdownRenderer from "@/components/MarkdownRenderer/index.vue";

const notesStore = useNotesStore();

const props = defineProps<{
  activeNoteId: string | null;
}>();

const emit = defineEmits<{
  edit: [id: string];
  preview: [id: string];
  delete: [id: string];
}>();

// 格式化时间 YYYY-MM-DD HH:mm
function formatDateTime(timestamp: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 所有笔记（按更新时间降序）
const allNotes = computed(() => notesStore.getAllNotes());
</script>

<template>
  <div class="note-list">
    <div v-if="allNotes.length === 0" class="empty-state">
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
      <p class="empty-text">点击右下角按钮创建第一个笔记</p>
    </div>
    <div v-else class="note-cards">
      <div
        v-for="note in allNotes"
        :key="note.id"
        class="note-card"
        @click="emit('preview', note.id)"
      >
        <!-- 标题和操作按钮 -->
        <div class="note-header">
          <h3 class="note-title">{{ note.title || "无标题" }}</h3>
          <div class="note-actions">
            <button
              class="action-btn"
              @click.stop="emit('edit', note.id)"
              title="编辑"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
            </button>
            <button
              class="action-btn delete-btn"
              @click.stop="emit('delete', note.id)"
              title="删除"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 内容预览 -->
        <div v-if="note.content" class="note-preview">
          <MarkdownRenderer :content="note.content" />
        </div>

        <!-- 元信息 -->
        <div class="note-meta">
          <div class="meta-time">
            <svg
              class="time-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M8 4v4M8 8h3" />
            </svg>
            <span class="time-text"
              >创建：{{ formatDateTime(note.createdAt) }}</span
            >
          </div>
          <div class="meta-time">
            <svg
              class="time-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M4 4h8M12 4v8M12 8h-3" />
            </svg>
            <span class="time-text"
              >更新：{{ formatDateTime(note.updatedAt) }}</span
            >
          </div>
        </div>
      </div>
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

.note-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.note-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  min-height: 180px;
  max-height: 180px;
  overflow: hidden;
}

.note-card:hover {
  border-color: var(--accent-secondary);
  box-shadow: var(--shadow-medium);
  transform: translateY(-2px);
}

.note-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
}

.note-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 6px;
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
  width: 13px;
  height: 13px;
}

.note-preview {
  flex: 1;
  overflow: hidden;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  line-height: 1.6;
  padding: 12px 16px;
  position: relative;
  min-height: 0;
}

.note-preview :deep(.markdown-renderer) {
  font-size: 0.8125rem;
  line-height: 1.6;
}

.note-preview :deep(h1),
.note-preview :deep(h2),
.note-preview :deep(h3) {
  font-size: 0.875rem;
  margin-top: 0.4em;
  margin-bottom: 0.2em;
}

.note-preview :deep(p),
.note-preview :deep(ul),
.note-preview :deep(ol) {
  margin-bottom: 0.3em;
}

.note-preview :deep(p:last-child),
.note-preview :deep(ul:last-child),
.note-preview :deep(ol:last-child) {
  margin-bottom: 0;
}

/* 内容溢出时显示省略效果 */
.note-preview::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2.5em;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 50%,
    var(--bg-primary) 100%
  );
  pointer-events: none;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px 10px 16px;
  background: var(--bg-primary);
  flex-shrink: 0;
  border-top: 1px solid var(--border-color);
}

.meta-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

.time-icon {
  width: 11px;
  height: 11px;
  opacity: 0.7;
}

.time-text {
  font-family:
    ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
  letter-spacing: 0.02em;
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

  .note-cards {
    grid-template-columns: 1fr;
  }

  .note-card {
    min-height: 180px;
    max-height: 180px;
  }

  .note-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
