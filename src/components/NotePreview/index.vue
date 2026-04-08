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
  <Teleport to="body">
    <Transition name="preview">
      <div v-if="noteId" class="preview-overlay" @click.self="handleClose">
        <!-- 背景光效 -->
        <div class="preview-glow preview-glow-1"></div>
        <div class="preview-glow preview-glow-2"></div>
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
              <div class="header-text">
                <h2 class="header-title">{{ title || "无标题" }}</h2>
                <p v-if="currentNote" class="header-time">
                  {{ formatDateTime(currentNote.createdAt) }} ·
                  {{ formatTime(currentNote.updatedAt) }}
                </p>
              </div>
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
            <!-- Markdown 内容 -->
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
  background: var(--bg-primary);
  animation: fadeIn 0.2s ease-out;
  overflow: hidden;
}

.preview-panel {
  width: 92%;
  max-width: 960px;
  max-height: 88vh;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 1;
}

.preview-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
  animation: glow-float 25s ease-in-out infinite;
}

.preview-glow-1 {
  width: 600px;
  height: 600px;
  background: var(--accent-gradient-cool);
  top: -20%;
  right: -10%;
  animation-delay: 0s;
}

.preview-glow-2 {
  width: 500px;
  height: 500px;
  background: var(--accent-gradient-warm);
  bottom: -15%;
  left: -10%;
  animation-delay: -8s;
}

.dark .preview-glow {
  opacity: 0.08;
}

@keyframes glow-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(40px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 40px) scale(0.95);
  }
  75% {
    transform: translate(-30px, -20px) scale(1.05);
  }
}

/* ========================================
   HEADER
   ======================================== */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-width: 0;
}

.header-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-gradient);
  border-radius: var(--radius-lg);
  color: white;
  box-shadow: var(--shadow-accent);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.header-icon::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.header-icon svg {
  width: 24px;
  height: 24px;
  position: relative;
  z-index: 1;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.header-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
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
  gap: 8px;
  align-items: center;
}

.header-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-light);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--text-secondary);
}

.header-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-primary);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.header-btn.delete-btn:hover {
  background: var(--danger-soft);
  color: var(--danger);
  border-color: var(--danger);
}

.header-btn svg {
  width: 18px;
  height: 18px;
}

.close-btn {
  width: 44px;
  height: 44px;
  border: 1px solid var(--border-light);
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--text-tertiary);
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-medium);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 22px;
  height: 22px;
}

/* ========================================
   CONTENT
   ======================================== */
.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 28px;
  overflow-y: auto;
  min-height: 0;
  position: relative;
  z-index: 1;
}

/* ========================================
   MARKDOWN CONTENT
   ======================================== */
.markdown-content {
  flex: 1;
  min-height: 0;
  animation: fadeIn 0.4s ease-out 0.1s backwards;
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
   TRANSITIONS
   ======================================== */
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
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.preview-enter-from .preview-panel,
.preview-leave-to .preview-panel {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 768px) {
  .preview-panel {
    width: 95%;
    max-height: 90vh;
    border-radius: var(--radius-xl);
  }

  .panel-header {
    padding: 16px 20px;
  }

  .panel-content {
    padding: 20px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .header-icon svg {
    width: 20px;
    height: 20px;
  }

  .header-title {
    font-size: 1.25rem;
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
  .preview-panel {
    width: 98%;
    border-radius: var(--radius-lg);
  }

  .panel-header {
    padding: 14px 16px;
  }

  .panel-content {
    padding: 16px;
  }

  .header-btn {
    width: 36px;
    height: 36px;
  }

  .header-btn svg {
    width: 16px;
    height: 16px;
  }

  .close-btn {
    width: 40px;
    height: 40px;
  }

  .close-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>
