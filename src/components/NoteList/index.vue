<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useNotesStore } from "@/stores/notes";
import MarkdownRenderer from "@/components/MarkdownRenderer/index.vue";

const notesStore = useNotesStore();
const { t } = useI18n();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

// 格式化时间
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return "今天";
  } else if (days === 1) {
    return "昨天";
  } else if (days < 7) {
    return `${days} 天前`;
  } else {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
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
      <p class="empty-text">{{ t("noteList.empty") }}</p>
    </div>
    <div v-else class="note-cards">
      <div
        v-for="note in allNotes"
        :key="note.id"
        class="note-card"
        @dblclick="emit('edit', note.id)"
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
          <span class="meta-date">{{ formatDate(note.updatedAt) }}</span>
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.note-card {
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
  flex: 1;
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

  .note-title {
    font-size: 1rem;
  }
}
</style>
