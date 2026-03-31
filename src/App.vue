<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";
import { useNotesStore } from "@/stores/notes";
import Toolbar from "@/components/Toolbar/index.vue";
import MindMap from "@/components/MindMap/index.vue";
import Editor from "@/components/Editor/index.vue";

const { locale, t } = useI18n();
const appStore = useAppStore();
const notesStore = useNotesStore();

const editingNoteId = ref<string | null>(null);
const mindMapRef = ref<InstanceType<typeof MindMap> | null>(null);

onMounted(async () => {
  await appStore.init();
  locale.value = appStore.locale;
});

// 打开编辑器
function handleEdit(noteId: string) {
  editingNoteId.value = noteId;
}

// 关闭编辑器
function handleCloseEditor() {
  editingNoteId.value = null;
}

// 新建根节点
function handleNewNote() {
  notesStore.createNote(t("toolbar.newNote"));
  nextTick(() => {
    mindMapRef.value?.refresh();
  });
}

// 添加子节点
function handleAddChild(parentId: string) {
  notesStore.createNote(t("toolbar.newNote"), parentId);
  nextTick(() => {
    mindMapRef.value?.refresh();
  });
}

// 删除节点
function handleDelete(noteId: string) {
  notesStore.deleteNote(noteId);
  editingNoteId.value = null;
  nextTick(() => {
    mindMapRef.value?.refresh();
  });
}
</script>

<template>
  <div
    class="flex h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]"
  >
    <!-- 顶部工具栏 -->
    <Toolbar />

    <!-- 主内容区域 -->
    <main class="relative flex-1 overflow-hidden">
      <!-- 思维导图 -->
      <div class="h-full p-6">
        <MindMap ref="mindMapRef" @edit="handleEdit" />
      </div>

      <!-- 浮动新建按钮 -->
      <button
        @click="handleNewNote"
        class="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-color)] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        :title="t('toolbar.newNote')"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      <!-- 遮罩层 -->
      <Transition name="fade">
        <div
          v-if="editingNoteId"
          class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          @click="handleCloseEditor"
        />
      </Transition>
    </main>

    <!-- 编辑器侧边栏 -->
    <Editor
      :note-id="editingNoteId"
      @close="handleCloseEditor"
      @add-child="handleAddChild"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
