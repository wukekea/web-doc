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
        <svg viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient
              id="logoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="50%" stop-color="#60a5fa" />
              <stop offset="100%" stop-color="#8b5cf6" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="10"
            fill="url(#logoGradient)"
          />
          <path
            d="M12 20L16 24L24 16"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
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

      <!-- 主题切换 -->
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
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-bottom: 1px solid var(--border-light);
  position: relative;
  z-index: 100;
}

.toolbar::before {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-gradient);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.toolbar:hover::before {
  opacity: 0.3;
}

/* ========================================
   BRAND
   ======================================== */
.toolbar-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  position: relative;
}

.brand-logo::after {
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

.brand-logo:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--shadow-accent);
}

.brand-logo svg {
  width: 100%;
  height: 100%;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.brand-title::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent-gradient);
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: all var(--transition-base);
}

.toolbar-brand:hover .brand-title::after {
  opacity: 0.5;
  transform: scaleX(1);
}

/* ========================================
   ACTIONS
   ======================================== */
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--accent-soft);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.action-btn:hover::before {
  opacity: 1;
}

.action-btn:hover {
  color: var(--accent-primary);
  border-color: var(--accent-soft);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.action-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 18px;
  height: 18px;
  stroke-linecap: round;
  stroke-linejoin: round;
  position: relative;
  z-index: 1;
}

.language-btn .btn-label {
  font-weight: 600;
  color: var(--accent-primary);
  position: relative;
  z-index: 1;
}

/* ========================================
   THEME TOGGLE
   ======================================== */
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 18px 10px 10px;
  border-radius: var(--radius-lg);
  border: 2px solid var(--accent-primary);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.theme-toggle::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--accent-gradient);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.theme-toggle:hover::before {
  opacity: 0.05;
}

.theme-toggle:hover {
  border-color: var(--accent-secondary);
  box-shadow: var(--shadow-accent);
  transform: translateY(-1px);
}

.theme-toggle.is-dark {
  background: var(--accent-medium);
  border-color: var(--accent-secondary);
}

.toggle-track {
  position: relative;
  width: 56px;
  height: 30px;
  background: var(--bg-tertiary);
  border-radius: 15px;
  overflow: hidden;
  transition: background var(--transition-base);
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
  padding: 0 7px;
  transition: transform var(--transition-bounce);
}

.icon-sun,
.icon-moon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.icon-sun svg {
  width: 16px;
  height: 16px;
  color: #f59e0b;
}

.icon-moon svg {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.7);
  transition: color var(--transition-base);
}

.theme-toggle.is-dark .icon-moon svg {
  color: #fef3c7;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-bounce);
  z-index: 1;
}

.theme-toggle.is-dark .toggle-thumb {
  transform: translateX(26px);
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  box-shadow: 0 0 12px rgba(254, 243, 199, 0.4);
}

.toggle-label {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  transition: color var(--transition-fast);
}

.theme-toggle:hover .toggle-label {
  color: var(--text-primary);
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 640px) {
  .toolbar {
    padding: 12px 20px;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;
  }

  .brand-title {
    font-size: 1.25rem;
  }

  .toggle-label {
    display: none;
  }

  .action-btn {
    padding: 8px 14px;
  }

  .btn-label {
    display: none;
  }

  .theme-toggle {
    padding: 8px 10px;
  }

  .toggle-track {
    width: 50px;
    height: 26px;
  }

  .toggle-thumb {
    width: 20px;
    height: 20px;
  }

  .theme-toggle.is-dark .toggle-thumb {
    transform: translateX(24px);
  }

  .icon-sun svg,
  .icon-moon svg {
    width: 14px;
    height: 14px;
  }
}
</style>
