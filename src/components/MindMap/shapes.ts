import { Graph } from "@antv/x6";

/**
 * 注册自定义笔记节点
 * 包含标题区域和内容预览区域
 */
export function registerNoteNode() {
  Graph.registerNode("note-node", {
    inherit: "rect",
    width: 220,
    height: 100,
    markup: [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "rect",
        selector: "header",
      },
      {
        tagName: "text",
        selector: "title",
      },
      {
        tagName: "text",
        selector: "content",
      },
      {
        tagName: "text",
        selector: "icon",
      },
    ],
    attrs: {
      body: {
        refWidth: "100%",
        refHeight: "100%",
        fill: "#ffffff",
        stroke: "#e5e7eb",
        strokeWidth: 1,
        rx: 12,
        ry: 12,
        filter: {
          name: "dropShadow",
          args: {
            dx: 0,
            dy: 4,
            blur: 12,
            color: "rgba(0,0,0,0.1)",
          },
        },
      },
      header: {
        refWidth: "100%",
        height: 36,
        fill: "#3b82f6",
        rx: 12,
        ry: 12,
        refX: 0,
        refY: 0,
      },
      title: {
        ref: "header",
        refX: 40,
        refY: 0.5,
        textAnchor: "start",
        textVerticalAnchor: "middle",
        fill: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      icon: {
        ref: "header",
        refX: 16,
        refY: 0.5,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        fill: "#ffffff",
        fontSize: 16,
        text: "📝",
      },
      content: {
        refX: 16,
        refY: 56,
        textAnchor: "start",
        fill: "#6b7280",
        fontSize: 12,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
    },
  });
}

/**
 * 夜间主题配置
 */
export const darkTheme = {
  body: {
    fill: "#374151",
    stroke: "#4b5563",
  },
  header: {
    fill: "#2563eb",
  },
  content: {
    fill: "#9ca3af",
  },
};

/**
 * 日间主题配置
 */
export const lightTheme = {
  body: {
    fill: "#ffffff",
    stroke: "#e5e7eb",
  },
  header: {
    fill: "#3b82f6",
  },
  content: {
    fill: "#6b7280",
  },
};

/**
 * 更新节点主题
 */
export function updateNodeTheme(node: any, isDark: boolean) {
  const theme = isDark ? darkTheme : lightTheme;
  node.attr("body/fill", theme.body.fill);
  node.attr("body/stroke", theme.body.stroke);
  node.attr("header/fill", theme.header.fill);
  node.attr("content/fill", theme.content.fill);
}
