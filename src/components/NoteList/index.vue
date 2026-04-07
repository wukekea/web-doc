<script setup lang="ts">
import { computed } from "vue";
import { useNotesStore } from "@/stores/notes";

const notesStore = useNotesStore();

defineProps<{
  activeNoteId: string | null;
}>();

const emit = defineEmits<{
  edit: [id: string];
  preview: [id: string];
  delete: [id: string];
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

  // 超过7天显示具体日期
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

// 所有笔记（按更新时间降序）
const allNotes = computed(() => notesStore.getAllNotes());

// 统计笔记数量
const notesCount = computed(() => allNotes.value.length);

// 获取笔记内容预览（纯文本）
function getPreviewText(content: string): string {
  return content
    .replace(/#{1,6}\s+/g, "") // 移除标题标记
    .replace(/\*\*/g, "") // 移除粗体标记
    .replace(/\*/g, "") // 移除斜体标记
    .replace(/`/g, "") // 移除代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 移除链接
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // 移除图片
    .replace(/\n+/g, " ") // 替换换行为空格
    .trim()
    .substring(0, 120); // 限制长度
}
</script>

<template>
  <div class="note-list">
    <!-- 头部统计 -->
    <div class="list-header">
      <h2 class="header-title">我的笔记</h2>
      <span class="header-count">{{ notesCount }} 篇</span>
    </div>

    <!-- 空状态 -->
    <div v-if="allNotes.length === 0" class="empty-state">
      <div class="empty-illustration">
        <svg viewBox="0 0 120 120" fill="none" class="empty-svg">
          <defs>
            <linearGradient
              id="emptyGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stop-color="var(--accent-primary)" />
              <stop offset="100%" stop-color="var(--accent-secondary)" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="url(#emptyGradient)"
            stroke-width="2"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M45 60h30M60 45v30"
            stroke="var(--accent-primary)"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <circle
            cx="60"
            cy="60"
            r="4"
            fill="var(--accent-primary)"
            opacity="0.2"
          />
        </svg>
      </div>
      <p class="empty-text">还没有笔记</p>
      <p class="empty-hint">点击右下角的按钮创建你的第一篇笔记</p>
    </div>

    <!-- 笔记卡片列表 -->
    <div v-else class="note-cards">
      <div
        v-for="(note, index) in allNotes"
        :key="note.id"
        class="note-card"
        :class="{ 'is-active': activeNoteId === note.id }"
        :style="{ animationDelay: `${index * 50}ms` }"
        @click="emit('preview', note.id)"
      >
        <!-- 卡片顶部 -->
        <div class="card-header">
          <div class="card-title-group">
            <span class="card-dot"></span>
            <h3 class="card-title">{{ note.title || "无标题" }}</h3>
          </div>
          <div class="card-actions">
            <button
              class="action-btn edit-btn"
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
        <div v-if="note.content" class="card-preview">
          <p class="preview-text">{{ getPreviewText(note.content) }}</p>
          <span class="preview-gradient"></span>
        </div>

        <!-- 卡片底部 -->
        <div class="card-footer">
          <div class="footer-meta">
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
            <span class="meta-text">{{ formatTime(note.updatedAt) }}</span>
          </div>
          <div class="footer-divider"></div>
          <span class="footer-date">{{ formatDateTime(note.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  animation: slideUp 0.5s ease-out;
}

/* ========================================
   LIST HEADER
   ======================================== */
.list-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding: 0 4px;
}

.header-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin: 0;
}

.header-count {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-tertiary);
  padding: 4px 12px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
}

/* ========================================
   NOTE CARDS
   ======================================== */
.note-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.note-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 0;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  min-height: 200px;
  max-height: 200px;
  overflow: hidden;
  position: relative;
  animation: slideUp 0.4s ease-out backwards;
}

.note-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-gradient);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.note-card:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.note-card:hover::before {
  opacity: 1;
}

.note-card.is-active {
  border-color: var(--accent-primary);
  background: var(--bg-hover);
}

.note-card.is-active::before {
  opacity: 1;
}

/* ========================================
   CARD HEADER
   ======================================== */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  background: var(--bg-secondary);
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-light);
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.card-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-primary);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.note-card:hover .card-dot {
  transform: scale(1.5);
}

.card-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(4px);
  transition: all var(--transition-base);
}

.note-card:hover .card-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-tertiary);
}

.action-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-primary);
  transform: scale(1.1);
}

.action-btn.delete-btn:hover {
  background: var(--danger-soft);
  color: var(--danger);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* ========================================
   CARD PREVIEW
   ======================================== */
.card-preview {
  flex: 1;
  overflow: hidden;
  padding: 16px 20px;
  position: relative;
  min-height: 0;
}

.preview-text {
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
  position: relative;
  z-index: 1;
}

.preview-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 30%,
    var(--bg-primary) 100%
  );
  pointer-events: none;
}

.dark .preview-gradient {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 30%,
    var(--bg-primary) 100%
  );
}

/* ========================================
   CARD FOOTER
   ======================================== */
.card-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px 16px;
  background: var(--bg-primary);
  flex-shrink: 0;
  border-top: 1px solid var(--border-light);
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  width: 12px;
  height: 12px;
  opacity: 0.5;
}

.meta-text {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary);
}

.footer-divider {
  width: 1px;
  height: 12px;
  background: var(--border-light);
}

.footer-date {
  font-family:
    ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

/* ========================================
   EMPTY STATE
   ======================================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  animation: slideUp 0.5s ease-out;
}

.empty-illustration {
  position: relative;
  margin-bottom: 24px;
}

.empty-svg {
  width: 120px;
  height: 120px;
  animation: float 6s ease-in-out infinite;
}

.empty-text {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.empty-hint {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  margin: 0;
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 768px) {
  .note-list {
    padding: 24px 20px;
  }

  .list-header {
    margin-bottom: 24px;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .note-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .note-card {
    min-height: 180px;
    max-height: 180px;
  }

  .card-actions {
    opacity: 1;
    transform: translateX(0);
  }

  .empty-svg {
    width: 100px;
    height: 100px;
  }

  .empty-text {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .note-list {
    padding: 20px 12px;
  }

  .list-header {
    gap: 12px;
  }

  .header-title {
    font-size: 1.25rem;
  }

  .card-header {
    padding: 14px 16px;
  }

  .card-preview {
    padding: 14px 16px;
  }

  .card-footer {
    padding: 10px 16px 14px;
  }
}
</style>
