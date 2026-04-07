<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useNotesStore } from "@/stores/notes";

const props = defineProps<{
  noteId: string | null;
}>();

const emit = defineEmits<{
  close: [];
  delete: [noteId: string];
}>();

const { t } = useI18n();
const notesStore = useNotesStore();

const title = ref("");
const content = ref("");
const isEditing = computed(() => props.noteId !== null);

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

function handleSave() {
  if (!props.noteId) return;
  notesStore.updateNote(props.noteId, {
    title: title.value,
    content: content.value,
  });
  emit("close");
}

function handleClose() {
  emit("close");
}

function handleDelete() {
  if (!props.noteId) return;
  emit("delete", props.noteId);
}

// 统计信息
const charCount = computed(() => content.value.length);
const wordCount = computed(() => {
  const text = content.value.trim();
  if (!text) return 0;
  return text.split(/\s+/).filter((word) => word.length > 0).length;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="editor">
      <div v-if="isEditing" class="editor-overlay" @click.self="handleClose">
        <aside class="editor-panel">
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
              <h2 class="header-title">{{ t("editor.title") }}</h2>
            </div>
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
          </header>

          <!-- 内容区 -->
          <div class="panel-content">
            <!-- 标题输入 -->
            <div class="field-group">
              <label class="field-label">{{ t("editor.titleLabel") }}</label>
              <input
                v-model="title"
                type="text"
                class="field-input"
                :placeholder="t('editor.titleLabel')"
                maxlength="100"
              />
              <div class="field-counter">{{ title.length }}/100</div>
            </div>

            <!-- 内容编辑区 -->
            <div class="field-group field-flex">
              <div class="field-header">
                <label class="field-label">{{ t("editor.content") }}</label>
                <div class="field-stats">
                  <span class="stat-item">{{ wordCount }} 字</span>
                  <span class="stat-divider">·</span>
                  <span class="stat-item">{{ charCount }} 字符</span>
                </div>
              </div>
              <textarea
                v-model="content"
                class="field-textarea"
                :placeholder="t('editor.placeholder')"
              />
            </div>
          </div>

          <!-- 底部操作 -->
          <footer class="panel-footer">
            <!-- 次要操作 -->
            <div class="secondary-actions">
              <button class="action-btn delete-action" @click="handleDelete">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                  />
                </svg>
                <span>{{ t("toolbar.delete") }}</span>
              </button>
            </div>

            <!-- 主要操作 -->
            <div class="primary-actions">
              <button class="btn-cancel" @click="handleClose">
                {{ t("editor.cancel") }}
              </button>
              <button class="btn-save" @click="handleSave">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {{ t("toolbar.save") }}
              </button>
            </div>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.editor-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease-out;
}

.editor-panel {
  width: 480px;
  max-width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-left: 1px solid var(--glass-border);
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ========================================
   HEADER
   ======================================== */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid var(--border-light);
  background: linear-gradient(180deg, var(--bg-secondary) 0%, transparent 100%);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
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

.header-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

.close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-medium);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* ========================================
   CONTENT
   ======================================== */
.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 28px;
  gap: 24px;
  overflow-y: auto;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.field-flex {
  flex: 1;
  min-height: 0;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.field-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
}

.field-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item {
  font-family:
    ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
}

.stat-divider {
  color: var(--text-muted);
}

.field-counter {
  position: absolute;
  top: -4px;
  right: 0;
  font-family:
    ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

.field-input {
  width: 100%;
  padding: 16px 20px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.field-input::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}

.field-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  background: var(--bg-primary);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.field-textarea {
  flex: 1;
  min-height: 300px;
  padding: 16px 20px;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  resize: none;
  transition: all var(--transition-base);
}

.field-textarea::placeholder {
  color: var(--text-muted);
}

.field-textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  background: var(--bg-primary);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

/* ========================================
   FOOTER
   ======================================== */
.panel-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 28px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.secondary-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  border: 2px solid;
  background: transparent;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.delete-action {
  border-color: var(--danger);
  color: var(--danger);
}

.delete-action:hover {
  background: var(--danger-soft);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.primary-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 16px 24px;
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-cancel {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
}

.btn-cancel:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-medium);
  transform: translateY(-1px);
}

.btn-save {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--accent-gradient);
  border: none;
  color: white;
  box-shadow: var(--shadow-accent);
}

.btn-save svg {
  width: 20px;
  height: 20px;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.btn-save:active {
  transform: translateY(0);
}

/* ========================================
   TRANSITIONS
   ======================================== */
.editor-enter-active,
.editor-leave-active {
  transition: opacity 0.3s ease;
}

.editor-enter-active .editor-panel,
.editor-leave-active .editor-panel {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.editor-enter-from,
.editor-leave-to {
  opacity: 0;
}

.editor-enter-from .editor-panel,
.editor-leave-to .editor-panel {
  transform: translateX(100%);
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 520px) {
  .editor-panel {
    width: 100%;
  }

  .panel-header,
  .panel-content,
  .panel-footer {
    padding-left: 20px;
    padding-right: 20px;
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
    font-size: 1.125rem;
  }

  .field-textarea {
    min-height: 240px;
  }

  .secondary-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .panel-header,
  .panel-content,
  .panel-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .btn-cancel,
  .btn-save {
    padding: 14px 20px;
    font-size: 0.875rem;
  }
}
</style>
