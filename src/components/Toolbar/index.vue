<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";

const { locale, t } = useI18n();
const appStore = useAppStore();

function toggleLocale() {
  const newLocale = locale.value === "zh-CN" ? "en-US" : "zh-CN";
  locale.value = newLocale;
  appStore.setLocale(newLocale);
}
</script>

<template>
  <header class="toolbar">
    <!-- 左侧：品牌标识 -->
    <div class="toolbar-brand">
      <div class="brand-logo">
        <svg viewBox="0 0 32 32" fill="none">
          <rect
            x="2"
            y="2"
            width="28"
            height="28"
            rx="8"
            fill="url(#brandGradient)"
          />
          <path
            d="M10 16L14 20L22 12"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <defs>
            <linearGradient
              id="brandGradient"
              x1="2"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#3b82f6" />
              <stop offset="1" stop-color="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 class="brand-title">{{ t("app.title") }}</h1>
    </div>

    <!-- 右侧：操作按钮组 -->
    <div class="toolbar-actions">
      <!-- 语言切换 -->
      <button
        class="action-btn language-btn"
        @click="toggleLocale"
        :title="locale === 'zh-CN' ? 'Switch to English' : '切换到中文'"
      >
        <svg
          class="btn-icon"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="10" cy="10" r="8" />
          <path
            d="M2 10h16M10 2c2.5 2.5 4 5 4 8s-1.5 5.5-4 8c-2.5-2.5-4-5-4-8s1.5-5.5 4-8z"
          />
        </svg>
        <span class="btn-label">{{ locale === "zh-CN" ? "EN" : "中" }}</span>
      </button>

      <!-- 主题切换 - 核心亮点 -->
      <button
        class="theme-toggle"
        :class="{ 'is-dark': appStore.theme === 'dark' }"
        @click="appStore.toggleTheme()"
        :title="appStore.theme === 'light' ? t('theme.dark') : t('theme.light')"
      >
        <div class="toggle-track">
          <div class="toggle-icons">
            <!-- 太阳图标 -->
            <span class="icon-sun">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                />
              </svg>
            </span>
            <!-- 月亮图标 -->
            <span class="icon-moon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
          </div>
          <div class="toggle-thumb"></div>
        </div>
        <span class="toggle-label">{{
          appStore.theme === "light" ? t("theme.dark") : t("theme.light")
        }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: relative;
  z-index: 100;
}

.toolbar::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--accent-primary) 50%,
    transparent 100%
  );
  opacity: 0.2;
}

/* Brand */
.toolbar-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 4px 12px rgba(59, 130, 246, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.brand-logo:hover {
  transform: scale(1.05);
  box-shadow:
    0 6px 20px rgba(59, 130, 246, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

.brand-logo svg {
  width: 100%;
  height: 100%;
}

.brand-title {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(
    135deg,
    var(--text-primary) 0%,
    var(--accent-primary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Actions */
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--text-tertiary);
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 18px;
  height: 18px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.language-btn .btn-label {
  font-weight: 600;
  color: var(--accent-primary);
}

/* Theme Toggle - 核心亮点设计 */
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px 8px 8px;
  border-radius: 14px;
  border: 2px solid var(--accent-primary);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.theme-toggle::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--accent-soft) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.theme-toggle:hover::before {
  opacity: 1;
}

.theme-toggle:hover {
  border-color: var(--accent-secondary);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.theme-toggle.is-dark {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
  border-color: var(--accent-secondary);
}

.toggle-track {
  position: relative;
  width: 52px;
  height: 28px;
  background: var(--bg-tertiary);
  border-radius: 14px;
  overflow: hidden;
  transition: background 0.3s ease;
}

.theme-toggle.is-dark .toggle-track {
  background: var(--accent-primary);
}

.toggle-icons {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-sun,
.icon-moon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-sun svg {
  width: 16px;
  height: 16px;
  color: #f59e0b;
}

.icon-moon svg {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s ease;
}

.theme-toggle.is-dark .icon-moon svg {
  color: #fef3c7;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1;
}

.theme-toggle.is-dark .toggle-thumb {
  transform: translateX(24px);
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 12px rgba(254, 243, 199, 0.4);
}

.toggle-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  transition: color 0.2s ease;
}

.theme-toggle:hover .toggle-label {
  color: var(--text-primary);
}

/* 响应式 */
@media (max-width: 640px) {
  .toolbar {
    padding: 12px 16px;
  }

  .brand-title {
    font-size: 1.125rem;
  }

  .toggle-label {
    display: none;
  }

  .action-btn {
    padding: 8px 12px;
  }

  .btn-label {
    display: none;
  }
}
</style>
