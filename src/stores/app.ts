import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { AppConfig } from "@/types";
import { storage } from "@/utils/storage";

const STORAGE_KEY = "app-config";

export const useAppStore = defineStore("app", () => {
  const locale = ref<string>("zh-CN");
  const theme = ref<"light" | "dark">("light");

  // 初始化：从存储加载配置
  async function init() {
    const config = await storage.get<AppConfig>(STORAGE_KEY);
    if (config) {
      locale.value = config.locale;
      theme.value = config.theme;
    }
    applyTheme();
  }

  // 应用主题
  function applyTheme() {
    if (theme.value === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // 切换主题
  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
    applyTheme();
  }

  // 切换语言
  function setLocale(newLocale: string) {
    locale.value = newLocale;
  }

  // 监听配置变化，自动保存
  watch([locale, theme], async () => {
    await storage.set(STORAGE_KEY, {
      locale: locale.value,
      theme: theme.value,
    });
  });

  return {
    locale,
    theme,
    init,
    toggleTheme,
    setLocale,
  };
});
