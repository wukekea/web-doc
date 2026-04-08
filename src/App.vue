<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";
import { useNotesStore } from "@/stores/notes";
import Toolbar from "@/components/Toolbar/index.vue";
import NoteList from "@/components/NoteList/index.vue";
import Editor from "@/components/Editor/index.vue";
import NoteContent from "@/components/NoteContent/index.vue";

const { locale, t } = useI18n();
const appStore = useAppStore();
const notesStore = useNotesStore();

const editingNoteId = ref<string | null>(null);
const previewNoteId = ref<string | null>(null);
const noteListRef = ref<InstanceType<typeof NoteList> | null>(null);
const isLoaded = ref(false);

onMounted(async () => {
  await appStore.init();
  locale.value = appStore.locale;
  await notesStore.init();
  // 初始加载动画
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

function handleEdit(noteId: string) {
  editingNoteId.value = noteId;
}

function handlePreview(noteId: string) {
  previewNoteId.value = noteId;
}

function handleCloseEditor() {
  editingNoteId.value = null;
}

function handleClosePreview() {
  previewNoteId.value = null;
}

function handleNewNote() {
  notesStore.createNote(t("toolbar.newNote"));
}

function handleDelete(noteId: string) {
  notesStore.deleteNote(noteId);
  editingNoteId.value = null;
  previewNoteId.value = null;
}

// 当前选中的笔记 ID
const activeNoteId = computed(() => previewNoteId.value);
</script>

<template>
  <div class="app-shell" :class="{ 'is-loaded': isLoaded }">
    <!-- 工具栏 -->
    <Toolbar />

    <!-- 主内容 -->
    <main class="main-area">
      <!-- 笔记列表容器 -->
      <div class="content-wrapper" :class="{ 'has-preview': previewNoteId }">
        <NoteList
          ref="noteListRef"
          :active-note-id="activeNoteId"
          @edit="handleEdit"
          @preview="handlePreview"
          @delete="handleDelete"
        />
      </div>

      <!-- 装饰背景 - 升级版 -->
      <div class="ambient-bg">
        <!-- 主光晕 -->
        <div class="ambient-glow glow-primary"></div>
        <div class="ambient-glow glow-secondary"></div>
        <div class="ambient-glow glow-tertiary"></div>
        <!-- 网格纹理 -->
        <div class="grid-pattern"></div>
        <!-- 噪点纹理 -->
        <div class="noise-overlay"></div>
      </div>

      <!-- 笔记内容展示区 -->
      <Transition name="slide-panel">
        <div v-if="previewNoteId" class="content-panel">
          <div class="content-panel-inner">
            <NoteContent
              :note-id="previewNoteId"
              @close="handleClosePreview"
              @delete="handleDelete"
              @edit="handleEdit"
            />
          </div>
        </div>
      </Transition>

      <!-- 新建按钮 - 升级版 -->
      <button class="fab" @click="handleNewNote" :title="t('toolbar.newNote')">
        <span class="fab-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span class="fab-pulse"></span>
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
  opacity: 0;
  transition: opacity var(--transition-slow);
}

.app-shell.is-loaded {
  opacity: 1;
}

.main-area {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

/* ========================================
   AMBIENT BACKGROUND - 升级版
   ======================================== */
.ambient-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* 光晕效果 */
.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  animation: glow-float 25s ease-in-out infinite;
}

.glow-primary {
  width: 600px;
  height: 600px;
  background: var(--accent-gradient-cool);
  top: -20%;
  right: -10%;
  animation-delay: 0s;
}

.glow-secondary {
  width: 500px;
  height: 500px;
  background: var(--accent-gradient-warm);
  bottom: -15%;
  left: -10%;
  animation-delay: -8s;
}

.glow-tertiary {
  width: 350px;
  height: 350px;
  background: var(--accent-gradient);
  top: 50%;
  left: 40%;
  transform: translate(-50%, -50%);
  animation-delay: -16s;
}

.dark .ambient-glow {
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

/* 网格纹理 */
.grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border-light) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-light) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.4;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(
    ellipse at center,
    black 0%,
    transparent 70%
  );
}

/* 噪点纹理 */
.noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* ========================================
   CONTENT WRAPPER
   ======================================== */
.content-wrapper {
  position: relative;
  z-index: 2;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all var(--transition-base);
}

.content-wrapper.has-preview {
  display: none;
}

/* ========================================
   CONTENT PANEL
   ======================================== */
.content-panel {
  position: relative;
  z-index: 1;
  flex: 1;
  overflow: hidden;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.content-panel-inner {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ========================================
   SLIDE PANEL TRANSITION
   ======================================== */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: all var(--transition-slow);
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ========================================
   FAB - 升级版
   ======================================== */
.fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 100;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--accent-gradient);
  color: white;
  cursor: pointer;
  border-radius: 24px;
  box-shadow:
    var(--shadow-accent),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all var(--transition-slow);
  overflow: hidden;
}

.fab-icon {
  position: relative;
  z-index: 2;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-base);
}

.fab-icon svg {
  width: 100%;
  height: 100%;
}

.fab-pulse {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: var(--accent-gradient);
  opacity: 0;
  z-index: 1;
}

.fab:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow:
    0 16px 48px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

.fab:hover .fab-icon {
  transform: rotate(90deg);
}

.fab:active {
  transform: translateY(-3px) scale(1.02);
}

.fab:hover .fab-pulse {
  animation: fab-pulse 1.5s ease-out infinite;
}

@keyframes fab-pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 640px) {
  .content-wrapper {
    width: 100%;
  }

  .content-wrapper.has-preview {
    display: none;
  }

  .content-panel {
    position: fixed;
    inset: 0;
    z-index: 200;
    top: 64px;
  }

  .content-panel-inner {
    max-width: 100%;
  }

  .fab {
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 20px;
  }

  .fab-icon {
    width: 26px;
    height: 26px;
  }

  .ambient-glow {
    filter: blur(80px);
  }

  .glow-primary {
    width: 400px;
    height: 400px;
  }

  .glow-secondary {
    width: 350px;
    height: 350px;
  }

  .glow-tertiary {
    width: 250px;
    height: 250px;
  }

  .grid-pattern {
    background-size: 40px 40px;
  }
}
</style>
