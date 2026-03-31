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

// 监听 noteId 变化，加载笔记内容
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

// 保存笔记
function handleSave() {
  if (!props.noteId) return;
  notesStore.updateNote(props.noteId, {
    title: title.value,
    content: content.value,
  });
  emit("close");
}

// 关闭编辑器
function handleClose() {
  emit("close");
}

// 添加子节点
function handleAddChild() {
  if (!props.noteId) return;
  emit("add-child", props.noteId);
}

// 删除节点
function handleDelete() {
  if (!props.noteId) return;
  emit("delete", props.noteId);
}
</script>

<template>
  <Transition name="slide">
    <div
      v-if="isEditing"
      class="fixed right-0 top-0 z-50 h-full w-96 bg-[var(--bg-primary)] shadow-2xl"
    >
      <!-- 头部 -->
      <div
        class="flex items-center justify-between border-b border-[var(--bg-secondary)] px-6 py-4"
      >
        <h2 class="text-lg font-semibold text-[var(--text-primary)]">
          {{ t("editor.title") }}
        </h2>
        <button
          @click="handleClose"
          class="rounded-xl p-2 text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- 内容 -->
      <div class="flex h-[calc(100%-200px)] flex-col gap-4 overflow-auto p-6">
        <!-- 标题输入 -->
        <div>
          <label
            class="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
          >
            {{ t("editor.titleLabel") }}
          </label>
          <input
            v-model="title"
            type="text"
            class="w-full rounded-xl border border-[var(--bg-secondary)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-opacity-20"
            :placeholder="t('editor.titleLabel')"
          />
        </div>

        <!-- 内容输入 -->
        <div class="flex-1">
          <label
            class="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
          >
            {{ t("editor.content") }}
          </label>
          <textarea
            v-model="content"
            class="h-full w-full resize-none rounded-xl border border-[var(--bg-secondary)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-opacity-20"
            :placeholder="t('editor.placeholder')"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div
        class="absolute bottom-0 left-0 right-0 border-t border-[var(--bg-secondary)] bg-[var(--bg-primary)] px-6 py-4"
      >
        <!-- 添加子节点 / 删除节点 -->
        <div class="mb-3 flex gap-3">
          <button
            @click="handleAddChild"
            class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--accent-color)] px-4 py-2 text-[var(--accent-color)] transition-all duration-300 hover:bg-[var(--accent-color)] hover:text-white"
          >
            <svg
              class="h-4 w-4"
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
            {{ t("toolbar.addChild") }}
          </button>
          <button
            @click="handleDelete"
            class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400 px-4 py-2 text-red-400 transition-all duration-300 hover:bg-red-400 hover:text-white"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {{ t("toolbar.delete") }}
          </button>
        </div>
        <!-- 取消 / 保存 -->
        <div class="flex gap-3">
          <button
            @click="handleClose"
            class="flex-1 rounded-xl border border-[var(--bg-secondary)] px-4 py-3 text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--bg-secondary)]"
          >
            {{ t("editor.cancel") }}
          </button>
          <button
            @click="handleSave"
            class="flex-1 rounded-xl bg-[var(--accent-color)] px-4 py-3 font-medium text-white transition-all duration-300 hover:opacity-90"
          >
            {{ t("toolbar.save") }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
