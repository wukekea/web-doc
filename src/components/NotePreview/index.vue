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
  edit: [id: string]; // 编辑事件传递给 App
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
  <Teleport to="body">
    <Transition name="preview">
      <div v-if="noteId" class="preview-overlay" @click.self="handleClose">
        <div class="preview-panel">
          <!-- 头部 -->
          <header class="panel-header">
            <div class="header-left">
              <div class="header-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
              </div>
              <h2 class="header-title">{{ title || "无标题" }}</h2>
            </div>
            <div class="header-right">
              <button class="header-btn" @click="handleEdit" title="编辑">
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
                class="header-btn delete-btn"
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
              <button class="close-btn" @click="handleClose">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          <!-- 内容区 -->
          <div class="panel-content">
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
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.preview-panel {
  width: 90%;
  max-width: 900px;
  max-height: 85vh;
  background: var(--glass-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow:
    -20px 0 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(180deg, var(--bg-secondary) 0%, transparent 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 14px;
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.header-icon svg {
  width: 22px;
  height: 22px;
}

.header-title {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin: 0;
}

.header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.header-btn {
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

.header-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-primary);
}

.header-btn.delete-btn:hover {
  background: var(--danger-soft);
  color: var(--danger);
}

.header-btn svg {
  width: 16px;
  height: 16px;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--bg-tertiary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* Content */
.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
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
  font-size: 1.25rem;
  margin: 1.5em 0 0.75em;
}

.markdown-content :deep(h2) {
  font-size: 1.15rem;
  margin: 1.25em 0 0.6em;
}

.markdown-content :deep(h3) {
  font-size: 1.125rem;
  margin: 1em 0 0.5em;
}

.markdown-content :deep(p) {
  margin: 1em 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 1em 0;
}

/* Transitions */
.preview-enter-active,
.preview-leave-active {
  transition: opacity 0.3s ease;
}

.preview-enter-from,
.preview-leave-to {
  opacity: 0;
}

.preview-enter-active .preview-panel,
.preview-leave-active .preview-panel {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.preview-enter-from .preview-panel,
.preview-leave-to .preview-panel {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 640px) {
  .preview-panel {
    width: 95%;
    max-height: 90vh;
    border-radius: 16px;
  }

  .panel-header {
    padding: 16px 20px;
  }

  .panel-content {
    padding: 20px;
  }

  .header-title {
    font-size: 1.125rem;
  }

  .meta-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>
