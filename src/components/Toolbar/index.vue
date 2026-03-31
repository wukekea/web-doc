<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";
import ThemeSwitch from "@/components/ThemeSwitch/index.vue";

const { locale, t } = useI18n();
const appStore = useAppStore();

function toggleLocale() {
  const newLocale = locale.value === "zh-CN" ? "en-US" : "zh-CN";
  locale.value = newLocale;
  appStore.setLocale(newLocale);
}
</script>

<template>
  <header
    class="flex items-center justify-between bg-[var(--bg-secondary)] px-6 py-4 shadow-md"
  >
    <h1 class="text-xl font-semibold text-[var(--text-primary)]">
      {{ t("app.title") }}
    </h1>
    <div class="flex items-center gap-4">
      <button
        @click="toggleLocale"
        class="rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--bg-primary)] hover:text-[var(--accent-color)]"
      >
        {{ locale === "zh-CN" ? t("language.en") : t("language.zh") }}
      </button>
      <ThemeSwitch />
    </div>
  </header>
</template>
