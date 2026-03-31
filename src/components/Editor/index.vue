<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useNotesStore } from "@/stores/notes";

const props = defineProps<{
  noteId: string | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "add-child", parentId: string): void;
  (e: "delete", noteId: string): void;
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

function handleAddChild() {
  if (!props.noteId) return;
  const parentId = props.noteId;
  emit("close");
  setTimeout(() => {
    emit("add-child", parentId);
  }, 100);
}

function handleDelete() {
  if (!props.noteId) return;
  emit("delete", props.noteId);
}
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
            <!-- 标题 -->
            <div class="field-group">
              <label class="field-label">{{ t("editor.titleLabel") }}</label>
              <input
                v-model="title"
                type="text"
                class="field-input"
                :placeholder="t('editor.titleLabel')"
              />
            </div>

            <!-- 内容 -->
            <div class="field-group field-flex">
              <label class="field-label">{{ t("editor.content") }}</label>
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
              <button class="action-btn add-action" @click="handleAddChild">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                <span>{{ t("toolbar.addChild") }}</span>
              </button>
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
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.editor-panel {
  width: 440px;
  max-width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--glass-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-left: 1px solid var(--glass-border);
  box-shadow:
    -20px 0 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
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
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--text-tertiary);
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
  padding: 28px;
  gap: 24px;
  overflow-y: auto;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-flex {
  flex: 1;
  min-height: 0;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
}

.field-input {
  padding: 16px 18px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.field-input::placeholder {
  color: var(--text-tertiary);
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
  min-height: 240px;
  padding: 16px 18px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 14px;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-primary);
  resize: none;
  font-family: inherit;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.field-textarea::placeholder {
  color: var(--text-tertiary);
}

.field-textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  background: var(--bg-primary);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

/* Footer */
.panel-footer {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px 28px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.secondary-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.add-action {
  background: transparent;
  border: 2px solid var(--accent-primary);
  color: var(--accent-primary);
}

.add-action:hover {
  background: var(--accent-soft);
  border-color: var(--accent-secondary);
  transform: translateY(-1px);
}

.delete-action {
  background: transparent;
  border: 2px solid var(--danger);
  color: var(--danger);
}

.delete-action:hover {
  background: var(--danger-soft);
  transform: translateY(-1px);
}

.primary-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-cancel {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.btn-cancel:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.btn-save {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
}

.btn-save svg {
  width: 20px;
  height: 20px;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.45);
}

.btn-save:active {
  transform: translateY(0);
}

/* Transitions */
.editor-enter-active,
.editor-leave-active {
  transition: opacity 0.35s ease;
}

.editor-enter-active .editor-panel,
.editor-leave-active .editor-panel {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.editor-enter-from,
.editor-leave-to {
  opacity: 0;
}

.editor-enter-from .editor-panel,
.editor-leave-to .editor-panel {
  transform: translateX(100%);
}

@media (max-width: 480px) {
  .editor-panel {
    width: 100%;
  }

  .panel-header,
  .panel-content,
  .panel-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
