import { Graph } from "@antv/x6";

/**
 * 注册自定义笔记节点
 * 软润卡片风格，带标题栏和内容预览
 */
export function registerNoteNode() {
  Graph.registerNode("note-node", {
    inherit: "rect",
    width: 240,
    height: 110,
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
        selector: "icon",
      },
      {
        tagName: "text",
        selector: "title",
      },
      {
        tagName: "text",
        selector: "content",
      },
    ],
    attrs: {
      body: {
        refWidth: "100%",
        refHeight: "100%",
        fill: "#ffffff",
        stroke: "#e5e8eb",
        strokeWidth: 1,
        rx: 16,
        ry: 16,
        filter: {
          name: "dropShadow",
          args: {
            dx: 0,
            dy: 4,
            blur: 16,
            color: "rgba(0,0,0,0.08)",
          },
        },
      },
      header: {
        refWidth: "100%",
        height: 40,
        fill: "#2563eb",
        rx: 16,
        ry: 16,
        refX: 0,
        refY: 0,
      },
      // Cover bottom corners of header
      headerBottom: {
        refWidth: "100%",
        height: 16,
        fill: "#2563eb",
        refX: 0,
        refY: 24,
      },
      icon: {
        ref: "header",
        refX: 18,
        refY: 0.5,
        textAnchor: "start",
        textVerticalAnchor: "middle",
        fill: "#ffffff",
        fontSize: 15,
        text: "📝",
        fontFamily: "Apple Color Emoji, Segoe UI Emoji, sans-serif",
      },
      title: {
        ref: "header",
        refX: 42,
        refY: 0.5,
        textAnchor: "start",
        textVerticalAnchor: "middle",
        fill: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        textOverflow: "ellipsis",
        textWrap: {
          width: 180,
        },
      },
      content: {
        refX: 18,
        refY: 60,
        textAnchor: "start",
        fill: "#6b7280",
        fontSize: 12,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        textOverflow: "ellipsis",
        textWrap: {
          width: 204,
          height: 40,
        },
      },
    },
  });
}

/**
 * 夜间主题配置
 */
export const darkTheme = {
  body: {
    fill: "#1e2530",
    stroke: "#2d3748",
  },
  header: {
    fill: "#3b82f6",
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
    stroke: "#e5e8eb",
  },
  header: {
    fill: "#2563eb",
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
