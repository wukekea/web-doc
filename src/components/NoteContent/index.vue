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

// 格式化时间显示
function formatTime(timestamp: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 格式化完整日期时间
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
    <!-- 背景光效 -->
    <div class="content-glow content-glow-1"></div>
    <div class="content-glow content-glow-2"></div>

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
        <div class="header-text">
          <h1 class="header-title">{{ title || "无标题" }}</h1>
          <p v-if="currentNote" class="header-time">
            {{ formatDateTime(currentNote.createdAt) }} ·
            {{ formatTime(currentNote.updatedAt) }}
          </p>
        </div>
      </div>
      <div class="header-right">
        <div class="header-divider"></div>
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
      <!-- Markdown 内容 -->
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
  background: transparent;
  animation: slideInRight 0.3s ease-out;
  position: relative;
  overflow: hidden;
}

/* 内容背景光效 */
.content-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
  animation: glow-float 25s ease-in-out infinite;
}

.content-glow-1 {
  width: 400px;
  height: 400px;
  background: var(--accent-gradient-cool);
  top: -10%;
  right: -15%;
  animation-delay: 0s;
}

.content-glow-2 {
  width: 350px;
  height: 350px;
  background: var(--accent-gradient-warm);
  bottom: -10%;
  left: -15%;
  animation-delay: -8s;
}

.dark .content-glow {
  opacity: 0.06;
}

@keyframes glow-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -20px) scale(1.1);
  }
  50% {
    transform: translate(-15px, 30px) scale(0.95);
  }
  75% {
    transform: translate(-25px, -15px) scale(1.05);
  }
}

/* ========================================
   HEADER
   ======================================== */
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  border-radius: var(--radius-xl);
  margin: 0px 32px 16px 32px;
  box-shadow: var(--shadow-md);
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-width: 0;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-light);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.back-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-primary);
  border-color: var(--accent-primary);
  transform: translateX(-2px);
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.header-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-time {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--text-tertiary);
  opacity: 0.7;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-divider {
  width: 1px;
  height: 24px;
  background: var(--border-light);
}

.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-light);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--text-secondary);
}

.action-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-primary);
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}

.action-btn.delete-btn:hover {
  background: var(--danger-soft);
  color: var(--danger);
  border-color: var(--danger);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

/* ========================================
   CONTENT BODY
   ======================================== */
.content-body {
  display: flex;
  flex-direction: column;
  padding: 0 32px;
  overflow-y: auto;
  animation: slideUp 0.4s ease-out 0.1s backwards;
  position: relative;
  z-index: 1;
}

/* 滚动条样式 */
.content-body::-webkit-scrollbar {
  width: 6px;
}

.content-body::-webkit-scrollbar-track {
  background: transparent;
}

.content-body::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: 3px;
  transition: background var(--transition-fast);
}

.content-body::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

/* ========================================
   MARKDOWN CONTENT
   ======================================== */
.markdown-content {
  padding: 20px 24px;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  animation: fadeIn 0.5s ease-out 0.2s backwards;
  box-shadow: var(--shadow-md);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* 滚动条样式 */
.markdown-content::-webkit-scrollbar {
  width: 6px;
}

.markdown-content::-webkit-scrollbar-track {
  background: transparent;
}

.markdown-content::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: 3px;
  transition: background var(--transition-fast);
}

.markdown-content::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

.markdown-content :deep(.markdown-renderer) {
  font-size: 1.0625rem;
  line-height: 1.85;
  color: var(--text-primary);
}

.markdown-content :deep(h1) {
  font-family: var(--font-display);
  font-size: 1.875rem;
  font-weight: 700;
  margin: 2em 0 1em;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.markdown-content :deep(h2) {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.75em 0 0.875em;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.markdown-content :deep(h3) {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5em 0 0.75em;
  color: var(--text-primary);
  letter-spacing: -0.015em;
}

.markdown-content :deep(p) {
  margin: 1.25em 0;
  color: var(--text-secondary);
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 1.25em 0;
  padding-left: 1.75em;
  color: var(--text-secondary);
}

.markdown-content :deep(li) {
  margin: 0.625em 0;
  line-height: 1.8;
}

.markdown-content :deep(code) {
  font-family:
    ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
  background: var(--bg-tertiary);
  padding: 0.2em 0.5em;
  border-radius: 4px;
  font-size: 0.875em;
  color: var(--accent-primary);
  border: 1px solid var(--border-light);
}

.markdown-content :deep(pre) {
  background: var(--bg-secondary);
  padding: 1.25em;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 1.5em 0;
  border: 1px solid var(--border-light);
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
  color: var(--text-primary);
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid var(--accent-primary);
  padding-left: 1.25em;
  margin: 1.5em 0;
  color: var(--text-secondary);
  font-style: italic;
  background: var(--bg-hover);
  padding: 1em 1.25em;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.markdown-content :deep(a) {
  color: var(--accent-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all var(--transition-fast);
}

.markdown-content :deep(a:hover) {
  color: var(--accent-secondary);
  border-bottom-color: var(--accent-secondary);
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.875em 1em;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}

.markdown-content :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-display);
}

.markdown-content :deep(tr:last-child td) {
  border-bottom: none;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  margin: 1.5em 0;
  box-shadow: var(--shadow-md);
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 768px) {
  .content-header {
    padding: 16px 20px;
    margin: 0 0 12px 0;
  }

  .back-btn {
    width: 36px;
    height: 36px;
  }

  .header-title {
    font-size: 1.125rem;
  }

  .content-body {
    padding: 0 20px 20px;
  }

  .markdown-content {
    padding: 16px 18px;
    max-height: calc(100vh - 180px);
  }

  .markdown-content :deep(.markdown-renderer) {
    font-size: 1rem;
  }

  .markdown-content :deep(h1) {
    font-size: 1.5rem;
  }

  .markdown-content :deep(h2) {
    font-size: 1.25rem;
  }

  .markdown-content :deep(h3) {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .content-header {
    padding: 14px 16px;
  }

  .back-btn {
    width: 32px;
    height: 32px;
  }

  .back-btn svg {
    width: 18px;
    height: 18px;
  }

  .header-title {
    font-size: 1rem;
  }

  .content-body {
    padding: 0 16px 16px;
  }

  .markdown-content {
    padding: 14px 16px;
    max-height: calc(100vh - 150px);
  }

  .action-btn {
    width: 36px;
    height: 36px;
  }

  .action-btn svg {
    width: 16px;
    height: 16px;
  }
}
</style>
