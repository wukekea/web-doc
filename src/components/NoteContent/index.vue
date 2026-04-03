<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useNotesStore } from "@/stores/notes";
import MarkdownRenderer from "@/components/MarkdownRenderer/index.vue";

const notesStore = useNotesStore();

const props = defineProps<{
  noteId: string | null;
}>();

const emit = defineEmits<{
  close: [];
  delete: [id: string];
  edit: [id: string];
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

// 当前笔记
const currentNote = computed(() => {
  if (!props.noteId) return null;
  return notesStore.getNote(props.noteId);
});

// 标题和内容
const title = ref("");
const content = ref("");

// 监听笔记变化
watch(
  () => props.noteId,
  (id) => {
    if (id) {
      const note = notesStore.getNote(id);
      if (note) {
        title.value = note.title;
        content.value = note.content;
      }
    } else {
      title.value = "";
      content.value = "";
    }
  },
  { immediate: true },
);

function handleClose() {
  emit("close");
}

function handleDelete() {
  if (!props.noteId) return;
  emit("delete", props.noteId);
  emit("close");
}

// 切换到编辑模式
function handleEdit() {
  if (!props.noteId) return;
  emit("edit", props.noteId);
}
</script>

<template>
  <div class="note-content">
    <!-- 头部 -->
    <header class="content-header">
      <div class="header-left">
        <button class="back-btn" @click="handleClose" title="返回列表">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="header-title">{{ title || "无标题" }}</h1>
      </div>
      <div class="header-actions">
        <button class="action-btn edit-btn" @click="handleEdit" title="编辑">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          class="action-btn delete-btn"
          @click="handleDelete"
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
    </header>

    <!-- 内容区 -->
    <div class="content-body">
      <div v-if="currentNote" class="meta-info">
        <div class="meta-item">
          <svg
            class="meta-icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="8" cy="8" r="6" />
            <path d="M8 4v4M8 8h3" />
          </svg>
          <span class="meta-text"
            >创建：{{ formatDateTime(currentNote.createdAt) }}</span
          >
        </div>
        <div class="meta-item">
          <svg
            class="meta-icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M4 4h8M12 4v8M12 8h-3" />
          </svg>
          <span class="meta-text"
            >更新：{{ formatDateTime(currentNote.updatedAt) }}</span
          >
        </div>
      </div>
      <div class="content-divider"></div>
      <div class="markdown-content">
        <MarkdownRenderer :content="content" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);
}

/* Header */
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--bg-tertiary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.back-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-primary);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--bg-tertiary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.action-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-primary);
}

.action-btn.edit-btn:hover {
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

/* Content Body */
.content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
  min-height: 0;
}

.meta-info {
  display: flex;
  gap: 24px;
  padding-bottom: 16px;
  flex-shrink: 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-icon {
  width: 14px;
  height: 14px;
  opacity: 0.6;
}

.meta-text {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  font-family:
    ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
  letter-spacing: 0.02em;
}

.content-divider {
  height: 1px;
  background: var(--border-color);
  margin-bottom: 20px;
  flex-shrink: 0;
}

.markdown-content {
  flex: 1;
  min-height: 0;
}

.markdown-content :deep(.markdown-renderer) {
  font-size: 1rem;
  line-height: 1.8;
}

.markdown-content :deep(h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.5em 0 0.75em;
  color: var(--text-primary);
}

.markdown-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.25em 0 0.6em;
  color: var(--text-primary);
}

.markdown-content :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1em 0 0.5em;
  color: var(--text-primary);
}

.markdown-content :deep(p) {
  margin: 1em 0;
  color: var(--text-secondary);
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 1em 0;
  padding-left: 1.5em;
  color: var(--text-secondary);
}

.markdown-content :deep(li) {
  margin: 0.5em 0;
}

.markdown-content :deep(code) {
  background: var(--bg-secondary);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.875em;
  font-family:
    ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
}

.markdown-content :deep(pre) {
  background: var(--bg-secondary);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid var(--accent-primary);
  padding-left: 1em;
  margin: 1em 0;
  color: var(--text-secondary);
}

.markdown-content :deep(a) {
  color: var(--accent-primary);
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid var(--border-color);
  padding: 0.5em 1em;
  text-align: left;
}

.markdown-content :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 640px) {
  .content-header {
    padding: 12px 16px;
  }

  .header-title {
    font-size: 1rem;
  }

  .content-body {
    padding: 16px;
  }

  .meta-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .markdown-content :deep(h1) {
    font-size: 1.25rem;
  }

  .markdown-content :deep(h2) {
    font-size: 1.125rem;
  }
}
</style>
