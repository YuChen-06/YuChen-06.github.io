# 我的 Astro 博客

这是一个使用 [Astro](https://astro.build) 构建的个人博客，按照官方教程完成。

## 🚀 功能特性

- ✅ **静态站点生成** - 快速加载和 SEO 友好
- ✅ **响应式设计** - 在所有设备上都能完美显示
- ✅ **暗色主题** - 支持明暗主题切换
- ✅ **博客系统** - Markdown 文章支持
- ✅ **标签系统** - 文章分类和标签页面
- ✅ **RSS 订阅** - 支持 RSS feed
- ✅ **组件化** - 可重用的 Astro 组件
- ✅ **动画效果** - 平滑的页面过渡

## 🛠️ 技术栈

- **框架**: Astro 5.x
- **样式**: CSS (原生 CSS 变量)
- **部署**: GitHub Pages
- **包管理**: npm

## 📁 项目结构

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── Social.astro
│   │   └── ThemeToggle.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── MarkdownPostLayout.astro
│   └── pages/
│       ├── index.astro
│       ├── about.astro
│       ├── blog.astro
│       ├── rss.xml.js
│       ├── posts/
│       │   ├── post-1.md
│       │   ├── post-2.md
│       │   └── post-3.md
│       └── tags/
│           ├── index.astro
│           └── [tag].astro
└── package.json
```

## 🚀 快速开始

1. 克隆项目

```bash
git clone <repository-url>
cd proto-plasma
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 构建生产版本

```bash
npm run build
```

5. 部署到 GitHub Pages

```bash
npm run deploy
```

## 📝 添加新文章

在 `src/pages/posts/` 目录下创建新的 `.md` 文件，使用以下格式：

```markdown
---
layout: ../../layouts/MarkdownPostLayout.astro
title: "文章标题"
pubDate: 2024-01-01
description: "文章描述"
author: "作者名"
image:
  url: "图片URL"
  alt: "图片描述"
tags: ["标签1", "标签2"]
---

# 文章内容

这里是文章的正文内容...
```

## 🎨 主题定制

项目使用 CSS 变量来支持主题切换，主要变量定义在 `src/layouts/BaseLayout.astro` 中：

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #dddddd;
  --card-bg: #fafafa;
}

html.dark {
  --bg-color: #1a1a1a;
  --text-color: #e0e0e0;
  --border-color: #333333;
  --card-bg: #2a2a2a;
}
```
