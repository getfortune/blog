---
trigger: manual
---

# 博客网站项目规则
## 技术栈规范
主框架：Next.js（React框架）

样式库：Tailwind CSS

编程语言：TypeScript（推荐以获得更好的开发体验）

包管理器：yarn


## 项目结构规范
blog-project/
├── components/          # 可复用组件
├── pages/               # 页面路由
│   ├── api/             # API路由
│   ├── posts/           # 博客文章页面
│   └── _app.tsx         # 全局应用组件
├── public/              # 静态资源文件
├── styles/              # 全局样式文件
├── lib/                 # 工具函数和库
└── posts/               # Markdown格式的文章内容

## 组件开发规范
使用函数式组件

尽可能使用TypeScript接口定义props类型

组件应该具有单一职责

组件命名采用PascalCase（大驼峰式命名）


## 样式规范
优先使用Tailwind CSS工具类

对于复杂样式可以使用Tailwind的@apply指令

避免使用内联样式

响应式设计必须适配移动端和桌面端

整体布局文档在屏幕中间最新的文章在最上面左边是人物头像和介绍

## 内容管理规范
博客文章使用Markdown格式存储

文章元数据使用front-matter格式

支持文章分类和标签功能

提供文章搜索功能，可以通过顶部的导航栏搜索也可以使用键盘快捷键（如Ctrl+K）来进行搜索并且搜索结果会自动跳转至对应的文章。
搜索框不需要跳转到一个新的页面，而是在当前页面弹出一个搜索输入框并显示搜索结果点击搜索结果可以自动跳转至对应的文章。

## 性能优化规范
图片资源需要优化和压缩

合理使用静态生成（SSG）和服务器端渲染（SSR）
实现代码分割

使用Next.js Image组件优化图片加载

## 部署规范
使用github进行部署

上传文件时不需上传node_modules和.next文件夹

编写github的actions文件，用于自动部署博客网站到github pages

设置github的部署分支为gh-pages
