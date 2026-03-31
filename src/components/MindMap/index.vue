<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch, nextTick } from "vue";
import { Graph } from "@antv/x6";
import { registerNoteNode, updateNodeTheme } from "./shapes";
import { useNotesStore } from "@/stores/notes";
import { useAppStore } from "@/stores/app";
import type { NoteNode } from "@/types";

// 注册自定义节点
registerNoteNode();

const containerRef = ref<HTMLDivElement>();
const graphRef = shallowRef<Graph>();

const notesStore = useNotesStore();
const appStore = useAppStore();

// 定义事件
const emit = defineEmits<{
  (e: "edit", noteId: string): void;
  (e: "add", parentId?: string): void;
}>();

// 节点位置映射
const nodePositions = new Map<string, { x: number; y: number }>();

// 计算节点位置（树形布局）
function calculatePositions(rootIds: string[], notes: Map<string, NoteNode>) {
  nodePositions.clear();

  function layoutNode(id: string, x: number, y: number, level: number) {
    const note = notes.get(id);
    if (!note) return;

    nodePositions.set(id, { x, y });

    // 子节点垂直排列
    let childY = y;
    note.children.forEach((childId) => {
      layoutNode(childId, x + 280, childY, level + 1);
      childY += 140; // 每个子节点间隔
    });
  }

  // 根节点水平居中开始
  let startY = 100;
  rootIds.forEach((rootId) => {
    layoutNode(rootId, 100, startY, 0);
    startY += 200; // 多个根节点的间隔
  });
}

// 创建节点
function createNode(note: NoteNode) {
  const position = nodePositions.get(note.id) || { x: 100, y: 100 };
  const contentPreview = note.content
    ? note.content.slice(0, 40) + (note.content.length > 40 ? "..." : "")
    : "点击编辑内容...";

  return {
    id: note.id,
    shape: "note-node",
    x: position.x,
    y: position.y,
    attrs: {
      title: { text: note.title || "无标题" },
      content: { text: contentPreview },
    },
    data: note,
  };
}

// 创建边
function createEdges(notes: Map<string, NoteNode>) {
  const edges: any[] = [];
  notes.forEach((note) => {
    if (note.parentId) {
      edges.push({
        id: `edge-${note.parentId}-${note.id}`,
        source: note.parentId,
        target: note.id,
        attrs: {
          line: {
            stroke: appStore.theme === "dark" ? "#4b5563" : "#d1d5db",
            strokeWidth: 2,
            targetMarker: null,
          },
        },
        router: {
          name: "manhattan",
          args: {
            padding: 20,
          },
        },
        connector: {
          name: "rounded",
          args: {
            radius: 8,
          },
        },
      });
    }
  });
  return edges;
}

// 渲染图形
function renderGraph() {
  const graph = graphRef.value;
  if (!graph) return;

  graph.clearCells();
  calculatePositions(notesStore.rootIds, notesStore.notes);

  // 创建节点
  notesStore.notes.forEach((note) => {
    graph.addNode(createNode(note));
  });

  // 创建边
  createEdges(notesStore.notes).forEach((edge) => {
    graph.addEdge(edge);
  });

  // 应用主题
  graph.getNodes().forEach((node) => {
    updateNodeTheme(node, appStore.theme === "dark");
  });
}

// 初始化图形
function initGraph() {
  if (!containerRef.value) return;

  const graph = new Graph({
    container: containerRef.value,
    width: containerRef.value.clientWidth,
    height: containerRef.value.clientHeight,
    background: {
      color: "transparent",
    },
    grid: {
      visible: true,
      type: "dot",
      size: 20,
      args: {
        color: appStore.theme === "dark" ? "#374151" : "#e5e7eb",
        thickness: 1,
      },
    },
    panning: {
      enabled: true,
      modifiers: [],
    },
    mousewheel: {
      enabled: true,
      minScale: 0.3,
      maxScale: 2,
    },
    interacting: {
      nodeMovable: true,
    },
  });

  // 双击节点 - 编辑
  graph.on("node:dblclick", ({ node }) => {
    const note = node.getData() as NoteNode;
    emit("edit", note.id);
  });

  // 节点移动 - 保存位置
  graph.on("node:moved", ({ node }) => {
    nodePositions.set(node.id, node.position());
  });

  // 点击空白区域 - 取消选中
  graph.on("blank:click", () => {
    graph.getCells().forEach((cell) => {
      if (cell.isNode()) {
        cell.attr("body/strokeWidth", 1);
      }
    });
  });

  // 点击节点 - 选中效果
  graph.on("node:click", ({ node }) => {
    graph.getNodes().forEach((n) => {
      n.attr("body/strokeWidth", 1);
    });
    node.attr("body/strokeWidth", 3);
    node.attr("body/stroke", "#3b82f6");
  });

  return graph;
}

// 监听窗口大小变化
function handleResize() {
  if (containerRef.value && graphRef.value) {
    graphRef.value.resize(
      containerRef.value.clientWidth,
      containerRef.value.clientHeight,
    );
  }
}

// 监听主题变化
watch(
  () => appStore.theme,
  (newTheme) => {
    const graph = graphRef.value;
    if (!graph) return;

    // 更新网格颜色
    graph.drawGrid({
      type: "dot",
      args: {
        color: newTheme === "dark" ? "#374151" : "#e5e7eb",
        thickness: 1,
      },
    });

    // 更新节点主题
    graph.getNodes().forEach((node) => {
      updateNodeTheme(node, newTheme === "dark");
    });

    // 更新边的颜色
    graph.getEdges().forEach((edge) => {
      edge.attr("line/stroke", newTheme === "dark" ? "#4b5563" : "#d1d5db");
    });
  },
);

// 监听数据变化
watch(
  () => [notesStore.notes, notesStore.rootIds],
  () => {
    nextTick(renderGraph);
  },
  { deep: true },
);

onMounted(async () => {
  await notesStore.init();
  graphRef.value = initGraph();
  renderGraph();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  graphRef.value?.dispose();
});

// 暴露方法
defineExpose({
  refresh: renderGraph,
});
</script>

<template>
  <div
    ref="containerRef"
    class="h-full w-full rounded-xl bg-[var(--bg-secondary)]"
  />
</template>
