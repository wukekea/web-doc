<script setup lang="ts">
import { computed } from "vue";
import { useNotesStore } from "@/stores/notes";
import MarkdownRenderer from "@/components/MarkdownRenderer/index.vue";
import type { NoteNode } from "@/types";

const props = defineProps<{
  note: NoteNode;
  level: number;
  expandedIds: Set<string>;
}>();

const emit = defineEmits<{
  toggle: [id: string];
  edit: [id: string];
  addChild: [parentId: string];
  delete: [id: string];
}>();

const notesStore = useNotesStore();

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

// 判断是否展开
const isExpanded = computed(() => props.expandedIds.has(props.note.id));

// 子节点
const children = computed(() => notesStore.getChildren(props.note.id));
const hasChildren = computed(() => children.value.length > 0);
</script>

<template>
  <div class="note-item" :style="`--level: ${level}`">
    <!-- 笔记卡片 -->
    <div
      class="note-card"
      @click="emit('toggle', note.id)"
      @dblclick="emit('edit', note.id)"
    >
      <!-- 左侧展开按钮 -->
      <div class="note-indent">
        <button
          v-if="hasChildren"
          class="expand-btn"
          @click.stop="emit('toggle', note.id)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            :class="['icon', isExpanded ? 'icon-expanded' : '']"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <!-- 笔记内容 -->
      <div class="note-content">
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
              class="action-btn"
              @click.stop="emit('addChild', note.id)"
              title="添加子节点"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v8M6 10h8" />
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
          <span v-if="hasChildren" class="meta-children"
            >{{ children.length }} 个子节点</span
          >
        </div>
      </div>
    </div>

    <!-- 子节点 -->
    <div v-if="hasChildren && isExpanded" class="note-children">
      <NoteListItem
        v-for="child in children"
        :key="child.id"
        :note="child"
        :level="level + 1"
        :expanded-ids="expandedIds"
        @toggle="(id) => emit('toggle', id)"
        @edit="(id) => emit('edit', id)"
        @add-child="(id) => emit('addChild', id)"
        @delete="(id) => emit('delete', id)"
      />
    </div>
  </div>
</template>

<style scoped>
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

/* 响应式 */
@media (max-width: 640px) {
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
