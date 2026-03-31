<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";
import { useNotesStore } from "@/stores/notes";
import Toolbar from "@/components/Toolbar/index.vue";
import NoteList from "@/components/NoteList/index.vue";
import Editor from "@/components/Editor/index.vue";

const { locale, t } = useI18n();
const appStore = useAppStore();
const notesStore = useNotesStore();

const editingNoteId = ref<string | null>(null);
const noteListRef = ref<InstanceType<typeof NoteList> | null>(null);

onMounted(async () => {
  await appStore.init();
  locale.value = appStore.locale;
  await notesStore.init();
});

function handleEdit(noteId: string) {
  editingNoteId.value = noteId;
}

function handleCloseEditor() {
  editingNoteId.value = null;
}

function handleNewNote() {
  notesStore.createNote(t("toolbar.newNote"));
}

function handleDelete(noteId: string) {
  notesStore.deleteNote(noteId);
  editingNoteId.value = null;
}
</script>

<template>
  <div class="app-shell">
    <!-- 工具栏 -->
    <Toolbar />

    <!-- 主内容 -->
    <main class="main-area">
      <!-- 装饰背景 -->
      <div class="ambient-bg">
        <div class="ambient-blob blob-1"></div>
        <div class="ambient-blob blob-2"></div>
        <div class="ambient-blob blob-3"></div>
      </div>

      <!-- 笔记列表容器 -->
      <div class="content-wrapper">
        <NoteList ref="noteListRef" @edit="handleEdit" @delete="handleDelete" />
      </div>

      <!-- 新建按钮 -->
      <button class="fab" @click="handleNewNote" :title="t('toolbar.newNote')">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </main>

    <!-- 编辑器 -->
    <Editor
      :note-id="editingNoteId"
      @close="handleCloseEditor"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

.main-area {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Ambient Background */
.ambient-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.ambient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.12;
  animation: float 20s ease-in-out infinite;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  top: -15%;
  right: -5%;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  bottom: -10%;
  left: -5%;
  animation-delay: -7s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);
  top: 40%;
  left: 30%;
  animation-delay: -14s;
}

.dark .ambient-blob {
  opacity: 0.06;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.05);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

/* Content Wrapper */
.content-wrapper {
  position: relative;
  z-index: 1;
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

@media (max-width: 640px) {
  .content-wrapper {
    padding: 12px 0;
  }

  .fab {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 18px;
  }
}

/* FAB */
.fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 100;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  cursor: pointer;
  box-shadow:
    0 8px 32px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab svg {
  width: 28px;
  height: 28px;
}

.fab:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 12px 40px rgba(59, 130, 246, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

.fab:active {
  transform: translateY(-2px) scale(1.02);
}
</style>
