<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";
import Toolbar from "@/components/Toolbar/index.vue";

const { locale } = useI18n();
const appStore = useAppStore();

onMounted(async () => {
  await appStore.init();
  locale.value = appStore.locale;
});
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
    <Toolbar />
    <main class="p-6">
      <div class="rounded-xl bg-[var(--bg-secondary)] p-6 shadow-lg">
        <p class="text-center text-[var(--text-secondary)]">
          思维导图区域（待实现）
        </p>
      </div>
    </main>
  </div>
</template>
