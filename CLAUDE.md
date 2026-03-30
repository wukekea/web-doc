# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 语言要求

**所有文档和代码注释必须使用中文编写，除非是专有名词（如 API、JSON、npm 等）。**

## 项目概述

数字笔记网页应用 - 一个基于思维导图布局的知识笔记管理系统。

## 技术栈

- **前端框架**: Vue 3
- **思维导图**: AntV X6
- **Markdown 渲染**:
- **数据存储**: LocalStorage（后续扩展为后端数据库）
- **构建工具**: Vite
- **国际化**: Vue I18n
- **状态管理**: Pinia

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 项目架构

```
note/
├── src/
│   ├── components/      # Vue 组件
│   │   ├── MindMap/      # 思维导图组件（基于 AntV X6）
│   │   ├── Editor/       # Markdown 编辑器组件
│   │   ├── Toolbar/      # 工具栏组件
│   │   └── ThemeSwitch/  # 日夜模式切换组件
│   ├── stores/           # Pinia 状态管理
│   │   ├── notes.ts      # 笔记数据 store
│   │   └── app.ts        # 应用配置 store（语言、主题）
│   ├── utils/            # 工具函数
│   │   ├── storage.ts    # 存储抽象层（支持切换 LocalStorage/后端）
│   │   └── i18n.ts       # 国际化配置
│   ├── locales/          # 语言文件
│   │   ├── zh-CN.json    # 中文语言包
│   │   └── en-US.json    # 英文语言包
│   ├── types/            # TypeScript 类型定义
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── public/               # 静态资源
└── index.html            # HTML 入口
```

## 核心功能模块

### 1. 国际化（i18n）
- 默认语言：中文
- 支持通过按钮切换中/英文
- 使用 Vue I18n 实现

### 2. 主题切换
- 默认模式：日间模式
- 支持通过按钮切换日间/夜间模式
- 使用 CSS 变量实现主题切换

### 3. 思维导图展示
- 使用 AntV X6 实现节点式布局
- 支持节点的增删改查
- 节点之间建立父子关系，形成知识树

### 4. Markdown 编辑
- 双击节点打开编辑器
- 支持标准 Markdown 语法
- 实时预览

### 5. 数据持久化
- 当前使用 LocalStorage 存储笔记数据
- 设计存储抽象层，便于后续切换到后端数据库
- 数据结构：
  ```typescript
  interface NoteNode {
    id: string;
    title: string;
    content: string;      // Markdown 内容
    children: string[];   // 子节点 ID 列表
    parentId?: string;    // 父节点 ID
    createdAt: number;
    updatedAt: number;
  }
  ```

## 开发注意事项

1. 所有用户界面文本默认中文，通过 i18n 配置多语言支持
2. 节点 ID 使用 UUID 生成
3. 数据变更时自动保存
4. 思维导图支持拖拽和缩放操作
5. 存储层设计为可插拔，便于后续迁移到后端数据库
6. 主题切换使用 CSS 变量，确保样式一致