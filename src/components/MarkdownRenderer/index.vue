<script setup lang="ts">
import { computed } from "vue";
import DOMPurify from "dompurify";
import { marked } from "marked";

const props = defineProps<{
  content: string;
}>();

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 渲染并清理 HTML
const renderedHtml = computed(() => {
  if (!props.content) return "";
  const html = marked.parse(props.content) as string;
  return DOMPurify.sanitize(html);
});
</script>

<template>
  <div class="markdown-renderer" v-html="renderedHtml"></div>
</template>

<style scoped>
.markdown-renderer {
  line-height: 1.75;
  color: var(--text-primary);
}

.markdown-renderer :deep(h1),
.markdown-renderer :deep(h2),
.markdown-renderer :deep(h3),
.markdown-renderer :deep(h4),
.markdown-renderer :deep(h5),
.markdown-renderer :deep(h6) {
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  letter-spacing: -0.02em;
}

.markdown-renderer :deep(h1) {
  font-size: 1.875rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5em;
}

.markdown-renderer :deep(h2) {
  font-size: 1.5rem;
}

.markdown-renderer :deep(h3) {
  font-size: 1.25rem;
}

.markdown-renderer :deep(h4) {
  font-size: 1.125rem;
}

.markdown-renderer :deep(p) {
  margin-bottom: 1em;
}

.markdown-renderer :deep(a) {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.markdown-renderer :deep(a:hover) {
  color: var(--accent-secondary);
  text-decoration: underline;
}

.markdown-renderer :deep(ul),
.markdown-renderer :deep(ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.markdown-renderer :deep(li) {
  margin-bottom: 0.5em;
}

.markdown-renderer :deep(code) {
  background: var(--bg-tertiary);
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 0.875em;
  font-family:
    ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace;
}

.markdown-renderer :deep(pre) {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1em 0;
}

.markdown-renderer :deep(pre code) {
  background: transparent;
  padding: 0;
  border-radius: 0;
}

.markdown-renderer :deep(blockquote) {
  border-left: 4px solid var(--accent-primary);
  padding: 0.5em 1em;
  margin: 1em 0;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: 0 12px 12px 0;
}

.markdown-renderer :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.markdown-renderer :deep(th),
.markdown-renderer :deep(td) {
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  text-align: left;
}

.markdown-renderer :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
}

.markdown-renderer :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  margin: 1em 0;
}

.markdown-renderer :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2em 0;
}
</style>
